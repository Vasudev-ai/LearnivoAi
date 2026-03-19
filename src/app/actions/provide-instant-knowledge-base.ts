"use server";

import { cookies } from 'next/headers';
import {
  provideInstantKnowledgeBase,
  type ProvideInstantKnowledgeBaseInput,
  type ProvideInstantKnowledgeBaseOutput,
} from "@/ai/flows/provide-instant-knowledge-base";
import { checkRateLimit } from "@/lib/rate-limit";

export async function provideInstantKnowledgeBaseAction(
  input: ProvideInstantKnowledgeBaseInput
): Promise<ProvideInstantKnowledgeBaseOutput | null> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await provideInstantKnowledgeBase(input);
    return output;
  } catch (error) {
    console.error("Error in provideInstantKnowledgeBaseAction:", error);
    throw new Error("Failed to get an answer.");
  }
}
