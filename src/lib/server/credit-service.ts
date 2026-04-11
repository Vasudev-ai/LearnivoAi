import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  runTransaction, 
  serverTimestamp, 
  collection 
} from 'firebase/firestore';
import { CREDIT_COSTS, DAILY_CREDITS } from '../credit-service';

// Initialize Firebase Client SDK on the server side
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export interface ServerCreditCheckResult {
  hasEnough: boolean;
  currentCredits: number;
  requiredCredits: number;
  isPremium: boolean;
}

/**
 * Validates and deducts credits atomically on the backend using the Client SDK.
 * This uses the .env keys and doesn't require a Service Account.
 */
export async function serverDeductCredits(userId: string, toolName: string): Promise<boolean> {
  try {
    const userRef = doc(db, 'userProfiles', userId);
    
    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      const todayDateString = new Date().toDateString();
      
      let userData = userDoc.exists() ? userDoc.data() : null;
      let isPremium = userData?.isPremium || false;
      let currentCredits = (userData?.credits !== undefined && userData?.credits !== null) 
        ? userData.credits 
        : DAILY_CREDITS;
      
      const lastReset = userData?.credits_lastDailyReset;
      const requiredCredits = CREDIT_COSTS[toolName] || 5;

      // Handle daily reset
      if (!lastReset || new Date(lastReset).toDateString() !== todayDateString) {
        currentCredits = DAILY_CREDITS;
      }

      if (!isPremium && currentCredits < requiredCredits) {
        console.warn(`User ${userId} has insufficient credits: ${currentCredits} < ${requiredCredits}`);
        return false; 
      }

      const newCreditsAmount = isPremium ? currentCredits : currentCredits - requiredCredits;
      const updatedData = {
        credits: newCreditsAmount,
        credits_lastDailyReset: new Date().toISOString(),
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

      // Add log entry
      const logRef = doc(collection(db, 'creditLogs')); // Auto-generate ID
      transaction.set(logRef, {
        userId,
        toolName,
        creditsUsed: isPremium ? 0 : requiredCredits,
        remainingCredits: newCreditsAmount,
        timestamp: serverTimestamp(),
      });

      return true;
    });
  } catch (error) {
    console.error('ERROR in serverDeductCredits (Client SDK mode):', error);
    // If it's a permission error, it means Firestore Rules are blocking the server
    return false;
  }
}
