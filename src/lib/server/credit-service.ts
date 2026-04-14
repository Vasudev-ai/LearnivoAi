import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc,
  runTransaction, 
  serverTimestamp, 
  collection 
} from 'firebase/firestore';
import { CREDIT_COSTS, DAILY_CREDITS } from '../credit-service';

// Robust Firebase initialization for server-side
const getSafeDb = () => {
    try {
        if (!firebaseConfig.projectId) {
            console.error('CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing from environment!');
            // Fallback to non-prefixed if available
            firebaseConfig.projectId = process.env.FIREBASE_PROJECT_ID || '';
        }

        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        return getFirestore(app);
    } catch (e) {
        console.error('Failed to initialize Firestore on server:', e);
        throw e;
    }
};

const db = getSafeDb();

export interface ServerCreditCheckResult {
  hasEnough: boolean;
  currentCredits: number;
  requiredCredits: number;
  isPremium: boolean;
}

/**
 * Only CHECKS if the user has enough credits without deducting.
 */
export async function serverCheckCredits(userId: string, toolName: string): Promise<ServerCreditCheckResult> {
  try {
    const userRef = doc(db, 'userProfiles', userId);
    const userDoc = await getDoc(userRef);
    const todayDateString = new Date().toDateString();
    
    let userData = userDoc.exists() ? userDoc.data() : null;
    let isPremium = userData?.isPremium || false;
    let currentCredits = (userData?.credits !== undefined && userData?.credits !== null) 
      ? userData.credits 
      : DAILY_CREDITS;
    
    const lastReset = userData?.credits_lastDailyReset;
    const requiredCredits = CREDIT_COSTS[toolName] || 5;

    // Handle daily reset check (for display/check purposes)
    if (!lastReset || new Date(lastReset).toDateString() !== todayDateString) {
      currentCredits = DAILY_CREDITS;
    }

    const hasEnough = isPremium || currentCredits >= requiredCredits;

    return {
      hasEnough,
      currentCredits,
      requiredCredits,
      isPremium
    };
  } catch (error) {
    console.error('Error in serverCheckCredits:', error);
    return { hasEnough: false, currentCredits: 0, requiredCredits: 5, isPremium: false };
  }
}

/**
 * Validates and deducts credits atomically on the backend using the Client SDK.
 * Call this AFTER successful AI generation.
 */
export async function serverDeductCredits(userId: string, toolName: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'userProfiles', userId);
    
    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const todayDateString = new Date().toDateString();
      
      let userData = userDoc.exists() ? userDoc.data() : null;
      let isPremium = userData?.isPremium || false;
      
      // If premium, no need to deduct
      if (isPremium) return true;

      let currentCredits = (userData?.credits !== undefined && userData?.credits !== null) 
        ? userData.credits 
        : DAILY_CREDITS;
      
      const lastReset = userData?.credits_lastDailyReset;
      const requiredCredits = CREDIT_COSTS[toolName] || 5;

      // Handle daily reset logic inside transaction
      if (!lastReset || new Date(lastReset).toDateString() !== todayDateString) {
        currentCredits = DAILY_CREDITS;
      }

      if (currentCredits < requiredCredits) {
        return false; 
      }

      const newCreditsAmount = currentCredits - requiredCredits;
      const updatedData = {
        credits: newCreditsAmount,
        credits_lastDailyReset: new Date(todayDateString).toISOString(), // Keep it consistent
        updatedAt: serverTimestamp()
      };

      if (!userDoc.exists()) {
        transaction.set(userRef, {
          ...updatedData,
          createdAt: serverTimestamp(),
          isPremium: false,
          subscriptionPlan: 'free'
        }, { merge: true });
      } else {
        transaction.update(userRef, updatedData);
      }

      const logRef = doc(collection(db, 'creditLogs'));
      transaction.set(logRef, {
        userId,
        toolName,
        creditsUsed: requiredCredits,
        remainingCredits: newCreditsAmount,
        timestamp: serverTimestamp(),
      });

      return true;
    });
  } catch (error) {
    console.error('ERROR in serverDeductCredits:', error);
    return false;
  }
}
