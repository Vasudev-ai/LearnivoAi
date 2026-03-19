"use server";

import { cookies } from 'next/headers';
import {
  draftParentCommunication,
  type DraftParentCommunicationInput,
  type DraftParentCommunicationOutput,
} from "@/ai/flows/draft-parent-communications";
import { checkRateLimit } from "@/lib/rate-limit";

export async function draftParentCommunicationAction(
  input: DraftParentCommunicationInput
): Promise<DraftParentCommunicationOutput | null> {
  const userId = (await cookies()).get('userId')?.value || 'anonymous';
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  try {
    const output = await draftParentCommunication(input);
    return output;
  } catch (error) {
    console.error("Error in draftParentCommunicationAction:", error);
    throw new Error("Failed to draft parent communication.");
  }
}
