"use server";

import { cookies } from 'next/headers';
import {
  evaluateQuiz,
  type EvaluateQuizInput,
  type EvaluateQuizOutput,
} from "@/ai/flows/evaluate-quiz-answers-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function evaluateQuizAction(
  input: EvaluateQuizInput
): Promise<EvaluateQuizOutput> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await evaluateQuiz(input);
    return output;
  } catch (error) {
    console.error("Error in evaluateQuizAction:", error);
    throw new Error("Failed to evaluate quiz.");
  }
}
