"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  generateVisualAid,
  type GenerateVisualAidInput,
  type GenerateVisualAidOutput,
} from "@/ai/flows/generate-visual-aid-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateVisualAidAction(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Visual Aids');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await generateVisualAid(input);
    return output;
  } catch (error) {
    console.error("Error in generateVisualAidAction:", error);
    throw new Error("Failed to generate visual aid.");
  }
}
