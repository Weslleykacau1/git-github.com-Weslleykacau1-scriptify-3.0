'use server';

/**
 * @fileOverview Generates thumbnail ideas from a script by first creating a reference image.
 *
 * - generateThumbnailFromScript - A function that handles the thumbnail generation process.
 * - GenerateThumbnailFromScriptInput - The input type for the function.
 * - GenerateThumbnailFromScriptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { generateImage } from './generate-image';

const GenerateThumbnailFromScriptInputSchema = z.object({
  firstSceneImagePrompt: z.string().describe('The English image prompt from the first scene of the script.'),
  thumbnailIdeas: z.string().describe('The textual ideas or concepts for the thumbnail in Portuguese.'),
});
export type GenerateThumbnailFromScriptInput = z.infer<typeof GenerateThumbnailFromScriptInputSchema>;

const GenerateThumbnailFromScriptOutputSchema = z.object({
  thumbnailImage1Uri: z.string().describe('The first generated thumbnail image as a data URI.'),
  thumbnailImage2Uri: z.string().describe('The second generated thumbnail image as a data URI.'),
});
export type GenerateThumbnailFromScriptOutput = z.infer<typeof GenerateThumbnailFromScriptOutputSchema>;

async function generateImageForThumbnail(prompt: string, referenceImageUri: string): Promise<string> {
    const promptParts = [
        { text: prompt },
        { media: { url: referenceImageUri } },
    ];
    
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: promptParts,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media.url) {
      throw new Error('Image generation failed to return a data URI.');
    }
    return media.url;
}


const generateThumbnailFromScriptFlow = ai.defineFlow(
  {
    name: 'generateThumbnailFromScriptFlow',
    inputSchema: GenerateThumbnailFromScriptInputSchema,
    outputSchema: GenerateThumbnailFromScriptOutputSchema,
  },
  async ({ firstSceneImagePrompt, thumbnailIdeas }) => {
    // Step 1: Generate a reference image from the first scene's prompt.
    const { imageDataUri: referenceImageUri } = await generateImage({ prompt: firstSceneImagePrompt });
    
    // Step 2: Construct detailed prompts for the two thumbnail variations.
    const imagePrompt1 = `Create a highly clickable YouTube thumbnail based on this reference image. The video's theme is described by these ideas: "${thumbnailIdeas}". Make this thumbnail visually striking and compelling. Variation 1.`;
    const imagePrompt2 = `Create another highly clickable YouTube thumbnail using the same reference image and theme ideas: "${thumbnailIdeas}". Make this a different, alternative composition. Variation 2.`;

    // Step 3: Generate two thumbnail variations using the reference image.
    const [thumbnailImage1Uri, thumbnailImage2Uri] = await Promise.all([
      generateImageForThumbnail(imagePrompt1, referenceImageUri),
      generateImageForThumbnail(imagePrompt2, referenceImageUri),
    ]);
    
    // Step 4: Return the results.
    return {
      thumbnailImage1Uri,
      thumbnailImage2Uri,
    };
  }
);

export async function generateThumbnailFromScript(input: GenerateThumbnailFromScriptInput): Promise<GenerateThumbnailFromScriptOutput> {
  return generateThumbnailFromScriptFlow(input);
}
