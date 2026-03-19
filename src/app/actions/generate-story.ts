"use server";

import { cookies } from 'next/headers';
import {
  generateStoryWithIllustrations,
  type GenerateStoryInput,
  type StoryWithImages,
} from "@/ai/flows/generate-story-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateStoryAction(
  input: GenerateStoryInput
): Promise<StoryWithImages> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateStoryWithIllustrations(input);
    return output;
  } catch (error) {
    console.error("Error in generateStoryAction:", error);
    throw new Error("Failed to generate the story with illustrations.");
  }
}
