
"use server";

import { getAdminAnalytics } from "@/lib/admin-service";
import { adminDb } from "@/lib/firebase-admin";

export async function getAnalyticsAction(userEmail: string) {
  // Hardcoded Admin Security (Replace 'suryatutor48@gmail.com' with your actual email)
  const ADMIN_EMAIL = "suryatutor48@gmail.com"; 

  if (userEmail !== ADMIN_EMAIL) {
    throw new Error("Unauthorized: Access denied.");
  }

  return await getAdminAnalytics();
}

export async function updateUserCreditsAction(adminEmail: string, userId: string, newCredits: number) {
  const ADMIN_EMAIL = "suryatutor48@gmail.com"; 

  if (adminEmail !== ADMIN_EMAIL) {
    throw new Error("Unauthorized: Access denied.");
  }

  await adminDb.collection('userProfiles').doc(userId).update({
    credits: newCredits
  });

  return { success: true };
}
