
import { getFirestore } from 'firebase-admin/firestore';
import { getAdminApp } from '@/firebase/server-app';

const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
