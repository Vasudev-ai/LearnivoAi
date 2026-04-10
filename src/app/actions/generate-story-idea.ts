"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  generateStoryIdea,
  type GenerateStoryIdeaInput,
  type GenerateStoryIdeaOutput,
} from "@/ai/flows/generate-story-idea-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateStoryIdeaAction(
  input: GenerateStoryIdeaInput
): Promise<GenerateStoryIdeaOutput> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Story');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await generateStoryIdea(input);
    return output;
  } catch (error) {
    console.error("Error in generateStoryIdeaAction:", error);
    throw new Error("Failed to generate a story idea.");
  }
}
