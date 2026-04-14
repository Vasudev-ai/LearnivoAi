
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';

let serviceAccount: any;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }
} catch (e) {
  console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', e);
}

let adminApp: App;

if (getApps().length === 0) {
  if (serviceAccount && serviceAccount.project_id) {
    adminApp = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('Firebase Admin initialized with service account');
  } else {
    console.warn('No valid service account, using default initialization');
    adminApp = initializeApp();
  }
} else {
  adminApp = getApps()[0];
}

export function getAdminApp() {
  return adminApp;
}
