'use server';

/**
 * @fileOverview A script idea generator that combines a character and a scene to produce creative content.
 *
 * - generateScriptIdeas - A function that generates script ideas.
 * - GenerateScriptIdeasInput - The input type for the generateScriptIdeas function.
 * - GenerateScriptIdeasOutput - The return type for the generateScriptIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScriptIdeasInputSchema = z.object({
  characterProfile: z
    .string()
    .describe('A detailed description of the character, including name, niche, personality, appearance, and backstory.'),
  sceneDescription: z
    .string()
    .describe('A detailed description of the scene, including setting, action, and mood.'),
});
export type GenerateScriptIdeasInput = z.infer<typeof GenerateScriptIdeasInputSchema>;

const GenerateScriptIdeasOutputSchema = z.object({
  scriptIdea: z.string().describe('A creative script idea combining the character and scene.'),
});
export type GenerateScriptIdeasOutput = z.infer<typeof GenerateScriptIdeasOutputSchema>;

export async function generateScriptIdeas(input: GenerateScriptIdeasInput): Promise<GenerateScriptIdeasOutput> {
  return generateScriptIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScriptIdeasPrompt',
  input: {schema: GenerateScriptIdeasInputSchema},
  output: {schema: GenerateScriptIdeasOutputSchema},
  prompt: `You are a creative scriptwriter. Generate a script idea based on the provided character and scene descriptions.

Character Profile:
{{characterProfile}}

Scene Description:
{{sceneDescription}}

Script Idea:`,
});

const generateScriptIdeasFlow = ai.defineFlow(
  {
    name: 'generateScriptIdeasFlow',
    inputSchema: GenerateScriptIdeasInputSchema,
    outputSchema: GenerateScriptIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
