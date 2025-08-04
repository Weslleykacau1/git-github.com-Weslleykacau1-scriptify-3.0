'use server';

/**
 * @fileOverview Generates a structured video script from a raw transcription.
 *
 * - generateScriptFromTranscription - The function that generates the script.
 * - GenerateScriptFromTranscriptionInput - The input type for the function.
 * - GenerateScriptFromTranscriptionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScriptFromTranscriptionInputSchema = z.object({
  transcription: z.string().describe('The raw text transcription of a video, potentially with timestamps.'),
  imagePrompt: z.string().optional().describe("An optional image to use as inspiration for the scene's setting, as a data URI."),
});
export type GenerateScriptFromTranscriptionInput = z.infer<typeof GenerateScriptFromTranscriptionInputSchema>;

const GenerateScriptFromTranscriptionOutputSchema = z.object({
  script: z.string().describe('A structured script in Markdown format, with a title, scene, action, and dialogue based on the transcription.'),
});
export type GenerateScriptFromTranscriptionOutput = z.infer<typeof GenerateScriptFromTranscriptionOutputSchema>;

export async function generateScriptFromTranscription(input: GenerateScriptFromTranscriptionInput): Promise<GenerateScriptFromTranscriptionOutput> {
  return generateScriptFromTranscriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScriptFromTranscriptionPrompt',
  input: {schema: GenerateScriptFromTranscriptionInputSchema},
  output: {schema: GenerateScriptFromTranscriptionOutputSchema},
  prompt: `You are a screenwriter. Your task is to convert the following raw transcription into a structured video script in Markdown format.

The script should have:
- A creative title.
- A scene description. If an image is provided, use it as inspiration for the setting. Otherwise, infer the setting from the dialogue.
- A main action that summarizes what is happening.
- The dialogue extracted from the transcription.

{{#if imagePrompt}}
Use this image as inspiration for the scene's setting:
{{media url=imagePrompt}}
{{/if}}

Transcription:
{{{transcription}}}

Generate the structured script now. The output must be in Portuguese.`,
});

const generateScriptFromTranscriptionFlow = ai.defineFlow(
  {
    name: 'generateScriptFromTranscriptionFlow',
    inputSchema: GenerateScriptFromTranscriptionInputSchema,
    outputSchema: GenerateScriptFromTranscriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
