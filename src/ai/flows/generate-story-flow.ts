
'use server';
/**
 * @fileOverview Generates an illustrated story for children.
 *
 * - generateStory - Generates story text and illustration prompts.
 * - generateStoryWithIllustrations - Generates the full story with images.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { gemini15Flash } from '@genkit-ai/googleai';
import { UserProfile } from '@/firebase';


const GenerateStoryInputSchema = z.object({
  topic: z.string().describe('The topic or moral of the story.'),
  characters: z.string().describe('A description of the main characters (e.g., "A brave rabbit named Pip and a wise old owl").'),
  setting: z.string().describe('The setting of the story (e.g., "A magical forest").'),
  language: z.string().describe('The language the story should be written in.'),
  gradeLevel: z.string().describe('The target grade level for the story.'),
  subscriptionPlan: z.enum(['free', 'premium']).optional().default('free'),
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

const textGenerationPrompt = ai.definePrompt({
    name: 'generateStoryPrompt',
    input: { schema: GenerateStoryInputSchema },
    output: { schema: StoryContentSchema },
    prompt: `You are a creative storyteller for children. Write a short, engaging, and age-appropriate story in {{{language}}} for {{{gradeLevel}}} students.
The story should be based on the following details and consist of 5-7 pages. For each page, provide the story text and a descriptive prompt for an illustration.

Topic/Moral: {{{topic}}}
Characters: {{{characters}}}
Setting: {{{setting}}}

Ensure the output is a valid JSON object matching the requested schema.`,
});

export const generateStoryContent = ai.defineFlow(
  {
    name: 'generateStoryContentFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: StoryContentSchema,
  },
  async (input) => {
    const { output } = await textGenerationPrompt(input);
    return output!;
  }
);


export async function generateStoryWithIllustrations(input: GenerateStoryInput): Promise<StoryWithImages> {
    const storyContent = await generateStoryContent(input);

    if (!storyContent || !storyContent.pages) {
        throw new Error("Failed to generate story content.");
    }
    
    const premiumStyle = "cinematic, professional, vibrant, storybook illustration for children, high detail";
    const freeStyle = "a cute, simple, colorful, cartoon illustration for children.";

    const imagePromises = storyContent.pages.map(page => 
        ai.generate({
            model: 'googleai/gemini-2.5-flash',
            prompt: `${input.subscriptionPlan === 'premium' ? premiumStyle : freeStyle}. ${page.illustrationPrompt}`,
        }).then(res => res.media?.url || null)
        .catch(() => null) // Return null on image generation failure
    );

    const imageDataUris = await Promise.all(imagePromises);

    const pagesWithImages: StoryPageWithImage[] = storyContent.pages.map((page, index) => ({
        ...page,
        imageDataUri: imageDataUris[index],
    }));

    return {
        title: storyContent.title,
        pages: pagesWithImages,
    };
}
