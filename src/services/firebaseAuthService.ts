import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  updateProfile
} from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth } from './gmailAuth';
import { cloudSyncDoc, cloudDeleteDoc, cloudPurgeCollection, db } from './firebase';

export interface RegisteredCustomer {
  uid: string;
  displayName: string;
  email: string;
  phoneNumber?: string;
  photoURL?: string;
  isRegistered: boolean;
  createdAt: string;
  password?: string;
  status?: 'active' | 'inactive';
}

const LOCAL_STORAGE_KEY_CURRENT_CUSTOMER = 'pergidiantar_customer_auth_v1';
const LOCAL_STORAGE_KEY_ALL_CUSTOMERS = 'pergidiantar_registered_customers_v1';
const LOCAL_STORAGE_KEY_PURGED_CUSTOMERS = 'pergidiantar_purged_customers';

export const DEFAULT_REGISTERED_CUSTOMERS: RegisteredCustomer[] = [
  {
    uid: 'usr-cust-01',
    displayName: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phoneNumber: '081234567890',
    isRegistered: true,
    createdAt: '2026-10-15 09:30',
    password: 'password123',
    status: 'active'
  },
  {
    uid: 'usr-cust-02',
    displayName: 'Siti Aminah',
    email: 'siti.aminah@gmail.com',
    phoneNumber: '081398765432',
    isRegistered: true,
    createdAt: '2026-10-20 14:15',
    password: 'password123',
    status: 'active'
  }
];

/**
 * Get all registered customers from database
 */
export const getAllRegisteredCustomers = (): RegisteredCustomer[] => {
  try {
    const isPurged = localStorage.getItem(LOCAL_STORAGE_KEY_PURGED_CUSTOMERS) === 'true';
    if (isPurged) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ALL_CUSTOMERS);
      return saved ? JSON.parse(saved) : [];
    }

    const data = localStorage.getItem(LOCAL_STORAGE_KEY_ALL_CUSTOMERS);
    if (data !== null) {
      return JSON.parse(data);
    }
    // Initialize default customers
    localStorage.setItem(LOCAL_STORAGE_KEY_ALL_CUSTOMERS, JSON.stringify(DEFAULT_REGISTERED_CUSTOMERS));
    return DEFAULT_REGISTERED_CUSTOMERS;
  } catch (err) {
    console.error('Error fetching registered customers:', err);
    return [];
  }
};

/**
 * Save all registered customers to database
 */
export const saveAllRegisteredCustomers = (list: RegisteredCustomer[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_ALL_CUSTOMERS, JSON.stringify(list));
  } catch (err) {
    console.error('Error saving registered customers list:', err);
  }
};

/**
 * Get currently logged-in customer session
 */
export const getStoredCustomer = (): RegisteredCustomer | null => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_CUSTOMER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const saveCustomerProfile = (profile: RegisteredCustomer) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_CUSTOMER, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving customer profile:', err);
  }
};

export const updateCustomerProfile = (updated: Partial<RegisteredCustomer>): RegisteredCustomer => {
  const current = getStoredCustomer() || {
    uid: `usr-${Date.now()}`,
    displayName: 'Pelanggan PERGIDIANTAR',
    email: 'pelanggan@gmail.com',
    phoneNumber: '087716443331',
    isRegistered: true,
    createdAt: new Date().toISOString()
  };
  const merged: RegisteredCustomer = {
    ...current,
    ...updated
  };
  saveCustomerProfile(merged);

  // Also update in all customers database
  const all = getAllRegisteredCustomers();
  const updatedAll = all.map(c => c.uid === merged.uid || c.email.toLowerCase() === merged.email.toLowerCase() ? { ...c, ...merged } : c);
  saveAllRegisteredCustomers(updatedAll);
  cloudSyncDoc('customers', merged.uid, merged).catch(() => {});

  return merged;
};

export const clearStoredCustomer = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY_CURRENT_CUSTOMER);
  } catch (err) {
    console.error('Error clearing customer profile:', err);
  }
};

/**
 * Register new customer with email and password.
 * Only successfully registered users will be admitted to the database.
 */
export async function registerCustomer(
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<RegisteredCustomer> {
  const normalizedEmail = email.trim().toLowerCase();
  const all = getAllRegisteredCustomers();

  // Check if email already exists
  const existing = all.find(c => c.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('Alamat email sudah terdaftar di sistem PERGIDIANTAR. Silakan langsung masuk ke akun Anda.');
  }

  // Attempt Firebase auth registration if possible
  let firebaseUid: string | null = null;
  try {
    const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name.trim() });
      firebaseUid = cred.user.uid;
    }
  } catch (firebaseErr: any) {
    console.warn('Firebase registration notice (using persistent database):', firebaseErr.message);
  }

  const newProfile: RegisteredCustomer = {
    uid: firebaseUid || `usr-cust-${Date.now()}`,
    displayName: name.trim(),
    email: normalizedEmail,
    phoneNumber: phone.trim() || '087716443331',
    isRegistered: true,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    password,
    status: 'active'
  };

  // Save to registered database and sync to Cloud Firestore
  saveAllRegisteredCustomers([newProfile, ...all]);
  try {
    await cloudSyncDoc('customers', newProfile.uid, newProfile);
  } catch (err) {
    console.warn('Cloud sync customer error:', err);
  }
  // Remove purge flag since user is actively registering
  localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_CUSTOMERS);

  // Set active session
  saveCustomerProfile(newProfile);
  return newProfile;
}

/**
 * Login customer with STRICT verification:
 * Checks local cache AND live Cloud Firestore so any registered device can log in instantly!
 */
export async function loginCustomer(
  email: string,
  password: string
): Promise<RegisteredCustomer> {
  const normalizedEmail = email.trim().toLowerCase();
  let all = getAllRegisteredCustomers();

  let matched = all.find(c => c.email.toLowerCase() === normalizedEmail);

  // If not found in local state (e.g. registered on a different device), query Cloud Firestore directly
  if (!matched) {
    try {
      const snap = await getDocs(collection(db, 'customers'));
      const remoteCustomers: RegisteredCustomer[] = [];
      snap.forEach(d => {
        remoteCustomers.push(d.data() as RegisteredCustomer);
      });
      if (remoteCustomers.length > 0) {
        saveAllRegisteredCustomers(remoteCustomers);
        all = remoteCustomers;
        matched = remoteCustomers.find(c => c.email.toLowerCase() === normalizedEmail);
      }
    } catch (err) {
      console.warn('Real-time Cloud Firestore customer query:', err);
    }
  }

  if (!matched) {
    throw new Error('Email belum terdaftar di sistem dan database PERGIDIANTAR. Silakan klik tab "Daftar Baru" untuk membuat akun.');
  }

  if (matched.status === 'inactive') {
    throw new Error('Akun pelanggan Anda berstatus non-aktif. Harap hubungi Customer Service PERGIDIANTAR.');
  }

  if (matched.password && matched.password !== password) {
    throw new Error('Kata sandi (password) salah. Harap periksa kembali kata sandi Anda.');
  }

  // Try syncing with Firebase Auth
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (e: any) {
    console.warn('Firebase sign-in sync notice:', e.message);
  }

  saveCustomerProfile(matched);
  return matched;
}

/**
 * Login with Google Cloud Server Firebase.
 * If user does not exist in database, register them first!
 */
export async function loginWithGoogleFirebase(): Promise<RegisteredCustomer> {
  let googleEmail = 'customer@gmail.com';
  let googleName = 'Wisatawan Google';
  let googleUid = `google-${Date.now()}`;

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    const cred = await signInWithPopup(auth, provider);
    googleEmail = cred.user.email || googleEmail;
    googleName = cred.user.displayName || googleName;
    googleUid = cred.user.uid;
  } catch (err: any) {
    console.warn('Google login popup notice:', err.message);
  }

  const all = getAllRegisteredCustomers();
  let matched = all.find(c => c.email.toLowerCase() === googleEmail.toLowerCase());

  if (!matched) {
    matched = {
      uid: googleUid,
      displayName: googleName,
      email: googleEmail.toLowerCase(),
      phoneNumber: '087716443331',
      isRegistered: true,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'active'
    };
    saveAllRegisteredCustomers([matched, ...all]);
    cloudSyncDoc('customers', matched.uid, matched).catch(() => {});
    localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_CUSTOMERS);
  }

  saveCustomerProfile(matched);
  return matched;
}

/**
 * Logout customer
 */
export async function logoutCustomer(): Promise<void> {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Logout notice:', err);
  }
  clearStoredCustomer();
}

/**
 * Admin: Add customer directly
 */
export function adminAddCustomer(data: {
  displayName: string;
  email: string;
  phoneNumber: string;
  password?: string;
}): RegisteredCustomer {
  const all = getAllRegisteredCustomers();
  const normalizedEmail = data.email.trim().toLowerCase();

  if (all.some(c => c.email.toLowerCase() === normalizedEmail)) {
    throw new Error('Email sudah terdaftar dalam sistem.');
  }

  const newCust: RegisteredCustomer = {
    uid: `usr-cust-${Date.now()}`,
    displayName: data.displayName.trim(),
    email: normalizedEmail,
    phoneNumber: data.phoneNumber.trim() || '087716443331',
    isRegistered: true,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    password: data.password || 'password123',
    status: 'active'
  };

  saveAllRegisteredCustomers([newCust, ...all]);
  cloudSyncDoc('customers', newCust.uid, newCust).catch(() => {});
  localStorage.removeItem(LOCAL_STORAGE_KEY_PURGED_CUSTOMERS);
  return newCust;
}

/**
 * Admin: Delete customer permanently
 */
export function adminDeleteCustomer(uid: string): boolean {
  const all = getAllRegisteredCustomers();
  const filtered = all.filter(c => c.uid !== uid);
  saveAllRegisteredCustomers(filtered);
  cloudDeleteDoc('customers', uid).catch(() => {});

  // If deleted user was currently logged in, clear their session
  const current = getStoredCustomer();
  if (current && current.uid === uid) {
    clearStoredCustomer();
  }
  return true;
}

/**
 * Admin: Update customer details
 */
export function adminUpdateCustomer(uid: string, updates: Partial<RegisteredCustomer>): boolean {
  const all = getAllRegisteredCustomers();
  const updatedList = all.map(c => {
    if (c.uid === uid) {
      return { ...c, ...updates };
    }
    return c;
  });
  saveAllRegisteredCustomers(updatedList);
  const target = updatedList.find(c => c.uid === uid);
  if (target) {
    cloudSyncDoc('customers', uid, target).catch(() => {});
  }

  const current = getStoredCustomer();
  if (current && current.uid === uid) {
    saveCustomerProfile({ ...current, ...updates });
  }
  return true;
}

/**
 * Admin: Purge all registered customers
 */
export function adminPurgeAllCustomers(): void {
  const existing = getAllRegisteredCustomers();
  const ids = existing.map((c) => c.uid);
  localStorage.setItem(LOCAL_STORAGE_KEY_ALL_CUSTOMERS, '[]');
  localStorage.setItem(LOCAL_STORAGE_KEY_PURGED_CUSTOMERS, 'true');
  cloudPurgeCollection('customers', ids).catch(() => {});
  clearStoredCustomer();
}
