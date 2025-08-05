
'use server';

/**
 * @fileOverview Generates a detailed thumbnail image prompt based on ideas and a scene.
 *
 * - generateThumbnailPromptFromIdeas - A function that handles the prompt generation.
 * - GenerateThumbnailPromptFromIdeasInput - The input type for the function.
 * - GenerateThumbnailPromptFromIdeasOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateImage } from './generate-image';

const GenerateThumbnailPromptFromIdeasInputSchema = z.object({
  firstSceneImagePrompt: z.string().describe('The English image prompt from the first scene of the script.'),
  thumbnailIdeas: z.string().describe('The textual ideas or concepts for the thumbnail in Portuguese.'),
  aspectRatio: z.enum(['16:9', '9:16']).optional().default('16:9'),
});
export type GenerateThumbnailPromptFromIdeasInput = z.infer<typeof GenerateThumbnailPromptFromIdeasInputSchema>;

const GenerateThumbnailPromptFromIdeasOutputSchema = z.object({
  thumbnailPrompt: z.string().describe('A single, detailed, and optimized English prompt for generating a high-quality YouTube thumbnail.'),
});
export type GenerateThumbnailPromptFromIdeasOutput = z.infer<typeof GenerateThumbnailPromptFromIdeasOutputSchema>;


const promptGenerator = ai.definePrompt({
    name: 'thumbnailPromptGenerator',
    input: { schema: GenerateThumbnailPromptFromIdeasInputSchema },
    output: { schema: GenerateThumbnailPromptFromIdeasOutputSchema },
    prompt: `You are an expert in creating viral YouTube thumbnails. Your task is to generate a single, highly detailed, and effective image generation prompt in English.

This prompt will be used to create a thumbnail for a video. You will be given ideas for the thumbnail (in Portuguese) and the image prompt from the first scene of the video script (in English) to use as context.

The final prompt must be in English and should combine the ideas and the scene context into one cohesive and powerful instruction for an AI image generator. The prompt should be descriptive, focusing on visual elements, composition, lighting, and emotion to create a clickable thumbnail.

Thumbnail Ideas (Portuguese):
"{{{thumbnailIdeas}}}"

First Scene Image Prompt (English - for context):
"{{{firstSceneImagePrompt}}}"

Generate the final, optimized English thumbnail prompt now.
`,
});


const generateThumbnailPromptFromIdeasFlow = ai.defineFlow(
  {
    name: 'generateThumbnailPromptFromIdeasFlow',
    inputSchema: GenerateThumbnailPromptFromIdeasInputSchema,
    outputSchema: GenerateThumbnailPromptFromIdeasOutputSchema,
  },
  async (input) => {
    const { output } = await promptGenerator(input);
    
    if (!output) {
        throw new Error('Failed to generate thumbnail prompt.');
    }

    return {
      thumbnailPrompt: output.thumbnailPrompt,
    };
  }
);


export async function generateThumbnailPromptFromIdeas(input: GenerateThumbnailPromptFromIdeasInput): Promise<GenerateThumbnailPromptFromIdeasOutput> {
  return generateThumbnailPromptFromIdeasFlow(input);
}
