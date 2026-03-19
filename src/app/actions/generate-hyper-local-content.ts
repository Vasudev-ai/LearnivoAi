"use server";

import { cookies } from 'next/headers';
import {
  generateHyperLocalContent,
  type GenerateHyperLocalContentInput,
  type GenerateHyperLocalContentOutput,
} from "@/ai/flows/generate-hyper-local-content";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateHyperLocalContentAction(
  input: GenerateHyperLocalContentInput
): Promise<GenerateHyperLocalContentOutput | null> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateHyperLocalContent(input);
    return output;
  } catch (error) {
    console.error("Error in generateHyperLocalContentAction:", error);
    throw new Error("Failed to generate hyper-local content.");
  }
}
