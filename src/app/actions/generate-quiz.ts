"use server";

import { cookies } from 'next/headers';
import {
  generateQuiz,
  type GenerateQuizInput,
  type GenerateQuizOutput,
} from "@/ai/flows/generate-quiz-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput | null> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateQuiz(input);
    return output;
  } catch (error) {
    console.error("Error in generateQuizAction:", error);
    throw new Error("Failed to generate quiz.");
  }
}
