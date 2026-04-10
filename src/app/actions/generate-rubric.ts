"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  generateRubric,
  type GenerateRubricInput,
  type GenerateRubricOutput,
} from "@/ai/flows/generate-rubric-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateRubricAction(
  input: GenerateRubricInput
): Promise<GenerateRubricOutput | null> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Rubric Generator');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await generateRubric(input);
    return output;
  } catch (error) {
    console.error("Error in generateRubricAction:", error);
    throw new Error("Failed to generate rubric.");
  }
}
