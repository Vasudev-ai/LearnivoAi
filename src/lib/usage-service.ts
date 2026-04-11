import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc, 
  updateDoc, 
  increment, 
  serverTimestamp 
} from 'firebase/firestore';

// Robust Firebase initialization for server-side usage
const getSafeDb = () => {
    try {
        if (!firebaseConfig.projectId) {
            console.error('[UsageService] CRITICAL: NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing!');
            firebaseConfig.projectId = process.env.FIREBASE_PROJECT_ID || '';
        }
        const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
        return getFirestore(app);
    } catch (e) {
        console.error('[UsageService] Initialization failed:', e);
        throw e;
    }
};

const db = getSafeDb();

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
    const fullLog = {
      ...log,
      timestamp: serverTimestamp(),
    };

    // 1. Save usage log
    await addDoc(collection(db, USAGE_COLLECTION), fullLog);

    // 2. Update Aggregates (Reduces Reads for Dashboard)
    const statsRef = doc(db, 'system_stats', 'global');
    await setDoc(statsRef, {
      totalTokens: increment(log.totalTokens),
      totalCredits: increment(log.creditsUsed),
      totalRequests: increment(1),
      [`toolUsage.${log.toolName.replace(/\s+/g, '_')}`]: increment(1),
      lastUpdated: serverTimestamp()
    }, { merge: true });

    // 3. Deduct credits from user profile
    const userRef = doc(db, PROFILES_COLLECTION, log.userId);
    
    await updateDoc(userRef, {
      credits: increment(-log.creditsUsed)
    });

    console.log(`[UsageService] Logged ${log.creditsUsed} credits for user ${log.userId} (${log.toolName})`);
  } catch (error) {
    console.error('[UsageService] Error logging usage:', error);
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
