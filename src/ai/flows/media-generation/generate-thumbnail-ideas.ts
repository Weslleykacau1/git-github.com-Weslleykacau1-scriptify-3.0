
'use server';

/**
 * @fileOverview Generates thumbnail ideas including text, SEO, and an image prompt.
 *
 * - generateThumbnailIdeas - A function that handles the thumbnail idea generation process.
 * - GenerateThumbnailIdeasInput - The input type for the function.
 * - GenerateThumbnailIdeasOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateThumbnailIdeasInputSchema = z.object({
  mainImageUri: z
    .string()
    .describe(
      "The main reference image for the thumbnail, as a data URI."
    ),
  backgroundImageUri: z
    .string()
    .optional()
    .describe("An optional background image, as a data URI."),
  theme: z.string().describe('The theme of the video (e.g., "My skincare routine").'),
  style: z.string().describe('The visual style for the thumbnail (e.g., "MrBeast Style").'),
  aspectRatio: z.enum(['16:9']).describe('The aspect ratio for the thumbnail.'),
});
export type GenerateThumbnailIdeasInput = z.infer<typeof GenerateThumbnailIdeasInputSchema>;

const GenerateThumbnailIdeasOutputSchema = z.object({
  youtubeTitle: z.string().describe('A catchy, SEO-optimized title for the YouTube video.'),
  overlayText: z.string().describe('Short, impactful text to overlay on the thumbnail.'),
  emoji: z.string().describe('A relevant emoji to include in the thumbnail or title.'),
  youtubeDescription: z.string().describe('A detailed, SEO-friendly description for the YouTube video, including a call to action.'),
  hashtags: z.string().describe('A string of relevant hashtags, space-separated, starting with # (e.g., "#ai #tecnologia #futuro").'),
  tags: z.string().describe('A comma-separated string of keywords for the YouTube tags field (e.g., "inteligencia artificial, tecnologia, futuro, inovação").'),
  imagePrompt: z.string().describe('A detailed English prompt to generate the thumbnail image.'),
});
export type GenerateThumbnailIdeasOutput = z.infer<typeof GenerateThumbnailIdeasOutputSchema>;


const generateThumbnailAndSeoPrompt = ai.definePrompt({
    name: 'generateThumbnailAndSeoPrompt',
    input: { schema: z.object({ 
        theme: z.string(), 
        style: z.string(),
        mainImageUri: z.string(),
        backgroundImageUri: z.string().optional(),
    }) },
    output: { schema: GenerateThumbnailIdeasOutputSchema },
    prompt: `You are a YouTube content and SEO strategist. Based on the video theme "{{theme}}", the visual style "{{style}}", and the provided reference images, generate the following assets. All text output must be in Brazilian Portuguese, except for the image prompt which must be in English.

1.  **YouTube Title:** A catchy, SEO-optimized title.
2.  **Overlay Text:** A very short, impactful text to put on the thumbnail image itself.
3.  **Emoji:** A single relevant emoji to use.
4.  **YouTube Description:** A detailed, SEO-friendly description.
5.  **Hashtags:** A space-separated list of 3-5 relevant hashtags.
6.  **Tags:** A comma-separated list of keywords for the YouTube tags section.
7.  **Image Prompt:** A detailed English prompt for an image generation AI. The prompt should describe a YouTube thumbnail in a "{{style}}" style. The video is about "{{theme}}". The thumbnail should prominently feature the main character from the main reference image. The background should be inspired by the background reference image if provided. The prompt should include instructions to overlay the text "{{overlayText}}" and the emoji "{{emoji}}" in a visually appealing way. The overall mood should be exciting and clickable.

Main reference image:
{{media url=mainImageUri}}

{{#if backgroundImageUri}}
Background reference image:
{{media url=backgroundImageUri}}
{{/if}}
`,
    config: {
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        ],
    }
});


const generateThumbnailIdeasFlow = ai.defineFlow(
  {
    name: 'generateThumbnailIdeasFlow',
    inputSchema: GenerateThumbnailIdeasInputSchema,
    outputSchema: GenerateThumbnailIdeasOutputSchema,
  },
  async ({ mainImageUri, backgroundImageUri, theme, style }) => {
    
    const { output } = await generateThumbnailAndSeoPrompt({
        theme,
        style,
        mainImageUri,
        backgroundImageUri,
    });
    
    if (!output) {
        throw new Error('Failed to generate thumbnail ideas.');
    }

    return output;
  }
);


export async function generateThumbnailIdeas(input: GenerateThumbnailIdeasInput): Promise<GenerateThumbnailIdeasOutput> {
  return generateThumbnailIdeasFlow(input);
}
