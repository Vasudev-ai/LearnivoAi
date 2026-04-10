"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  assistantCommand,
  type AssistantCommandInput,
  type AssistantCommandOutput,
} from "@/ai/flows/assistant-command-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function assistantCommandAction(
  input: AssistantCommandInput
): Promise<AssistantCommandOutput> {
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
    const output = await assistantCommand(input);
    return output;
  } catch (error) {
    console.error("Error in assistantCommandAction:", error);
    throw new Error("Failed to process assistant command.");
  }
}
