"use server";

import { getServerUser } from '@/lib/server/get-server-user';
import { serverCheckCredits, serverDeductCredits } from '@/lib/server/credit-service';
import {
  generateLessonPlan,
  type GenerateLessonPlanInput,
  type GenerateLessonPlanOutput,
} from "@/ai/flows/generate-lesson-plan";
import { checkRateLimit } from "@/lib/rate-limit";

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
  
  // 1. Check credits first (Read only)
  const { hasEnough } = await serverCheckCredits(userId, 'Lesson Plan');
  if (!hasEnough) {
    throw new Error("Insufficient credits to generate lesson plan.");
  }
  
  try {
    // 2. Perform AI operation
    const output = await generateLessonPlan(input);
    
    // 3. SECURE BACKEND CREDIT DEDUCTION (Only on success)
    await serverDeductCredits(userId, 'Lesson Plan');
    
    return output;
  } catch (error) {
    console.error("Error in generateLessonPlanAction:", error);
    throw new Error("Failed to generate lesson plan.");
  }
}
