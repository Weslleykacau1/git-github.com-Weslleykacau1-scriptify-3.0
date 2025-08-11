
'use server';

/**
 * @fileOverview An AI agent that analyzes a character image and automatically extracts their characteristics.
 *
 * - analyzeCharacterImage - A function that handles the character image analysis process.
 * - AnalyzeCharacterImageInput - The input type for the analyzeCharacterImage function.
 * - AnalyzeCharacterImageOutput - The return type for the analyzeCharacterImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeCharacterImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a character, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeCharacterImageInput = z.infer<typeof AnalyzeCharacterImageInputSchema>;

const AnalyzeCharacterImageOutputSchema = z.object({
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
export type AnalyzeCharacterImageOutput = z.infer<typeof AnalyzeCharacterImageOutputSchema>;

export async function analyzeCharacterImage(input: AnalyzeCharacterImageInput): Promise<AnalyzeCharacterImageOutput> {
  return analyzeCharacterImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCharacterImagePrompt',
  input: {schema: AnalyzeCharacterImageInputSchema},
  output: {schema: AnalyzeCharacterImageOutputSchema},
  prompt: `You are an AI character profile generator. You will analyze the character's image and extract the following information to populate the character's profile:

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

Analyze the following image to extract the above information:
Image: {{media url=photoDataUri}}

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

const analyzeCharacterImageFlow = ai.defineFlow(
  {
    name: 'analyzeCharacterImageFlow',
    inputSchema: AnalyzeCharacterImageInputSchema,
    outputSchema: AnalyzeCharacterImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
