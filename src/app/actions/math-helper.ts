"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  mathHelper,
  type MathHelperInput,
  type MathHelperOutput,
} from "@/ai/flows/math-helper-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function mathHelperAction(
  input: MathHelperInput
): Promise<MathHelperOutput> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Math Helper');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await mathHelper(input);
    return output;
  } catch (error) {
    console.error("Error in mathHelperAction:", error);
    throw new Error("Failed to solve the math problem.");
  }
}
