"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  generateStoryWithIllustrations,
  type GenerateStoryInput,
  type StoryWithImages,
} from "@/ai/flows/generate-story-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateStoryAction(
  input: GenerateStoryInput
): Promise<StoryWithImages> {
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
    const output = await generateStoryWithIllustrations(input);
    return output;
  } catch (error) {
    console.error("Error in generateStoryAction:", error);
    throw new Error("Failed to generate the story with illustrations.");
  }
}
