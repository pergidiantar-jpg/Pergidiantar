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
import { 
  checkLoginLockout, 
  recordFailedLogin, 
  resetLoginLockout, 
  verifySecurePassword, 
  logSecurityEvent, 
  generateSessionToken,
  sanitizeAuthInput 
} from './secureAuthService';

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
  sessionToken?: string;
  lastLoginAt?: string;
}

const LOCAL_STORAGE_KEY_CURRENT_CUSTOMER = 'pergidiantar_customer_auth_v1';
const LOCAL_STORAGE_KEY_ALL_CUSTOMERS = 'pergidiantar_registered_customers_v1';
const LOCAL_STORAGE_KEY_PURGED_CUSTOMERS = 'pergidiantar_purged_customers';

export const DEFAULT_REGISTERED_CUSTOMERS: RegisteredCustomer[] = [];

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
    return [];
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
  const cleanName = sanitizeAuthInput(name);
  const normalizedEmail = sanitizeAuthInput(email).toLowerCase();
  const cleanPhone = sanitizeAuthInput(phone);

  if (!cleanName || cleanName.length < 2) {
    throw new Error('Nama lengkap wajib diisi minimal 2 karakter.');
  }

  if (!normalizedEmail || !normalizedEmail.includes('@') || !normalizedEmail.includes('.')) {
    throw new Error('Format alamat email tidak valid.');
  }

  if (!password || password.length < 6) {
    throw new Error('Kata sandi wajib diisi minimal 6 karakter demi keamanan akun.');
  }

  const all = getAllRegisteredCustomers();

  // Check if email already exists
  const existing = all.find(c => c.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('Alamat email sudah terdaftar di sistem PERGIDIANTAR. Silakan langsung masuk ke akun Anda.');
  }

  // Attempt Firebase auth registration if possible
  let firebaseUid: string | null = null;
  try {
    const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: cleanName });
      firebaseUid = cred.user.uid;
    }
  } catch (firebaseErr: any) {
    console.warn('Firebase registration notice (using persistent database):', firebaseErr.message);
  }

  const sessionToken = generateSessionToken(firebaseUid || `usr-cust-${Date.now()}`, 'customer');
  const newProfile: RegisteredCustomer = {
    uid: firebaseUid || `usr-cust-${Date.now()}`,
    displayName: cleanName,
    email: normalizedEmail,
    phoneNumber: cleanPhone || '087716443331',
    isRegistered: true,
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    password,
    status: 'active',
    sessionToken,
    lastLoginAt: new Date().toISOString()
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

  // Security audit log to Cloud Firestore
  logSecurityEvent({
    email: normalizedEmail,
    role: 'customer',
    status: 'success',
    reason: 'Registrasi Pelanggan Baru Berhasil'
  });

  // Set active session
  saveCustomerProfile(newProfile);
  return newProfile;
}

/**
 * Login customer with SECURE verification:
 * Enforces brute-force lockout, password verification, audit logging,
 * and live Cloud Firestore synchronization across all devices.
 */
export async function loginCustomer(
  email: string,
  password: string
): Promise<RegisteredCustomer> {
  const normalizedEmail = sanitizeAuthInput(email).toLowerCase();
  const cleanPass = (password || '').trim();

  if (!normalizedEmail) {
    throw new Error('Alamat email wajib diisi.');
  }
  if (!cleanPass) {
    throw new Error('Kata sandi wajib diisi.');
  }

  // 1. Brute-force Lockout Check
  const lockout = checkLoginLockout(normalizedEmail);
  if (lockout.isLocked) {
    logSecurityEvent({
      email: normalizedEmail,
      role: 'customer',
      status: 'locked',
      reason: 'Akses diblokir sementara karena proteksi brute force'
    });
    throw new Error(`Akses ditolak sementara: Terlalu banyak percobaan login salah. Akun Anda dikunci selama ${lockout.remainingSeconds} detik demi keamanan data.`);
  }

  let all = getAllRegisteredCustomers();
  let matched = all.find(c => c.email.toLowerCase() === normalizedEmail);

  // If not found in local cache (e.g. registered on a different device), query Cloud Firestore directly
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
    recordFailedLogin(normalizedEmail);
    logSecurityEvent({
      email: normalizedEmail,
      role: 'customer',
      status: 'failed',
      reason: 'Email tidak ditemukan di sistem'
    });
    throw new Error('Alamat email tidak terdaftar di sistem PERGIDIANTAR. Silakan daftar akun baru terlebih dahulu.');
  }

  if (matched.status === 'inactive') {
    logSecurityEvent({
      email: normalizedEmail,
      role: 'customer',
      status: 'failed',
      reason: 'Akun pelanggan non-aktif'
    });
    throw new Error('Akun pelanggan Anda berstatus non-aktif. Harap hubungi Customer Service PERGIDIANTAR.');
  }

  // 2. Strict Password Verification
  const isPassValid = await verifySecurePassword(cleanPass, matched.password);
  if (!isPassValid) {
    const fail = recordFailedLogin(normalizedEmail);
    logSecurityEvent({
      email: normalizedEmail,
      role: 'customer',
      status: fail.isLocked ? 'locked' : 'failed',
      reason: 'Kata sandi salah'
    });

    if (fail.isLocked) {
      throw new Error(`Kata sandi salah. Akun Anda dikunci sementara selama 5 menit untuk proteksi keamanan (${fail.attempts}x percobaan gagal).`);
    }
    throw new Error(`Kata sandi salah. Harap periksa kembali kata sandi Anda. (Sisa percobaan login: ${5 - fail.attempts}x)`);
  }

  // 3. Login Success: Reset lockout counter, generate session token, record audit
  resetLoginLockout(normalizedEmail);

  const sessionToken = generateSessionToken(matched.uid, 'customer');
  const updatedCustomer: RegisteredCustomer = {
    ...matched,
    sessionToken,
    lastLoginAt: new Date().toISOString()
  };

  // Sync session and audit log to Cloud Firestore
  cloudSyncDoc('customers', matched.uid, updatedCustomer).catch(() => {});
  logSecurityEvent({
    email: normalizedEmail,
    role: 'customer',
    status: 'success',
    reason: 'Login Pelanggan Berhasil (Sesi Aman)'
  });

  // Try syncing with Firebase Auth in background
  try {
    await signInWithEmailAndPassword(auth, normalizedEmail, cleanPass);
  } catch (e: any) {
    console.warn('Firebase sign-in notice:', e.message);
  }

  saveCustomerProfile(updatedCustomer);
  return updatedCustomer;
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
