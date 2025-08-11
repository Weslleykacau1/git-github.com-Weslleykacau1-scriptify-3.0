
'use server';

/**
 * @fileOverview An AI agent that receives a block of text and extracts influencer characteristics to fill out a profile.
 *
 * - analyzeTextProfile - A function that handles the text profile analysis.
 * - AnalyzeTextProfileInput - The input type for the analyzeTextProfile function.
 * - AnalyzeTextProfileOutput - The return type for the analyzeTextProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTextProfileInputSchema = z.object({
  textDescription: z
    .string()
    .describe('A text description of the character.'),
});
export type AnalyzeTextProfileInput = z.infer<typeof AnalyzeTextProfileInputSchema>;

const AnalyzeTextProfileOutputSchema = z.object({
  name: z.string().describe("The character's name."),
  niche: z.string().describe("The character's niche."),
  personality: z.string().describe("The character's personality."),
  physicalAppearance: z.string().describe("A hyper-detailed description of the character's physical appearance, focusing on facial features like face shape, eye color, hair type, and any other unique details to ensure visual consistency."),
  clothingStyle: z.string().describe("The character's clothing style."),
  biography: z.string().describe("A short biography of the character."),
  uniqueTraits: z.string().describe("The character's unique traits."),
  accent: z.string().describe("The character's accent (in Brazilian Portuguese)."),
  age: z.string().describe("The character's age."),
  gender: z.string().describe("The character's gender."),
  generationSeed: z.string().describe('A random numerical generation seed.'),
  negativePrompt: z.string().optional().describe('A negative prompt of what should be avoided.'),
});
export type AnalyzeTextProfileOutput = z.infer<typeof AnalyzeTextProfileOutputSchema>;

export async function analyzeTextProfile(input: AnalyzeTextProfileInput): Promise<AnalyzeTextProfileOutput> {
  return analyzeTextProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTextProfilePrompt',
  input: {schema: AnalyzeTextProfileInputSchema},
  output: {schema: AnalyzeTextProfileOutputSchema},
  prompt: `You are an AI character profile generator. You will analyze the character's text description and extract the following information to populate the character's profile:

- Name: The character's name.
- Niche: The character's niche.
- Personality: The character's personality.
- Physical Appearance: Provide a hyper-detailed description of the character's physical appearance. Focus on facial features like face shape, eye color, hair type, skin tone, and any other unique details to ensure maximum visual consistency in later generations.
- Clothing Style: The character's clothing style.
- Biography: A short biography of the character.
- Unique Traits: The character's unique traits.
- Accent: The character's accent (in Brazilian Portuguese).
- Age: The character's age.
- Gender: The character's gender.
- Generation Seed: Generate a 6-digit random numerical generation seed.
- Negative Prompt: Optional, what should be avoided in generation.

Analyze the following text to extract the above information:
Text Description: {{{textDescription}}}

Ensure you produce all fields in Portuguese.`,
  config: {
    safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
    ],
  }
});

const analyzeTextProfileFlow = ai.defineFlow(
  {
    name: 'analyzeTextProfileFlow',
    inputSchema: AnalyzeTextProfileInputSchema,
    outputSchema: AnalyzeTextProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
