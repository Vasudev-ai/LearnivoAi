'use server';

/**
 * @fileOverview An AI agent for handling voice commands within the app.
 *
 * - assistantCommand - A function that processes user commands.
 * - AssistantCommandInput - The input type for the function.
 * - AssistantCommandOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { withRetry } from '@/lib/retry-utils';
import { createRotatedAi } from '@/ai/genkit';

const AssistantCommandInputSchema = z.object({
  command: z.string().describe('The voice command spoken by the user.'),
});
export type AssistantCommandInput = z.infer<typeof AssistantCommandInputSchema>;

const AssistantCommandOutputSchema = z.object({
  responseText: z.string().describe('The text response to be spoken or displayed to the user.'),
  navigationPath: z.string().optional().describe('An optional path to navigate to within the application (e.g., /dashboard).'),
});
export type AssistantCommandOutput = z.infer<typeof AssistantCommandOutputSchema>;

export async function assistantCommand(
  input: AssistantCommandInput
): Promise<AssistantCommandOutput> {
  return assistantCommandFlow(input);
}

const COMMAND_PROMPT = `You are Sahayak, an integrated voice assistant for a teacher's application. Your primary role is to help the user navigate the app and understand its features based on their voice commands.

  **Task:** Analyze the user's command and determine the appropriate response and action.

  **User Command:** "{{command}}"

  **Available Navigation Paths:**
  - /dashboard
  - /library
  - /workspace
  - /lesson-planner
  - /paper-digitizer
  - /visual-aids
  - /3d-visuals
  - /math-helper
  - /hyper-local-content
  - /story-generator
  - /knowledge-base
  - /parent-communication
  - /quiz-generator
  - /rubric-generator
  - /debate-topic-generator
  - /settings
  - /profile

  **Instructions:**
  1.  **Identify Intent:** Determine if the user wants to navigate, ask a question, or perform an action.
  2.  **Navigation:** If the user wants to navigate (e.g., "go to dashboard," "open the quiz generator"), set the 'navigationPath' to the corresponding path from the list above. The 'responseText' should confirm the action, like "Navigating to the dashboard."
  3.  **General Questions:** If the user asks a general question (e.g., "what can you do?", "who are you?"), provide a helpful and concise 'responseText'. Do not set a 'navigationPath'.
  4.  **No Match:** If the command is unclear or doesn't match any known feature, provide a polite response indicating you don't understand and suggest some things you can do (e.g., "I'm sorry, I didn't understand that. You can ask me to open the lesson planner or navigate to your workspace."). Do not set a 'navigationPath'.

  **Output Format:**
  - The entire output MUST be a single, valid JSON object.
  - The JSON must have 'responseText' (string) and may optionally have 'navigationPath' (string).
  `;

const assistantCommandFlow = ai.defineFlow(
  {
    name: 'assistantCommandFlow',
    inputSchema: AssistantCommandInputSchema,
    outputSchema: AssistantCommandOutputSchema,
  },
  async input => {
    try {
      const rotatedAi = createRotatedAi();
      const rotatedPrompt = rotatedAi.definePrompt({
        name: 'assistantCommandPromptRotated',
        input: {schema: AssistantCommandInputSchema},
        output: {schema: AssistantCommandOutputSchema},
        prompt: COMMAND_PROMPT,
      });

      const {output} = await withRetry(
        () => rotatedPrompt(input),
        {
          maxAttempts: 3,
          initialDelayMs: 2000,
          backoffMultiplier: 2,
          onRetry: (attempt, error, delay) => {
            console.warn(`[AssistantCommand] Retry ${attempt}/3 after ${delay}ms: ${error.message}`);
            console.log(`[AssistantCommand] Switching to next API key...`);
          }
        }
      );
      return output!;
    } catch (error) {
      console.error('AssistantCommand flow error:', error);
      throw error;
    }
  }
);
