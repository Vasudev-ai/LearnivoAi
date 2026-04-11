"use server";

import { getServerUser } from '@/lib/server/get-server-user';
import { serverCheckCredits, serverDeductCredits } from '@/lib/server/credit-service';
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
  
  // 1. Check credits first (Read only)
  const { hasEnough } = await serverCheckCredits(userId, 'Knowledge Base');
  if (!hasEnough) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    // 2. Perform AI operation
    const output = await provideInstantKnowledgeBase(input);
    
    // 3. SECURE BACKEND CREDIT DEDUCTION (Only on success)
    await serverDeductCredits(userId, 'Knowledge Base');
    
    return output;
  } catch (error) {
    console.error("Error in provideInstantKnowledgeBaseAction:", error);
    throw new Error("Failed to get an answer.");
  }
}
