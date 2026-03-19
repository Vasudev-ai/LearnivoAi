'use server';

/**
 * @fileOverview A flow to provide simple, age-appropriate answers to student's questions in the local language, complete with analogies.
 *
 * - provideInstantKnowledgeBase - A function that handles the process of answering student questions.
 * - ProvideInstantKnowledgeBaseInput - The input type for the provideInstantKnowledgeBase function.
 * - ProvideInstantKnowledgeBaseOutput - The return type for the provideInstantKnowledgeBase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { withRetry } from '@/lib/retry-utils';
import { createRotatedAi } from '@/ai/genkit';
import { getCachedResponse, setCachedResponse } from '@/lib/ai-cache';

const FLOW_NAME = 'provideInstantKnowledgeBase';

const ProvideInstantKnowledgeBaseInputSchema = z.object({
  question: z.string().describe('The question asked by the student.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  localLanguage: z.string().describe('The local language to provide the answer in.'),
});
export type ProvideInstantKnowledgeBaseInput = z.infer<typeof ProvideInstantKnowledgeBaseInputSchema>;

const ProvideInstantKnowledgeBaseOutputSchema = z.object({
  answer: z.string().describe('The simple, age-appropriate answer to the question in the local language, complete with analogies.'),
});
export type ProvideInstantKnowledgeBaseOutput = z.infer<typeof ProvideInstantKnowledgeBaseOutputSchema>;

export async function provideInstantKnowledgeBase(input: ProvideInstantKnowledgeBaseInput): Promise<ProvideInstantKnowledgeBaseOutput> {
  const cached = getCachedResponse<ProvideInstantKnowledgeBaseOutput>(FLOW_NAME, input);
  if (cached) {
    console.log(`[${FLOW_NAME}] Cache hit for:`, input.question);
    return cached;
  }
  return provideInstantKnowledgeBaseFlow(input);
}

const KNOWLEDGE_BASE_PROMPT = `You are a friendly, patient, and wise teacher in an Indian school. You excel at explaining complex topics in a simple and engaging way.

  **Task:** Answer a student's question in a simple, age-appropriate manner, in their local language, and include a relatable analogy.

  **Student's Details:**
  -   Grade Level: {{{gradeLevel}}}
  -   Question: "{{question}}"
  -   Language for Answer: {{{localLanguage}}}

  **Instructions:**
  1.  **Analyze the Question:** Understand the core concept behind the student's question.
  2.  **Set the Tone:** Your answer should be encouraging, simple, and direct. Avoid overly technical jargon.
  3.  **Formulate the Answer:**
      -   Start by directly addressing the question.
      -   Explain the concept using vocabulary and examples suitable for a student in '{{{gradeLevel}}}'.
      -   The entire answer must be in the specified '{{{localLanguage}}}'.
  4.  **Create an Analogy:**
      -   After the main explanation, provide at least one clear, relatable analogy to solidify understanding.
      -   The analogy should be something a child in India would easily recognize (e.g., related to cricket, festivals, family, food, or daily life).
      -   Introduce the analogy with a phrase like "Isko aise samjho..." or its equivalent in the target language.
  5.  **Structure the Output:**
      -   The final answer should be a single, well-formatted string.
      -   Use paragraphs to separate the main explanation from the analogy.

  **Output Format:**
  -   The entire output must be a valid JSON object with a single key "answer".
  -   The value for "answer" should be the complete, formatted response string.
  `;

const provideInstantKnowledgeBaseFlow = ai.defineFlow(
  {
    name: 'provideInstantKnowledgeBaseFlow',
    inputSchema: ProvideInstantKnowledgeBaseInputSchema,
    outputSchema: ProvideInstantKnowledgeBaseOutputSchema,
  },
  async input => {
    try {
      const rotatedAi = createRotatedAi();
      const rotatedPrompt = rotatedAi.definePrompt({
        name: 'provideInstantKnowledgeBasePromptRotated',
        input: {schema: ProvideInstantKnowledgeBaseInputSchema},
        output: {schema: ProvideInstantKnowledgeBaseOutputSchema},
        prompt: KNOWLEDGE_BASE_PROMPT,
      });

      const {output} = await withRetry(
        () => rotatedPrompt(input),
        {
          maxAttempts: 3,
          initialDelayMs: 2000,
          backoffMultiplier: 2,
          onRetry: (attempt, error, delay) => {
            console.warn(`[KnowledgeBase] Retry ${attempt}/3 after ${delay}ms: ${error.message}`);
            console.log(`[KnowledgeBase] Switching to next API key...`);
          }
        }
      );
      const result = output!;
      setCachedResponse(FLOW_NAME, input, result);
      return result;
    } catch (error) {
      console.error('KnowledgeBase flow error:', error);
      throw error;
    }
  }
);
