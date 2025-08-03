'use server';

/**
 * @fileOverview Generates a structured script in JSON format.
 *
 * - generateJsonScript - A function that generates the script.
 * - GenerateJsonScriptInput - The input type for the function.
 * - GenerateJsonScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneSchema = z.object({
  sceneTitle: z.string().describe('The title of the scene.'),
  narration: z.string().describe('The narration script for this scene in Portuguese.'),
  imagePrompt: z.string().describe('A detailed prompt in English to generate an image for the scene.'),
  videoPrompt: z.string().describe('A detailed prompt in English to generate a video for the scene.'),
});

const GenerateJsonScriptInputSchema = z.object({
  characterProfile: z.string().describe('A detailed description of the character.'),
  sceneDescription: z.string().describe('A detailed description of the scene.'),
});
export type GenerateJsonScriptInput = z.infer<typeof GenerateJsonScriptInputSchema>;

const GenerateJsonScriptOutputSchema = z.object({
  title: z.string().describe('The title of the overall script.'),
  scenes: z.array(SceneSchema).describe('An array of scenes that make up the script.'),
});
export type GenerateJsonScriptOutput = z.infer<typeof GenerateJsonScriptOutputSchema>;

export async function generateJsonScript(input: GenerateJsonScriptInput): Promise<GenerateJsonScriptOutput> {
  return generateJsonScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJsonScriptPrompt',
  input: {schema: GenerateJsonScriptInputSchema},
  output: {schema: GenerateJsonScriptOutputSchema},
  prompt: `You are a screenwriter. Create a script in JSON format based on the character and scene provided. Be faithful to all characteristics of the character and scene.

Character Profile:
{{{characterProfile}}}

Scene Description:
{{{sceneDescription}}}

Generate a title and at least one scene. The narration must be in Portuguese. The image and video prompts must be in English.`,
});

const generateJsonScriptFlow = ai.defineFlow(
  {
    name: 'generateJsonScriptFlow',
    inputSchema: GenerateJsonScriptInputSchema,
    outputSchema: GenerateJsonScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
