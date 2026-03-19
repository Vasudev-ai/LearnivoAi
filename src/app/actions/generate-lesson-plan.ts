"use server";

import { cookies } from 'next/headers';
import {
  generateLessonPlan,
  type GenerateLessonPlanInput,
  type GenerateLessonPlanOutput,
} from "@/ai/flows/generate-lesson-plan";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateLessonPlanAction(
  input: GenerateLessonPlanInput
): Promise<GenerateLessonPlanOutput | null> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateLessonPlan(input);
    return output;
  } catch (error) {
    console.error("Error in generateLessonPlanAction:", error);
    throw new Error("Failed to generate lesson plan.");
  }
}
