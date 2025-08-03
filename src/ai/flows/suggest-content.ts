'use server';

/**
 * @fileOverview AI-powered content suggestion flow for video titles and dialogues.
 *
 * - suggestContent - A function that suggests video titles and dialogues based on a scene description and character profile.
 * - SuggestContentInput - The input type for the suggestContent function.
 * - SuggestContentOutput - The return type for the suggestContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentInputSchema = z.object({
  sceneDescription: z.string().describe('The description of the scene.'),
  characterProfile: z.string().describe('The profile of the character.'),
});
export type SuggestContentInput = z.infer<typeof SuggestContentInputSchema>;

const SuggestContentOutputSchema = z.object({
  videoTitles: z.array(z.string()).describe('Suggested video titles.'),
  dialogues: z.array(z.string()).describe('Suggested dialogues.'),
});
export type SuggestContentOutput = z.infer<typeof SuggestContentOutputSchema>;

export async function suggestContent(input: SuggestContentInput): Promise<SuggestContentOutput> {
  return suggestContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentPrompt',
  input: {schema: SuggestContentInputSchema},
  output: {schema: SuggestContentOutputSchema},
  prompt: `You are a creative content strategist. Given the scene description and character profile, suggest engaging video titles and dialogues.

Scene Description: {{{sceneDescription}}}
Character Profile: {{{characterProfile}}}

Suggest at least 3 video titles and 3 dialogues.

Format your response as a JSON object with 'videoTitles' and 'dialogues' arrays.
`, // Removed JSON delimiters from the prompt
});

const suggestContentFlow = ai.defineFlow(
  {
    name: 'suggestContentFlow',
    inputSchema: SuggestContentInputSchema,
    outputSchema: SuggestContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
