// src/ai/flows/script-generation/generate-long-script.ts
'use server';

/**
 * @fileOverview A script generator specializing in creating scripts for long-form videos (5 to 20 minutes), focusing on viewer retention.
 *
 * - generateLongScript - A function that generates a long-form video script.
 * - GenerateLongScriptInput - The input type for the generateLongScript function.
 * - GenerateLongScriptOutput - The return type for the generateLongScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneSchema = z.object({
  sceneTitle: z.string().describe('The title of the scene.'),
  narration: z.string().describe('The narration script for this scene in Brazilian Portuguese.'),
  imagePrompt: z.string().describe('A detailed prompt in English to generate an image for the scene.'),
  videoPrompt: z.string().describe('A detailed prompt in English to generate a video for the scene.'),
});

const GenerateLongScriptInputSchema = z.object({
  characterProfile: z
    .string()
    .optional()
    .describe('A detailed description of the character, including name, niche, personality, appearance, and backstory.'),
  sceneDescription: z
    .string()
    .optional()
    .describe('A detailed description of the scene, including setting, action, and mood.'),
  topic: z.string().describe('The main topic or theme of the video script.'),
  duration: z.number().describe('The desired duration of the video in minutes (e.g., 5, 10, 15, 20).'),
});
export type GenerateLongScriptInput = z.infer<typeof GenerateLongScriptInputSchema>;

const GenerateLongScriptOutputSchema = z.object({
    title: z.string().describe('The title of the video script.'),
    scenes: z.array(SceneSchema).describe('An array of scenes that make up the documentary.'),
    thumbnailIdeas: z.string().describe('Ideas for creating a thumbnail for the video.'),
    seoKeywords: z.string().describe('SEO keywords relevant to the script as a whole.'),
});
export type GenerateLongScriptOutput = z.infer<typeof GenerateLongScriptOutputSchema>;

export async function generateLongScript(input: GenerateLongScriptInput): Promise<GenerateLongScriptOutput> {
  return generateLongScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLongScriptPrompt',
  input: {schema: GenerateLongScriptInputSchema},
  output: {schema: GenerateLongScriptOutputSchema},
  prompt: `You are a creative screenwriter specializing in long-form video content for platforms like YouTube. Your goal is to create a detailed script with a strict duration of {{duration}} minutes on the topic of "{{topic}}".

Your tasks are to:
1.  Create a compelling title for the video.
2.  Break the script down into a series of logical scenes that collectively meet the {{duration}}-minute duration.
3.  For each scene, write the narration in Brazilian Portuguese.
4.  For each scene, create a detailed image generation prompt (in English).
5.  For each scene, create a detailed video generation prompt (in English).
6.  Provide some creative ideas for the video's thumbnail.
7.  Generate relevant SEO keywords for the video.

The script's dialogue and narration must be in Brazilian Portuguese.
All other outputs (prompts, ideas, keywords) should be in the language appropriate for their use (Prompts in English, others in Portuguese).

{{#if characterProfile}}
Be faithful to the following character profile:
{{{characterProfile}}}
{{/if}}

{{#if sceneDescription}}
And be faithful to the following scene description:
{{{sceneDescription}}}
{{/if}}

Generate the full content now.
`,
});

const generateLongScriptFlow = ai.defineFlow(
  {
    name: 'generateLongScriptFlow',
    inputSchema: GenerateLongScriptInputSchema,
    outputSchema: GenerateLongScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
