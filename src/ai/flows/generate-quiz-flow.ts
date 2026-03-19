
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { withRetry } from '@/lib/retry-utils';
import { createRotatedAi } from '@/ai/genkit';
import { getCachedResponse, setCachedResponse } from '@/lib/ai-cache';

const FLOW_NAME = 'generateQuiz';

const QuestionSchema = z.object({
  questionText: z.string(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string(),
  explanation: z.string(),
  marks: z.number(),
  questionType: z.enum(['MCQ', 'ShortAnswer', 'LongAnswer', 'FillInTheBlank']),
});

export type Question = z.infer<typeof QuestionSchema>;


const GenerateQuizInputSchema = z.object({
  sourceText: z.string().describe('The source text or topic for the quiz.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  questionTypes: z
    .array(z.enum(['MCQ', 'ShortAnswer', 'LongAnswer', 'FillInTheBlank']))
    .describe('The types of questions to generate.'),
  gradeLevel: z.string().describe('The grade level of the students.'),
  difficulty: z
    .enum(['Easy', 'Medium', 'Hard'])
    .describe('The difficulty level of the quiz.'),
  language: z.string().describe('The language for the quiz.'),
  bloomsLevel: z
    .enum([
      'Remembering',
      'Understanding',
      'Applying',
      'Analyzing',
      'Evaluating',
      'Creating',
    ])
    .describe(
      "The desired Bloom's Taxonomy level for the questions."
    ),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('The title of the generated quiz.'),
  questions: z
    .array(QuestionSchema)
    .describe('The list of generated questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(
  input: GenerateQuizInput
): Promise<GenerateQuizOutput> {
  const cached = getCachedResponse<GenerateQuizOutput>(FLOW_NAME, input);
  if (cached) {
    console.log(`[${FLOW_NAME}] Cache hit for:`, input.sourceText);
    return cached;
  }
  return generateQuizFlow(input);
}

const QUIZ_PROMPT = `You are an expert educator and question paper designer for Indian school boards (like CBSE, ICSE). Your task is to create a high-quality, well-structured quiz based on a detailed blueprint.

  **Quiz Blueprint:**
  -   **Source Material/Topic:** {{{sourceText}}}
  -   **Grade Level:** {{{gradeLevel}}}
  -   **Language:** {{{language}}}
  -   **Total Number of Questions:** {{{numQuestions}}}
  -   **Question Types Requested:** {{{questionTypes}}}
  -   **Difficulty Level:** {{{difficulty}}}
  -   **Cognitive (Bloom's) Level:** {{{bloomsLevel}}}

  **Instructions for Question Generation:**
  1.  **Adherence to Blueprint:** Strictly follow all the parameters defined in the blueprint above. The quiz must be in the specified '{{{language}}}'.
  2.  **Title:** Create a suitable title for the quiz based on the source material.
  3.  **Question Crafting:**
      -   All questions must be based on the provided '{{{sourceText}}}'. Do not use external knowledge.
      -   The complexity of questions should match the '{{{gradeLevel}}}' and '{{{difficulty}}}' level.
      -   Questions should target the specified '{{{bloomsLevel}}}' of thinking. For example, 'Remembering' questions ask for direct information, while 'Analyzing' questions require breaking down information.
      -   Assign reasonable marks to each question based on its type and complexity.
  4.  **Specific Question-Type Rules:**
      -   **MCQ:** Generate four plausible options (one correct, three distinct incorrect distractors). The options should not be too obvious.
      -   **FillInTheBlank:** The question text must contain "_____" to indicate the blank. The 'correctAnswer' should be only the word(s) that fit in the blank.
      -   **ShortAnswer / LongAnswer:** The 'correctAnswer' should be a model answer that covers the key points expected from a student.
  5.  **Explanations:** For every question, provide a clear and concise 'explanation' for the correct answer. This should clarify why the answer is correct, ideally referencing the source text.

  **Output Format:**
  -   The entire output must be a single, valid JSON object in the specified '{{{language}}}'.
  -   The JSON must contain a 'title' (string) and a 'questions' (array of question objects) field, strictly adhering to the output schema.
  -   Do not include any text or formatting outside the JSON object.
  `;

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    try {
      const rotatedAi = createRotatedAi();
      const rotatedPrompt = rotatedAi.definePrompt({
        name: 'generateQuizPromptRotated',
        input: {schema: GenerateQuizInputSchema},
        output: {schema: GenerateQuizOutputSchema},
        prompt: QUIZ_PROMPT,
      });

      const {output} = await withRetry(
        () => rotatedPrompt(input),
        {
          maxAttempts: 3,
          initialDelayMs: 2000,
          backoffMultiplier: 2,
          onRetry: (attempt, error, delay) => {
            console.warn(`[QuizGenerator] Retry ${attempt}/3 after ${delay}ms: ${error.message}`);
            console.log(`[QuizGenerator] Switching to next API key...`);
          }
        }
      );
      const result = output!;
      setCachedResponse(FLOW_NAME, input, result);
      return result;
    } catch (error) {
      console.error('Quiz flow error:', error);
      throw error;
    }
  }
);
