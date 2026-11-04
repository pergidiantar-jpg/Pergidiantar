import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.setCustomParameters({
  prompt: 'select_account'
});

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
    } else {
      if (!isSigningIn && onAuthFailure) {
        onAuthFailure();
      }
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.warn('Google Sign-in status:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Encodes string to Base64URL without padding
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends actual email using Gmail API
 */
export async function sendActualGmail(
  to: string,
  subject: string,
  bodyText: string,
  fromEmail: string = 'pergi.diantar@gmail.com'
): Promise<{ success: boolean; id?: string; error?: string }> {
  const token = getAccessToken();
  if (!token) {
    return { success: false, error: 'Token Google OAuth tidak aktif' };
  }

  try {
    const emailLines = [
      `From: "PERGIDIANTAR Tour & Travel" <${fromEmail}>`,
      `To: ${to}`,
      `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 8bit',
      '',
      bodyText
    ];

    const rawMessage = emailLines.join('\r\n');
    const encodedMessage = base64UrlEncode(rawMessage);

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        raw: encodedMessage
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return { success: false, error: JSON.stringify(errData) };
    }

    const data = await response.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    return { success: false, error: err.message || 'Gagal mengirim email via Gmail' };
  }
}
