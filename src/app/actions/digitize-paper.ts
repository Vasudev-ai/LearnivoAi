"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  digitizePaper,
  type DigitizePaperInput,
  type DigitizePaperOutput,
} from "@/ai/flows/digitize-paper-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function digitizePaperAction(
  input: DigitizePaperInput
): Promise<DigitizePaperOutput> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Paper Digitizer');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await digitizePaper(input);
    return output;
  } catch (error) {
    console.error("Error in digitizePaperAction:", error);
    throw new Error("Failed to digitize paper.");
  }
}
