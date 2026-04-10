"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  generateHyperLocalContent,
  type GenerateHyperLocalContentInput,
  type GenerateHyperLocalContentOutput,
} from "@/ai/flows/generate-hyper-local-content";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateHyperLocalContentAction(
  input: GenerateHyperLocalContentInput
): Promise<GenerateHyperLocalContentOutput | null> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Hyper-Local Content');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await generateHyperLocalContent(input);
    return output;
  } catch (error) {
    console.error("Error in generateHyperLocalContentAction:", error);
    throw new Error("Failed to generate hyper-local content.");
  }
}
