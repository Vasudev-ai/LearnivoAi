"use server";

import { cookies } from 'next/headers';
import {
  digitizePaper,
  type DigitizePaperInput,
  type DigitizePaperOutput,
} from "@/ai/flows/digitize-paper-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function digitizePaperAction(
  input: DigitizePaperInput
): Promise<DigitizePaperOutput> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await digitizePaper(input);
    return output;
  } catch (error) {
    console.error("Error in digitizePaperAction:", error);
    throw new Error("Failed to digitize paper.");
  }
}
