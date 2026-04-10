import { cookies } from 'next/headers';
import { getAdminApp } from '@/firebase/server-app';

export async function getServerUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  
  if (!sessionToken) {
    return null; // The user didn't send a session cookie
  }

  try {
    const adminAuth = getAdminApp().auth();
    const decodedToken = await adminAuth.verifySessionCookie(sessionToken, true);
    return decodedToken.uid;
  } catch (error) {
    console.warn('Invalid session cookie found in server action:', error);
    return null;
  }
}
