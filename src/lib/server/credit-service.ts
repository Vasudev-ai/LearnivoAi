import { getAdminApp } from '@/firebase/server-app';
import { FieldValue } from 'firebase-admin/firestore';
import { CREDIT_COSTS, DAILY_CREDITS } from '../credit-service';

export interface ServerCreditCheckResult {
  hasEnough: boolean;
  currentCredits: number;
  requiredCredits: number;
  isPremium: boolean;
}

/**
 * Validates and deducts credits atomically on the backend using the Admin SDK.
 * Call this BEFORE generating AI content in a Server Action.
 */
export async function serverDeductCredits(userId: string, toolName: string): Promise<boolean> {
  const db = getAdminApp().firestore();
  const userRef = db.collection('userProfiles').doc(userId);
  
  try {
    return await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data()!;
      const isPremium = userData.isPremium || false;
      const requiredCredits = CREDIT_COSTS[toolName] || 5;

      if (isPremium) {
        // Premium users don't need point deduction validation
        return true;
      }

      const todayDateString = new Date().toDateString();
      const lastReset = userData.credits_lastDailyReset;
      let currentCredits = userData.credits !== undefined ? userData.credits : DAILY_CREDITS;

      // Handle daily reset within the transaction
      if (!lastReset || new Date(lastReset).toDateString() !== todayDateString) {
        currentCredits = DAILY_CREDITS;
      }

      if (currentCredits < requiredCredits) {
        return false; // Not enough credits
      }

      const newCreditsAmount = currentCredits - requiredCredits;

      // Update the user profile with the deducted amount and updated reset date
      transaction.update(userRef, {
        credits: newCreditsAmount,
        credits_lastDailyReset: new Date().toISOString()
      });

      // Insert into logs
      const logRef = db.collection('creditLogs').doc(`${userId}_${Date.now()}`);
      transaction.set(logRef, {
        userId,
        toolName,
        creditsUsed: requiredCredits,
        remainingCredits: newCreditsAmount,
        timestamp: FieldValue.serverTimestamp(),
      });

      return true;
    });
  } catch (error) {
    console.error('Server side credit deduction failed:', error);
    return false;
  }
}
