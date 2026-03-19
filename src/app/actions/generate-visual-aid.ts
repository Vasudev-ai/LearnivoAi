"use server";

import { cookies } from 'next/headers';
import {
  generateVisualAid,
  type GenerateVisualAidInput,
  type GenerateVisualAidOutput,
} from "@/ai/flows/generate-visual-aid-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateVisualAidAction(
  input: GenerateVisualAidInput
): Promise<GenerateVisualAidOutput> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateVisualAid(input);
    return output;
  } catch (error) {
    console.error("Error in generateVisualAidAction:", error);
    throw new Error("Failed to generate visual aid.");
  }
}
