"use server";

import { cookies } from 'next/headers';
import {
  generateLessonPlan,
  type GenerateLessonPlanInput,
  type GenerateLessonPlanOutput,
} from "@/ai/flows/generate-lesson-plan";
import { checkRateLimit } from "@/lib/rate-limit";

import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';

export async function generateLessonPlanAction(
  input: GenerateLessonPlanInput
): Promise<GenerateLessonPlanOutput | null> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION BEFORE API CALL
  const hasCredits = await serverDeductCredits(userId, 'Lesson Plan');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate lesson plan.");
  }
  
  try {
    const output = await generateLessonPlan(input);
    return output;
  } catch (error) {
    console.error("Error in generateLessonPlanAction:", error);
    throw new Error("Failed to generate lesson plan.");
  }
}
