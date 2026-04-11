"use server";

import { getServerUser } from '@/lib/server/get-server-user';
import { serverCheckCredits, serverDeductCredits } from '@/lib/server/credit-service';
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
  
  // 1. Check credits first (Read only)
  const { hasEnough } = await serverCheckCredits(userId, 'Paper Digitizer');
  if (!hasEnough) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    // 2. Perform AI operation
    const output = await digitizePaper(input);
    
    // 3. SECURE BACKEND CREDIT DEDUCTION (Only on success)
    await serverDeductCredits(userId, 'Paper Digitizer');
    
    return output;
  } catch (error) {
    console.error("Error in digitizePaperAction:", error);
    throw new Error("Failed to digitize paper.");
  }
}
