
'use server';

/**
 * @fileOverview Generates thumbnail ideas from a script by first creating a reference image.
 *
 * - generateThumbnailFromScript - A function that handles the thumbnail generation process.
 * - GenerateThumbnailFromScriptInput - The input type for the function.
 * - GenerateThumbnailFromScriptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { generateImage } from './generate-image';

const GenerateThumbnailFromScriptInputSchema = z.object({
  firstSceneImagePrompt: z.string().describe('The English image prompt from the first scene of the script.'),
  thumbnailIdeas: z.string().describe('The textual ideas or concepts for the thumbnail in Portuguese.'),
  aspectRatio: z.enum(['16:9', '9:16']).optional().default('16:9'),
});
export type GenerateThumbnailFromScriptInput = z.infer<typeof GenerateThumbnailFromScriptInputSchema>;

const GenerateThumbnailFromScriptOutputSchema = z.object({
  thumbnailImage1Uri: z.string().describe('The first generated thumbnail image as a data URI.'),
  thumbnailImage2Uri: z.string().describe('The second generated thumbnail image as a data URI.'),
});
export type GenerateThumbnailFromScriptOutput = z.infer<typeof GenerateThumbnailFromScriptOutputSchema>;

const generateThumbnailFromScriptFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFromScriptFlow',
    inputSchema: GenerateThumbnailFromScriptInputSchema,
    outputSchema: GenerateThumbnailFromScriptOutputSchema,
  },
  async ({ firstSceneImagePrompt, thumbnailIdeas, aspectRatio }) => {
    // Step 1: Generate a reference image from the first scene's prompt.
    const { imageDataUri: referenceImageUri } = await generateImage({ prompt: firstSceneImagePrompt, aspectRatio: '16:9' });
    
    // Step 2: Construct detailed prompts for the two thumbnail variations.
    const prompt1 = `Create a highly clickable YouTube thumbnail based on this reference image. The video's theme is described by these ideas: "${thumbnailIdeas}". Make this thumbnail visually striking and compelling. Variation 1.`;
    const prompt2 = `Create another highly clickable YouTube thumbnail using the same reference image and theme ideas: "${thumbnailIdeas}". Make this a different, alternative composition. Variation 2.`;

    const promptParts1 = [{text: prompt1}, {media: {url: referenceImageUri}}];
    const promptParts2 = [{text: prompt2}, {media: {url: referenceImageUri}}];


    // Step 3: Generate two thumbnail variations using the reference image.
    const [thumbnail1, thumbnail2] = await Promise.all([
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: promptParts1 as any,
        config: { responseModalities: ['TEXT', 'IMAGE'], aspectRatio }
      }),
      ai.generate({
        model: 'googleai/gemini-2.0-flash-preview-image-generation',
        prompt: promptParts2 as any,
        config: { responseModalities: ['TEXT', 'IMAGE'], aspectRatio }
      }),
    ]);
    
    if (!thumbnail1.media.url || !thumbnail2.media.url) {
        throw new Error("Failed to generate one or more thumbnails.");
    }

    // Step 4: Return the results.
    return {
      thumbnailImage1Uri: thumbnail1.media.url,
      thumbnailImage2Uri: thumbnail2.media.url,
    };
  }
);

export async function generateThumbnailFromScript(input: GenerateThumbnailFromScriptInput): Promise<GenerateThumbnailFromScriptOutput> {
  return generateThumbnailFromScriptFlow(input);
}
