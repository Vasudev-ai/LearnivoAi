"use server";

import { cookies } from 'next/headers';
import {
  generateDebateTopics,
  type GenerateDebateTopicsInput,
  type GenerateDebateTopicsOutput,
} from "@/ai/flows/generate-debate-topics-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateDebateTopicsAction(
  input: GenerateDebateTopicsInput
): Promise<GenerateDebateTopicsOutput | null> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateDebateTopics(input);
    return output;
  } catch (error) {
    console.error("Error in generateDebateTopicsAction:", error);
    throw new Error("Failed to generate debate topics.");
  }
}
