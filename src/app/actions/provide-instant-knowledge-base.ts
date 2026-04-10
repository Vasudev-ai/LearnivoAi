"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  provideInstantKnowledgeBase,
  type ProvideInstantKnowledgeBaseInput,
  type ProvideInstantKnowledgeBaseOutput,
} from "@/ai/flows/provide-instant-knowledge-base";
import { checkRateLimit } from "@/lib/rate-limit";

export async function provideInstantKnowledgeBaseAction(
  input: ProvideInstantKnowledgeBaseInput
): Promise<ProvideInstantKnowledgeBaseOutput | null> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Knowledge Base');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await provideInstantKnowledgeBase(input);
    return output;
  } catch (error) {
    console.error("Error in provideInstantKnowledgeBaseAction:", error);
    throw new Error("Failed to get an answer.");
  }
}
