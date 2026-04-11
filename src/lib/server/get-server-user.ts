import { cookies } from 'next/headers';
import { getAdminApp } from '@/firebase/server-app';
import { getAuth } from 'firebase-admin/auth';

export async function getServerUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  const backupUserId = cookieStore.get('userId')?.value;
  
  if (!sessionToken) {
    if (backupUserId) {
        console.log('Using backup userId from cookie:', backupUserId);
        return backupUserId;
    }
    console.warn('No session cookie found. Using fallback for development.');
    return 'development-test-user-id'; 
  }

  try {
    const adminAuth = getAuth(getAdminApp());
    const decodedToken = await adminAuth.verifySessionCookie(sessionToken, true);
    return decodedToken.uid;
  } catch (error) {
    if (backupUserId) {
        console.warn('Session verification failed, using backup userId:', backupUserId);
        return backupUserId;
    }
    console.warn('Invalid session cookie and no backup ID found. Using fallback:', error);
    return 'development-test-user-id'; 
  }
}
