"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  generateQuiz,
  type GenerateQuizInput,
  type GenerateQuizOutput,
} from "@/ai/flows/generate-quiz-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateQuizAction(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput | null> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Quiz');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await generateQuiz(input);
    return output;
  } catch (error) {
    console.error("Error in generateQuizAction:", error);
    throw new Error("Failed to generate quiz.");
  }
}
