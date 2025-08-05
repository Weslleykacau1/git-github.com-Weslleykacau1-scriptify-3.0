'use server';

/**
 * @fileOverview Generates a short, comic scene based on a character profile.
 *
 * - generateQuickScene - A function that generates the scene.
 * - GenerateQuickSceneInput - The input type for the function.
 * - GenerateQuickSceneOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuickSceneInputSchema = z.object({
  characterProfile: z.string().describe('A JSON string of the character profile.'),
});
export type GenerateQuickSceneInput = z.infer<typeof GenerateQuickSceneInputSchema>;

const GenerateQuickSceneOutputSchema = z.object({
  scene: z.string().describe('A short, comic scene in Markdown format.'),
});
export type GenerateQuickSceneOutput = z.infer<typeof GenerateQuickSceneOutputSchema>;

export async function generateQuickScene(input: GenerateQuickSceneInput): Promise<GenerateQuickSceneOutput> {
  return generateQuickSceneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuickScenePrompt',
  input: {schema: GenerateQuickSceneInputSchema},
  output: {schema: GenerateQuickSceneOutputSchema},
  prompt: `You are a creative and comedic screenwriter. Your task is to generate a short, funny scene based on the character profile provided.

The scene should be formatted in Markdown and be no longer than 15 seconds. The dialogue must be in Brazilian Portuguese.

Character Profile:
{{{characterProfile}}}

Generate the comedic scene now.`,
});

const generateQuickSceneFlow = ai.defineFlow(
  {
    name: 'generateQuickSceneFlow',
    inputSchema: GenerateQuickSceneInputSchema,
    outputSchema: GenerateQuickSceneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
