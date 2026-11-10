/**
 * Firebase Firestore & Auth integration service for PERGIDIANTAR
 * Handles real-time cloud synchronization, connection testing, and security error formatting.
 */

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocFromServer,
  getDoc,
  collection,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// CRITICAL: Initialize Firestore with the exact database ID from firebase-applet-config.json
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Operation Status:', JSON.stringify(errInfo));
  return errInfo;
}

// Connection test on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, using local persistent cache.');
    }
    return false;
  }
}

// Automatically test connection
testFirestoreConnection().catch(() => {});

/**
 * Real-time cloud sync: Write or update a document in Firestore
 */
export async function cloudSyncDoc(collectionName: string, docId: string, data: any): Promise<boolean> {
  try {
    // Sanitize data: remove functions, undefined fields
    const sanitized = JSON.parse(JSON.stringify(data));
    await setDoc(doc(db, collectionName, String(docId)), sanitized, { merge: true });
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    return false;
  }
}

/**
 * Real-time cloud sync: Seed a document ONLY IF it does not already exist in Firestore.
 * This guarantees that custom data created, modified, or customized by admin
 * is NEVER overwritten or erased during system updates or app restarts.
 */
export async function cloudSyncDocIfNotExists(collectionName: string, docId: string, data: any): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, String(docId));
    const snap = await getDoc(docRef).catch(() => null);
    if (!snap || !snap.exists()) {
      const sanitized = JSON.parse(JSON.stringify(data));
      await setDoc(docRef, sanitized);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Real-time cloud sync: Delete a document in Firestore
 */
export async function cloudDeleteDoc(collectionName: string, docId: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, collectionName, String(docId)));
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
    return false;
  }
}

/**
 * Real-time cloud sync: Purge multiple documents in batch
 */
export async function cloudPurgeCollection(collectionName: string, docIds: string[]): Promise<boolean> {
  if (!docIds || docIds.length === 0) return true;
  try {
    const batch = writeBatch(db);
    docIds.forEach(id => {
      batch.delete(doc(db, collectionName, String(id)));
    });
    await batch.commit();
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, collectionName);
    return false;
  }
}

/**
 * Real-time listener: Listen to collection changes across all online devices
 */
export function cloudSubscribeCollection<T>(
  collectionName: string, 
  onData: (items: T[]) => void
): () => void {
  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef, 
      (snapshot) => {
        if (!snapshot.empty) {
          const items: T[] = [];
          snapshot.forEach(docSnap => {
            items.push(docSnap.data() as T);
          });
          onData(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, collectionName);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.warn(`Error setting up real-time listener for ${collectionName}:`, err);
    return () => {};
  }
}
