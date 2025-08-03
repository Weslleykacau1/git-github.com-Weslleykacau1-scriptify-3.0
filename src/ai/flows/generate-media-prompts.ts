// src/ai/flows/generate-media-prompts.ts
'use server';

/**
 * @fileOverview Generates image and video prompts from scene parameters using AI.
 *
 * - generateMediaPrompts - A function that generates image and video prompts.
 * - GenerateMediaPromptsInput - The input type for the generateMediaPrompts function.
 * - GenerateMediaPromptsOutput - The return type for the generateMediaPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMediaPromptsInputSchema = z.object({
  sceneTitle: z.string().describe('The title of the scene.'),
  sceneSetting: z.string().describe('A description of the scene setting.'),
  sceneAction: z.string().describe('A description of the main action in the scene.'),
  cameraAngle: z.string().describe('The camera angle for the scene.'),
  videoDuration: z.string().describe('The duration of the video.'),
  productDetails: z.string().optional().describe('Details of any products featured in the scene.'),
});
export type GenerateMediaPromptsInput = z.infer<typeof GenerateMediaPromptsInputSchema>;

const GenerateMediaPromptsOutputSchema = z.object({
  imagePrompt: z.string().describe('A prompt for generating an image of the scene.'),
  videoPrompt: z.string().describe('A prompt for generating a video of the scene.'),
  seoKeywords: z.string().describe('SEO keywords related to the scene.'),
  thumbnailIdeas: z.string().describe('Ideas for creating a thumbnail for the scene.'),
});
export type GenerateMediaPromptsOutput = z.infer<typeof GenerateMediaPromptsOutputSchema>;

export async function generateMediaPrompts(input: GenerateMediaPromptsInput): Promise<GenerateMediaPromptsOutput> {
  return generateMediaPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMediaPromptsPrompt',
  input: {schema: GenerateMediaPromptsInputSchema},
  output: {schema: GenerateMediaPromptsOutputSchema},
  prompt: `You are a creative assistant helping content creators generate media prompts and SEO information for their scenes.

  Based on the following scene parameters, generate an image prompt, a video prompt, SEO keywords, and thumbnail ideas.

  Scene Title: {{{sceneTitle}}}
  Scene Setting: {{{sceneSetting}}}
  Scene Action: {{{sceneAction}}}
  Camera Angle: {{{cameraAngle}}}
  Video Duration: {{{videoDuration}}}
  Product Details: {{{productDetails}}}

  Ensure that the image and video prompts are detailed and descriptive, suitable for use with AI image and video generation models. The image prompts must be in English.
  The video prompts must be in English.

  The SEO keywords should be relevant to the scene and optimized for YouTube and TikTok.
  The thumbnail ideas should be engaging and clickbait-worthy.
  `,
});

const generateMediaPromptsFlow = ai.defineFlow(
  {
    name: 'generateMediaPromptsFlow',
    inputSchema: GenerateMediaPromptsInputSchema,
    outputSchema: GenerateMediaPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
