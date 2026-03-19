
"use server";

import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

interface FeedbackData {
  concept: string;
  visualType: string;
  generatedSvg: string;
  rating: 'good' | 'bad';
  comment?: string;
  userId: string;
}

export async function submitVisualAidFeedbackAction(data: FeedbackData): Promise<{ success: boolean }> {
  try {
    await adminDb.collection('visualAidFeedbacks').add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error submitting visual aid feedback:", error);
    return { success: false };
  }
}
