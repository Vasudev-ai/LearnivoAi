"use server";

import { cookies } from 'next/headers';
import {
  mathHelper,
  type MathHelperInput,
  type MathHelperOutput,
} from "@/ai/flows/math-helper-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function mathHelperAction(
  input: MathHelperInput
): Promise<MathHelperOutput> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await mathHelper(input);
    return output;
  } catch (error) {
    console.error("Error in mathHelperAction:", error);
    throw new Error("Failed to solve the math problem.");
  }
}
