"use server";

import { cookies } from 'next/headers';
import { getServerUser } from '@/lib/server/get-server-user';
import { serverDeductCredits } from '@/lib/server/credit-service';
import {
  draftParentCommunication,
  type DraftParentCommunicationInput,
  type DraftParentCommunicationOutput,
} from "@/ai/flows/draft-parent-communications";
import { checkRateLimit } from "@/lib/rate-limit";

export async function draftParentCommunicationAction(
  input: DraftParentCommunicationInput
): Promise<DraftParentCommunicationOutput | null> {
  const userId = await getServerUser();
  
  if (!userId) {
    throw new Error("Unauthorized. Please sign in to use this feature.");
  }
  
  const rateLimit = checkRateLimit(userId, 'ai');
  if (!rateLimit.allowed) {
    throw new Error(`Rate limit exceeded. ${rateLimit.message}`);
  }
  
  // SECURE BACKEND CREDIT DEDUCTION
  const hasCredits = await serverDeductCredits(userId, 'Parent Communication');
  if (!hasCredits) {
    throw new Error("Insufficient credits to generate content.");
  }
  
  try {
    const output = await draftParentCommunication(input);
    return output;
  } catch (error) {
    console.error("Error in draftParentCommunicationAction:", error);
    throw new Error("Failed to draft parent communication.");
  }
}
