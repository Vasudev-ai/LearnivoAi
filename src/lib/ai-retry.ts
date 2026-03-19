import { createRotatedAi } from '@/ai/genkit';
import { withRetry } from '@/lib/retry-utils';
import type { ZodSchema } from 'zod';

interface AIFlowOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  backoffMultiplier?: number;
}

export async function executeWithRetry<T, I>(
  flowName: string,
  promptTemplate: string,
  input: I,
  inputSchema: ZodSchema<I>,
  outputSchema: ZodSchema<T>,
  options: AIFlowOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    initialDelayMs = 2000,
    backoffMultiplier = 2,
  } = options;

  const rotatedAi = createRotatedAi();
  
  const prompt = rotatedAi.definePrompt({
    name: `${flowName}PromptRotated`,
    input: { schema: inputSchema },
    output: { schema: outputSchema },
    prompt: promptTemplate,
  });

  const { output } = await withRetry(
    () => prompt(input),
    {
      maxAttempts,
      initialDelayMs,
      backoffMultiplier,
      onRetry: (attempt, error, delay) => {
        console.warn(`[${flowName}] Retry ${attempt}/${maxAttempts} after ${delay}ms: ${error.message}`);
        console.log(`[${flowName}] Switching to next API key...`);
      }
    }
  );

  return output as T;
}
