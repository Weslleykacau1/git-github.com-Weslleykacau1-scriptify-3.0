'use server';

/**
 * @fileOverview Generates a script (short or long) following viral content formulas to maximize reach.
 *
 * - generateViralScript - A function that generates a viral script.
 * - GenerateViralScriptInput - The input type for the generateViralScript function.
 * - GenerateViralScriptOutput - The return type for the generateViralScript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateViralScriptInputSchema = z.object({
  theme: z.string().describe('The theme of the viral script.'),
  duration: z.enum(['8s', '15s', '30s']).describe('The desired duration of the video.'),
  videoType: z.enum(['Shorts', 'Watch']).describe('The type of video platform (e.g., YouTube Shorts, Facebook Watch).'),
  cta: z.string().describe('The call to action to include at the end.'),
  imagePrompt: z.string().optional().describe("An optional image to use as inspiration, as a data URI."),
});
export type GenerateViralScriptInput = z.infer<typeof GenerateViralScriptInputSchema>;

const GenerateViralScriptOutputSchema = z.object({
  script: z.string().describe('A script designed for virality, including setup, hook, escalation, climax, and CTA.'),
});
export type GenerateViralScriptOutput = z.infer<typeof GenerateViralScriptOutputSchema>;

export async function generateViralScript(input: GenerateViralScriptInput): Promise<GenerateViralScriptOutput> {
  return generateViralScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateViralScriptPrompt',
  input: {schema: GenerateViralScriptInputSchema},
  output: {schema: GenerateViralScriptOutputSchema},
  prompt: `You are a viral content strategist. Your task is to generate a script for a {{videoType}} video with a duration of {{duration}}.
The script must follow a structure with high potential for going viral.

Theme: {{theme}}
Call to Action: "{{cta}}"

{{#if imagePrompt}}
Use this image as inspiration:
{{media url=imagePrompt}}
{{/if}}

The script structure for Shorts must be:
1. Set up: A starting phrase that creates context.
2. Hook: An unexpected action that grabs attention.
3. Escalation: The development of the action.
4. Climax/Punchline: The high point or the final joke.
5. CTA: The call to action.

Generate a compelling script in Portuguese based on these instructions.
`,
});

const generateViralScriptFlow = ai.defineFlow(
  {
    name: 'generateViralScriptFlow',
    inputSchema: GenerateViralScriptInputSchema,
    outputSchema: GenerateViralScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
