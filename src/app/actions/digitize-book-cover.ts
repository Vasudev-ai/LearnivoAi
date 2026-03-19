"use server";

import { cookies } from 'next/headers';
import {
  digitizeBookCover,
  type DigitizeBookCoverInput,
  type DigitizeBookCoverOutput,
} from "@/ai/flows/digitize-book-cover-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function digitizeBookCoverAction(
  input: DigitizeBookCoverInput
): Promise<DigitizeBookCoverOutput> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await digitizeBookCover(input);
    return output;
  } catch (error) {
    console.error("Error in digitizeBookCoverAction:", error);
    throw new Error("Failed to digitize book cover.");
  }
}
