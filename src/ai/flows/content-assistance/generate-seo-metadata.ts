'use server';
/**
 * @fileOverview Generates SEO metadata for a YouTube video based on a script's topic and keywords.
 *
 * - generateSeoMetadata - A function that generates SEO metadata.
 * - GenerateSeoMetadataInput - The input type for the function.
 * - GenerateSeoMetadataOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoMetadataInputSchema = z.object({
  topic: z.string().describe('The main topic of the video script.'),
  keywords: z.string().describe('A comma-separated list of relevant SEO keywords for the script.'),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

const GenerateSeoMetadataOutputSchema = z.object({
  youtubeTitle: z.string().describe('A catchy, SEO-optimized title for the YouTube video.'),
  youtubeDescription: z.string().describe('A detailed, SEO-friendly description for the YouTube video, including a call to action.'),
  hashtags: z.string().describe('A string of relevant hashtags, space-separated, starting with # (e.g., "#ai #tecnologia #futuro").'),
  tags: z.string().describe('A comma-separated string of keywords for the YouTube tags field (e.g., "inteligencia artificial, tecnologia, futuro, inovação").'),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;

export async function generateSeoMetadata(input: GenerateSeoMetadataInput): Promise<GenerateSeoMetadataOutput> {
  return generateSeoMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoMetadataPrompt',
  input: {schema: GenerateSeoMetadataInputSchema},
  output: {schema: GenerateSeoMetadataOutputSchema},
  prompt: `You are a YouTube SEO specialist. Based on the video's topic and keywords, generate the following metadata to maximize its reach and engagement. All output must be in Brazilian Portuguese.

Topic: {{topic}}
Keywords: {{keywords}}

1.  **YouTube Title:** Create a compelling and keyword-rich title.
2.  **YouTube Description:** Write a detailed description. Start with a strong hook, summarize the video, include keywords naturally, and end with a call to action (e.g., subscribe, comment, like).
3.  **Hashtags:** Provide a list of 3-5 relevant hashtags.
4.  **Tags:** Provide a comprehensive, comma-separated list of keywords for the YouTube tags section.
`,
});

const generateSeoMetadataFlow = ai.defineFlow(
  {
    name: 'generateSeoMetadataFlow',
    inputSchema: GenerateSeoMetadataInputSchema,
    outputSchema: GenerateSeoMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
