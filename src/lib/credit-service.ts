import { doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export const DAILY_CREDITS = 30;
export const MAX_CREDITS = 100;

export const CREDIT_COSTS: Record<string, number> = {
  'Knowledge Base': 5,
  'Parent Communication': 5,
  'Debate Topics': 5,
  'Rubric Generator': 5,
  'Hyper-Local Content': 5,
  'Lesson Plan': 5,
  'Quiz': 5,
  'Math Helper': 5,
  'Visual Aids': 5,
  'Paper Digitizer': 5,
  'Story': 5,
};

export interface CreditCheckResult {
  hasEnough: boolean;
  currentCredits: number;
  requiredCredits: number;
  isPremium: boolean;
  message: string;
}

export interface CreditDeductResult {
  success: boolean;
  remainingCredits: number;
  creditsUsed: number;
  error?: string;
}

export async function checkUserCredits(
  userId: string,
  toolName: string
): Promise<CreditCheckResult> {
  try {
    const { getApp, getApps } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    
    if (!getApps().length) {
      return {
        hasEnough: false,
        currentCredits: 0,
        requiredCredits: CREDIT_COSTS[toolName] || 1,
        isPremium: false,
        message: 'Firebase not initialized',
      };
    }

    const db = getFirestore(getApp());
    const userDocRef = doc(db, 'userProfiles', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        hasEnough: false,
        currentCredits: 0,
        requiredCredits: CREDIT_COSTS[toolName] || 1,
        isPremium: false,
        message: 'User profile not found',
      };
    }

    const userData = userDoc.data();
    const todayDateString = new Date().toDateString();
    const lastReset = userData.credits_lastDailyReset;
    
    let shouldReset = false;
    if (!lastReset || new Date(lastReset).toDateString() !== todayDateString) {
      shouldReset = true;
    }

    // If credits field is missing/undefined, treat as full daily credits (not 0)
    let currentCredits = userData.credits !== undefined && userData.credits !== null
      ? userData.credits
      : DAILY_CREDITS;
      
    if (shouldReset) {
      currentCredits = DAILY_CREDITS;
      await updateDoc(userDocRef, {
        credits: DAILY_CREDITS,
        credits_lastDailyReset: new Date().toISOString()
      });
    }
    const isPremium = userData.isPremium || false;

    const requiredCredits = CREDIT_COSTS[toolName] || 5;
    const hasEnough = isPremium || currentCredits >= requiredCredits;

    return {
      hasEnough,
      currentCredits,
      requiredCredits,
      isPremium,
      message: hasEnough ? 'Sufficient credits' : 'Insufficient credits',
    };
  } catch (error) {
    console.error('Error checking credits:', error);
    return {
      hasEnough: false,
      currentCredits: 0,
      requiredCredits: CREDIT_COSTS[toolName] || 1,
      isPremium: false,
      message: 'Error checking credits',
    };
  }
}

export async function deductCredits(
  userId: string,
  toolName: string
): Promise<CreditDeductResult> {
  try {
    const { getApp, getApps } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    
    if (!getApps().length) {
      return {
        success: false,
        remainingCredits: 0,
        creditsUsed: 0,
        error: 'Firebase not initialized',
      };
    }

    const db = getFirestore(getApp());
    const userDocRef = doc(db, 'userProfiles', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      return {
        success: false,
        remainingCredits: 0,
        creditsUsed: 0,
        error: 'User profile not found',
      };
    }

    const userData = userDoc.data();
    const todayDateString = new Date().toDateString();
    const lastReset = userData.credits_lastDailyReset;

    // If credits field is missing/undefined, treat as full daily credits (not 0)
    let currentCredits = userData.credits !== undefined && userData.credits !== null
      ? userData.credits
      : DAILY_CREDITS;
      
    if (!lastReset || new Date(lastReset).toDateString() !== todayDateString) {
      currentCredits = DAILY_CREDITS;
      await updateDoc(userDocRef, {
        credits: currentCredits,
        credits_lastDailyReset: new Date().toISOString()
      });
    } else if (userData.credits === undefined || userData.credits === null) {
      await updateDoc(userDocRef, { credits: DAILY_CREDITS });
    }

    const isPremium = userData.isPremium || false;

    if (isPremium) {
      return {
        success: true,
        remainingCredits: currentCredits,
        creditsUsed: 0,
      };
    }

    const creditsToUse = CREDIT_COSTS[toolName] || 5;

    if (currentCredits < creditsToUse) {
      return {
        success: false,
        remainingCredits: currentCredits,
        creditsUsed: 0,
        error: 'Insufficient credits',
      };
    }

    const newCredits = currentCredits - creditsToUse;
    
    await updateDoc(userDocRef, {
      credits: newCredits,
    });

    await logCreditUsage(db, userId, toolName, creditsToUse, newCredits);

    return {
      success: true,
      remainingCredits: newCredits,
      creditsUsed: creditsToUse,
    };
  } catch (error) {
    console.error('Error deducting credits:', error);
    return {
      success: false,
      remainingCredits: 0,
      creditsUsed: 0,
      error: 'Error deducting credits',
    };
  }
}

export async function initializeUserCredits(userId: string): Promise<void> {
  try {
    const { getApp, getApps } = await import('firebase/app');
    const { getFirestore } = await import('firebase/firestore');
    
    if (!getApps().length) return;

    const db = getFirestore(getApp());
    const userDocRef = doc(db, 'userProfiles', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) return;
    
    const userData = userDoc.data();
    const todayDateString = new Date().toDateString();
    const lastReset = userData.credits_lastDailyReset;
    
    if (!lastReset || new Date(lastReset).toDateString() !== todayDateString) {
      await updateDoc(userDocRef, { 
        credits: DAILY_CREDITS,
        credits_lastDailyReset: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Error initializing credits:', error);
  }
}

async function logCreditUsage(
  db: any,
  userId: string,
  toolName: string,
  creditsUsed: number,
  remainingCredits: number
): Promise<void> {
  try {
    const creditLogRef = doc(db, 'creditLogs', `${userId}_${Date.now()}`);
    
    await setDoc(creditLogRef, {
      userId,
      toolName,
      creditsUsed,
      remainingCredits,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error logging credit usage:', error);
  }
}

export function getCreditCost(toolName: string): number {
  return CREDIT_COSTS[toolName] || 1;
}

export function getTimeUntilReset(): string {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}m`;
}

export function formatCreditDisplay(credits: number, maxCredits: number): string {
  return `${credits}/${maxCredits}`;
}

export function getCreditPercentage(credits: number, maxCredits: number): number {
  return Math.round((credits / maxCredits) * 100);
}

export interface CreditLogEntry {
  id: string;
  toolName: string;
  creditsUsed: number;
  remainingCredits: number;
  timestamp: Date;
}

export async function getRecentCreditLogs(userId: string, limit: number = 10): Promise<CreditLogEntry[]> {
  try {
    const { getApp, getApps } = await import('firebase/app');
    const { getFirestore, collection, query, where, limit: firestoreLimit, getDocs, getCountFromServer } = await import('firebase/firestore');
    
    if (!getApps().length) {
      return [];
    }

    const db = getFirestore(getApp());
    const creditLogsRef = collection(db, 'creditLogs');
    
    const q = query(
      creditLogsRef,
      where('userId', '==', userId),
      firestoreLimit(100)
    );
    
    const snapshot = await getDocs(q);
    
    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as CreditLogEntry[];
    
    logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return logs.slice(0, limit);
  } catch (error) {
    console.error('Error fetching credit logs:', error);
    return [];
  }
}

export function getToolIcon(toolName: string): string {
  const icons: Record<string, string> = {
    'Knowledge Base': 'KB',
    'Quiz': 'QZ',
    'Story': 'ST',
    'Lesson Plan': 'LP',
    'Visual Aids': 'VA',
    'Math Helper': 'MH',
    'Rubric Generator': 'RG',
    'Debate Topics': 'DT',
    'Hyper-Local Content': 'HL',
    'Parent Communication': 'PC',
    'Paper Digitizer': 'PD',
  };
  return icons[toolName] || 'AI';
}

export function getToolLink(toolName: string): string {
  const links: Record<string, string> = {
    'Knowledge Base': '/knowledge-base',
    'Quiz': '/quiz-generator',
    'Story': '/story-generator',
    'Lesson Plan': '/lesson-planner',
    'Visual Aids': '/visual-aids',
    'Math Helper': '/math-helper',
    'Rubric Generator': '/rubric-generator',
    'Debate Topics': '/debate-topic-generator',
    'Hyper-Local Content': '/hyper-local-content',
    'Parent Communication': '/parent-communication',
    'Paper Digitizer': '/paper-digitizer',
  };
  return links[toolName] || '/';
}
