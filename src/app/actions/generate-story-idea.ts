"use server";

import { cookies } from 'next/headers';
import {
  generateStoryIdea,
  type GenerateStoryIdeaInput,
  type GenerateStoryIdeaOutput,
} from "@/ai/flows/generate-story-idea-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function generateStoryIdeaAction(
  input: GenerateStoryIdeaInput
): Promise<GenerateStoryIdeaOutput> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await generateStoryIdea(input);
    return output;
  } catch (error) {
    console.error("Error in generateStoryIdeaAction:", error);
    throw new Error("Failed to generate a story idea.");
  }
}
