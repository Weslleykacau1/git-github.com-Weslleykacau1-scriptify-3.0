// src/ai/flows/script-generation/generate-web-doc-script.ts
'use server';

/**
 * @fileOverview Creates a complete script for a web documentary, including narration and image/video prompts for each scene.
 *
 * - generateWebDocScript - A function that generates the web doc script.
 * - GenerateWebDocScriptInput - The input type for the generateWebDocScript function.
 * - GenerateWebDocScriptOutput - The return type for the generateWebDocScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneSchema = z.object({
  sceneTitle: z.string().describe('The title of the scene.'),
  narration: z.string().describe('The narration script for this scene in Brazilian Portuguese.'),
  imagePrompt: z.string().describe('A detailed prompt in English to generate an image for the scene.'),
  videoPrompt: z.string().describe('A detailed prompt in English to generate a video for the scene.'),
});

const GenerateWebDocScriptInputSchema = z.object({
  topic: z.string().describe('The theme of the documentary.'),
  topicsToCover: z.string().optional().describe('A comma-separated list of specific topics to cover.'),
  numberOfScenes: z.number().describe('The desired number of scenes for the documentary.'),
});
export type GenerateWebDocScriptInput = z.infer<typeof GenerateWebDocScriptInputSchema>;

const GenerateWebDocScriptOutputSchema = z.object({
  title: z.string().describe('The title of the web documentary.'),
  scenes: z.array(SceneSchema).describe('An array of scenes that make up the documentary.'),
  seoKeywords: z.string().describe('SEO keywords relevant to the script as a whole.'),
  thumbnailIdeas: z.string().describe('Ideas for creating a thumbnail for the video.'),
});
export type GenerateWebDocScriptOutput = z.infer<typeof GenerateWebDocScriptOutputSchema>;

export async function generateWebDocScript(input: GenerateWebDocScriptInput): Promise<GenerateWebDocScriptOutput> {
  return generateWebDocScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebDocScriptPrompt',
  input: {schema: GenerateWebDocScriptInputSchema},
  output: {schema: GenerateWebDocScriptOutputSchema},
  prompt: `You are a documentary filmmaker and screenwriter. Create a complete script for a web documentary with the main theme of "{{topic}}".
The total number of scenes must be strictly {{numberOfScenes}}.

{{#if topicsToCover}}
The documentary should cover the following topics: {{topicsToCover}}.
{{/if}}

Your task is to:
1.  Create a compelling title for the documentary.
2.  Break the documentary down into a series of {{numberOfScenes}} logical scenes.
3.  For each scene, write the narration in Brazilian Portuguese.
4.  For each scene, create a detailed image generation prompt (in English).
5.  For each scene, create a detailed video generation prompt (in English).
6.  Generate relevant SEO keywords for the overall script.
7.  Provide some thumbnail ideas.

The final output should be a complete storyboard, ready for production. 
The narration, title, seoKeywords and thumbnailIdeas must be in Brazilian Portuguese.
The image and video prompts must be in English.
`,
});

const generateWebDocScriptFlow = ai.defineFlow(
  {
    name: 'generateWebDocScriptFlow',
    inputSchema: GenerateWebDocScriptInputSchema,
    outputSchema: GenerateWebDocScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
