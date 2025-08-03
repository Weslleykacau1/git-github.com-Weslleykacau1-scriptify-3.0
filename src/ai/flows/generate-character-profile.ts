'use server';

/**
 * @fileOverview A character profile generator AI agent that analyzes an image and pre-fills character details.
 *
 * - generateCharacterProfile - A function that handles the character profile generation process.
 * - GenerateCharacterProfileInput - The input type for the generateCharacterProfile function.
 * - GenerateCharacterProfileOutput - The return type for the generateCharacterProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCharacterProfileInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a character, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateCharacterProfileInput = z.infer<typeof GenerateCharacterProfileInputSchema>;

const GenerateCharacterProfileOutputSchema = z.object({
  name: z.string().describe('The name of the character.'),
  niche: z.string().describe('The niche of the character.'),
  personality: z.string().describe('The personality of the character.'),
  physicalAppearance: z.string().describe('The physical appearance of the character.'),
  clothingStyle: z.string().describe('The clothing style of the character.'),
  biography: z.string().describe('A short biography of the character.'),
  uniqueTraits: z.string().describe('Unique traits of the character.'),
  accent: z.string().describe('The accent of the character (in Portuguese from Brazil).'),
});
export type GenerateCharacterProfileOutput = z.infer<typeof GenerateCharacterProfileOutputSchema>;

export async function generateCharacterProfile(input: GenerateCharacterProfileInput): Promise<GenerateCharacterProfileOutput> {
  return generateCharacterProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterProfilePrompt',
  input: {schema: GenerateCharacterProfileInputSchema},
  output: {schema: GenerateCharacterProfileOutputSchema},
  prompt: `You are an AI character profile generator. You will analyze the image of the character and extract the following information to pre-fill the character's profile:

- Name: The name of the character.
- Niche: The niche of the character.
- Personality: The personality of the character.
- Physical Appearance: The physical appearance of the character.
- Clothing Style: The clothing style of the character.
- Biography: A short biography of the character.
- Unique Traits: Unique traits of the character.
- Accent: The accent of the character (in Portuguese from Brazil).

Analyze the following image to extract the above information:

{{media url=photoDataUri}}

Make sure to output all the fields.`,
});

const generateCharacterProfileFlow = ai.defineFlow(
  {
    name: 'generateCharacterProfileFlow',
    inputSchema: GenerateCharacterProfileInputSchema,
    outputSchema: GenerateCharacterProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
