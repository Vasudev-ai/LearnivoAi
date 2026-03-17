
import { adminDb } from './firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export interface UsageLog {
  userId: string;
  userEmail: string;
  userName: string;
  toolName: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  creditsUsed: number;
  timestamp: any;
  prompt?: string;
  model: string;
}

export const USAGE_COLLECTION = 'usage_logs';
export const PROFILES_COLLECTION = 'userProfiles';

/**
 * Logs AI usage and deducts credits from user profile
 */
export async function logUsageAndDeductCredits(log: Omit<UsageLog, 'timestamp'>) {
  try {
    const fullLog: UsageLog = {
      ...log,
      timestamp: FieldValue.serverTimestamp(),
    };

    // 1. Save usage log
    await adminDb.collection(USAGE_COLLECTION).add(fullLog);

    // 2. Update Aggregates (Reduces Reads for Dashboard)
    const statsRef = adminDb.collection('system_stats').doc('global');
    await statsRef.set({
      totalTokens: FieldValue.increment(log.totalTokens),
      totalCredits: FieldValue.increment(log.creditsUsed),
      totalRequests: FieldValue.increment(1),
      [`toolUsage.${log.toolName.replace(/\s+/g, '_')}`]: FieldValue.increment(1),
      lastUpdated: FieldValue.serverTimestamp()
    }, { merge: true });

    // 3. Deduct credits from user profile
    const userRef = adminDb.collection(PROFILES_COLLECTION).doc(log.userId);
    
    // We use a transaction or simply update with increment
    // For now, let's just use increment (negative value to deduct)
    await userRef.update({
      credits: FieldValue.increment(-log.creditsUsed)
    });

    console.log(`[UsageService] Logged ${log.creditsUsed} credits for user ${log.userId} (${log.toolName})`);
  } catch (error) {
    console.error('[UsageService] Error logging usage:', error);
    // We don't throw here to avoid failing the main AI task if logging fails, 
    // though in production you might want to handle this more strictly.
  }
}

/**
 * Calculates credits based on tokens and tool type
 * This is a placeholder logic. You can refine this.
 */
export function calculateCredits(tokens: number, toolType: string): number {
  let baseRate = 1; // 1 credit per 1000 tokens as base
  
  if (toolType === 'Story Generator') {
    baseRate = 5; // Stories are more expensive
  }
  
  return Math.ceil((tokens / 1000) * baseRate);
}
