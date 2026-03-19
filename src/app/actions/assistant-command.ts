"use server";

import { cookies } from 'next/headers';
import {
  assistantCommand,
  type AssistantCommandInput,
  type AssistantCommandOutput,
} from "@/ai/flows/assistant-command-flow";
import { checkRateLimit } from "@/lib/rate-limit";

export async function assistantCommandAction(
  input: AssistantCommandInput
): Promise<AssistantCommandOutput> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await assistantCommand(input);
    return output;
  } catch (error) {
    console.error("Error in assistantCommandAction:", error);
    throw new Error("Failed to process assistant command.");
  }
}
