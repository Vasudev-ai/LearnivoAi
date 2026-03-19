"use server";

import { cookies } from 'next/headers';
import {
  generateRubric,
  type GenerateRubricInput,
  type GenerateRubricOutput,
} from "@/ai/flows/generate-rubric-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateRubricAction(
  input: GenerateRubricInput
): Promise<GenerateRubricOutput | null> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateRubric(input);
    return output;
  } catch (error) {
    console.error("Error in generateRubricAction:", error);
    throw new Error("Failed to generate rubric.");
  }
}
