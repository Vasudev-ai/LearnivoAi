import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { DAILY_CREDITS, MAX_CREDITS } from './credit-service';

const DEFAULT_PROFILE_FIELDS = {
  autoSave: true,
  credits: DAILY_CREDITS,
  credits_daily: DAILY_CREDITS,
  credits_monthly: MAX_CREDITS,
  credits_lastDailyReset: new Date().toISOString(),
  creativityLevel: 'balanced' as const,
  defaultLanguage: 'English',
  defaultGrade: '',
  isPremium: false,
  subscriptionPlan: 'free' as const,
};

export async function migrateUserProfile(
  firestore: any,
  userId: string
): Promise<{ success: boolean; updatedFields: string[] }> {
  try {
    const userDocRef = doc(firestore, 'userProfiles', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return { success: false, updatedFields: [] };
    }

    const userData = userDoc.data();
    const updates: Record<string, any> = {};
    const updatedFields: string[] = [];

    for (const [key, defaultValue] of Object.entries(DEFAULT_PROFILE_FIELDS)) {
      if (userData[key] === undefined) {
        updates[key] = defaultValue;
        updatedFields.push(key);
      }
    }

    if (updatedFields.length > 0) {
      await updateDoc(userDocRef, updates);
      return { success: true, updatedFields };
    }

    return { success: true, updatedFields: [] };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, updatedFields: [] };
  }
}

export async function migrateAllUsers(firestore: any): Promise<{
  totalUsers: number;
  migratedUsers: number;
  failedUsers: number;
}> {
  try {
    const { collection, getDocs, query } = await import('firebase/firestore');
    const userProfilesRef = collection(firestore, 'userProfiles');
    const snapshot = await getDocs(query(userProfilesRef));

    let migratedUsers = 0;
    let failedUsers = 0;

    for (const userDoc of snapshot.docs) {
      const result = await migrateUserProfile(firestore, userDoc.id);
      if (result.success && result.updatedFields.length > 0) {
        migratedUsers++;
        console.log(`Migrated user ${userDoc.id}: added ${result.updatedFields.join(', ')}`);
      } else if (!result.success) {
        failedUsers++;
        console.error(`Failed to migrate user ${userDoc.id}`);
      }
    }

    return {
      totalUsers: snapshot.size,
      migratedUsers,
      failedUsers,
    };
  } catch (error) {
    console.error('Migration error:', error);
    return { totalUsers: 0, migratedUsers: 0, failedUsers: 0 };
  }
}
