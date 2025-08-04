'use server';

/**
 * @fileOverview Paraphrases a script, rewriting it with new words while keeping the original meaning.
 *
 * - paraphraseScript - The function that paraphrases the script.
 * - ParaphraseScriptInput - The input type for the function.
 * - ParaphraseScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParaphraseScriptInputSchema = z.object({
  transcription: z.string().describe('The original transcription text to be paraphrased.'),
  imagePrompt: z.string().optional().describe("An optional image to use as inspiration for the scene's setting, as a data URI."),
});
export type ParaphraseScriptInput = z.infer<typeof ParaphraseScriptInputSchema>;

const ParaphraseScriptOutputSchema = z.object({
  script: z.string().describe('A new, paraphrased script in Markdown format, rewritten with different words but maintaining the original theme and meaning.'),
});
export type ParaphraseScriptOutput = z.infer<typeof ParaphraseScriptOutputSchema>;

export async function paraphraseScript(input: ParaphraseScriptInput): Promise<ParaphraseScriptOutput> {
  return paraphraseScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'paraphraseScriptPrompt',
  input: {schema: ParaphraseScriptInputSchema},
  output: {schema: ParaphraseScriptOutputSchema},
  prompt: `You are a creative screenwriter. Your task is to read the following transcription, understand its core message and theme, and then rewrite it from scratch.

- The new script must have the same meaning and theme as the original.
- Use completely different words, sentence structures, and dialogues.
- The output must be in Markdown format, including a title, scene, action, and dialogue.
- If an image is provided, use it as inspiration for the scene's setting.

{{#if imagePrompt}}
Use this image as inspiration for the scene's setting:
{{media url=imagePrompt}}
{{/if}}

Original Transcription:
{{{transcription}}}

Rewrite the script creatively now. The output must be in Portuguese.`,
});

const paraphraseScriptFlow = ai.defineFlow(
  {
    name: 'paraphraseScriptFlow',
    inputSchema: ParaphraseScriptInputSchema,
    outputSchema: ParaphraseScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
