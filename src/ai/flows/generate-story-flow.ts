
'use server';
/**
 * @fileOverview Generates an illustrated story for children.
 *
 * - generateStory - Generates story text and illustration prompts.
 * - generateStoryWithIllustrations - Generates the full story with images.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { withRetry } from '@/lib/retry-utils';
import { createRotatedAi } from '@/ai/genkit';
import { logUsageAndDeductCredits, calculateCredits } from '@/lib/usage-service';

const GenerateStoryInputSchema = z.object({
  topic: z.string().describe('The topic or moral of the story.'),
  characters: z.string().describe('A description of the main characters (e.g., "A brave rabbit named Pip and a wise old owl").'),
  setting: z.string().describe('The setting of the story (e.g., "A magical forest").'),
  language: z.string().describe('The language the story should be written in.'),
  gradeLevel: z.string().describe('The target grade level for the story.'),
  subscriptionPlan: z.enum(['free', 'premium']).optional().default('free'),
  userData: z.object({
    userId: z.string(),
    userName: z.string(),
    userEmail: z.string(),
  }).optional(),
});
export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const StoryPageSchema = z.object({
  pageNumber: z.number().describe('The page number.'),
  text: z.string().describe('The text for this page of the story.'),
  illustrationPrompt: z.string().describe('A detailed prompt for an AI image generator to create an illustration for this page. The prompt should describe a simple, colorful, storybook-style scene.'),
});

const StoryContentSchema = z.object({
  title: z.string().describe('A creative title for the story.'),
  pages: z.array(StoryPageSchema).describe('An array of 5-7 pages for the story.'),
});
export type StoryContent = z.infer<typeof StoryContentSchema>;

export type StoryPageWithImage = z.infer<typeof StoryPageSchema> & { imageDataUri: string | null };
export type StoryWithImages = {
  title: string;
  pages: StoryPageWithImage[];
}

const TEXT_GENERATION_PROMPT = `You are a creative storyteller for children. Write a short, engaging, and age-appropriate story in {{{language}}} for {{{gradeLevel}}} students.
The story should be based on the following details and consist of 5-7 pages. For each page, provide the story text and a descriptive prompt for an illustration.

Topic/Moral: {{{topic}}}
Characters: {{{characters}}}
Setting: {{{setting}}}

Ensure the output is a valid JSON object matching the requested schema.`;

export const generateStoryContent = ai.defineFlow(
  {
    name: 'generateStoryContentFlow',
    inputSchema: GenerateStoryInputSchema,
  },
  async (input) => {
    try {
      const rotatedAi = createRotatedAi();
      const rotatedPrompt = rotatedAi.definePrompt({
        name: 'generateStoryPromptRotated',
        input: { schema: GenerateStoryInputSchema },
        output: { schema: StoryContentSchema },
        prompt: TEXT_GENERATION_PROMPT,
      });

      const response = await withRetry(
        () => rotatedPrompt(input),
        {
          maxAttempts: 3,
          initialDelayMs: 2000,
          backoffMultiplier: 2,
          onRetry: (attempt, error, delay) => {
            console.warn(`[GenerateStory] Retry ${attempt}/3 after ${delay}ms: ${error.message}`);
            console.log(`[GenerateStory] Switching to next API key...`);
          }
        }
      );

      const { output, usage } = response;
      
      return {
        content: output!,
        usage: usage || { inputTokens: 0, outputTokens: 0, totalTokens: 0 }
      };
    } catch (error) {
      console.error('GenerateStory flow error:', error);
      throw error;
    }
  }
);


export async function generateStoryWithIllustrations(input: GenerateStoryInput): Promise<StoryWithImages> {
    const { content: storyContent, usage: textUsage } = await generateStoryContent(input);

    if (!storyContent || !storyContent.pages) {
        throw new Error("Failed to generate story content.");
    }
    
    const premiumStyle = "cinematic, professional, vibrant, storybook illustration for children, high detail";
    const freeStyle = "a cute, simple, colorful, cartoon illustration for children.";

    let totalImageInputTokens = 0;
    let totalImageOutputTokens = 0;

    const imagePromises = storyContent.pages.map((page: z.infer<typeof StoryPageSchema>) => 
        ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: `${input.subscriptionPlan === 'premium' ? premiumStyle : freeStyle}. ${page.illustrationPrompt}`,
        }).then(res => {
            totalImageInputTokens += res.usage?.inputTokens || 0;
            totalImageOutputTokens += res.usage?.outputTokens || 0;
            return res.media?.url || null;
        })
        .catch(() => null)
    );

    const imageDataUris = await Promise.all(imagePromises);

    if (input.userData) {
        const totalInputTokens = textUsage.inputTokens + totalImageInputTokens;
        const totalOutputTokens = textUsage.outputTokens + totalImageOutputTokens;
        const totalTokens = totalInputTokens + totalOutputTokens;
        
        await logUsageAndDeductCredits({
            userId: input.userData.userId,
            userName: input.userData.userName,
            userEmail: input.userData.userEmail,
            toolName: 'Story Generator',
            inputTokens: totalInputTokens,
            outputTokens: totalOutputTokens,
            totalTokens: totalTokens,
            creditsUsed: calculateCredits(totalTokens, 'Story Generator'),
            model: 'gemini-2.5-flash',
            prompt: input.topic
        });
    }

    const pagesWithImages: StoryPageWithImage[] = storyContent.pages.map((page: z.infer<typeof StoryPageSchema>, index: number) => ({
        ...page,
        imageDataUri: imageDataUris[index],
    }));

    return {
        title: storyContent.title,
        pages: pagesWithImages,
    };
}
