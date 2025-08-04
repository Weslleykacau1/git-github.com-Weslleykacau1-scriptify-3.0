
'use server';

/**
 * @fileOverview Generates thumbnail ideas including text, SEO, and two image variations.
 *
 * - generateThumbnailIdeas - A function that handles the thumbnail generation process.
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
});
export type GenerateThumbnailIdeasInput = z.infer<typeof GenerateThumbnailIdeasInputSchema>;

const GenerateThumbnailIdeasOutputSchema = z.object({
  youtubeTitle: z.string().describe('A catchy, SEO-optimized title for the YouTube video.'),
  overlayText: z.string().describe('Short, impactful text to overlay on the thumbnail.'),
  emoji: z.string().describe('A relevant emoji to include in the thumbnail or title.'),
  youtubeDescription: z.string().describe('A detailed, SEO-friendly description for the YouTube video, including a call to action.'),
  hashtags: z.string().describe('A string of relevant hashtags, space-separated, starting with # (e.g., "#ai #tecnologia #futuro").'),
  tags: z.string().describe('A comma-separated string of keywords for the YouTube tags field (e.g., "inteligencia artificial, tecnologia, futuro, inovação").'),
  thumbnailImage1Uri: z.string().describe('The first generated thumbnail image as a data URI.'),
  thumbnailImage2Uri: z.string().describe('The second generated thumbnail image as a data URI.'),
});
export type GenerateThumbnailIdeasOutput = z.infer<typeof GenerateThumbnailIdeasOutputSchema>;


const generateThumbnailAndSeoPrompt = ai.definePrompt({
    name: 'generateThumbnailAndSeoPrompt',
    input: { schema: z.object({ theme: z.string(), style: z.string() }) },
    output: { schema: z.object({ 
        youtubeTitle: z.string(), 
        overlayText: z.string(), 
        emoji: z.string(),
        youtubeDescription: z.string(),
        hashtags: z.string(),
        tags: z.string(),
    }) },
    prompt: `You are a YouTube content and SEO strategist. Based on the video theme "{{theme}}" and the visual style "{{style}}", generate the following assets. All output must be in Brazilian Portuguese.

1.  **YouTube Title:** A catchy, SEO-optimized title.
2.  **Overlay Text:** A very short, impactful text to put on the thumbnail image itself.
3.  **Emoji:** A single relevant emoji to use.
4.  **YouTube Description:** A detailed, SEO-friendly description.
5.  **Hashtags:** A space-separated list of 3-5 relevant hashtags.
6.  **Tags:** A comma-separated list of keywords for the YouTube tags section.
`,
});


async function generateImage(prompt: string, mainImageUri: string, backgroundImageUri?: string): Promise<string> {
    const promptParts = [
        { text: prompt },
        { media: { url: mainImageUri } },
    ];
    if (backgroundImageUri) {
        promptParts.push({ media: { url: backgroundImageUri } });
    }

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


const generateThumbnailIdeasFlow = ai.defineFlow(
  {
    name: 'generateThumbnailIdeasFlow',
    inputSchema: GenerateThumbnailIdeasInputSchema,
    outputSchema: GenerateThumbnailIdeasOutputSchema,
  },
  async ({ mainImageUri, backgroundImageUri, theme, style }) => {
    // Step 1: Generate textual and SEO ideas
    const textAndSeoResult = await generateThumbnailAndSeoPrompt({ theme, style });
    const { youtubeTitle, overlayText, emoji, youtubeDescription, hashtags, tags } = textAndSeoResult.output!;

    // Step 2: Construct a detailed prompt for image generation
    const imagePrompt = `Create a YouTube thumbnail in a "${style}" style. The video is about "${theme}". The thumbnail should prominently feature the main character from the reference image. The background should be inspired by the background reference image if provided. Overlay the text "${overlayText}" and include the emoji "${emoji}" in a visually appealing way. The overall mood should be exciting and clickable.`;

    // Step 3: Generate two image variations
    const [thumbnailImage1Uri, thumbnailImage2Uri] = await Promise.all([
      generateImage(`${imagePrompt} Variation 1.`, mainImageUri, backgroundImageUri),
      generateImage(`${imagePrompt} Variation 2, slightly different composition.`, mainImageUri, backgroundImageUri),
    ]);
    
    // Step 4: Return all results
    return {
      youtubeTitle,
      overlayText,
      emoji,
      youtubeDescription,
      hashtags,
      tags,
      thumbnailImage1Uri,
      thumbnailImage2Uri,
    };
  }
);


export async function generateThumbnailIdeas(input: GenerateThumbnailIdeasInput): Promise<GenerateThumbnailIdeasOutput> {
  return generateThumbnailIdeasFlow(input);
}
