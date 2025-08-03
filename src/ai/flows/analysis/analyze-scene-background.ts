'use server';

/**
 * @fileOverview An AI agent that analyzes a scene background image and generates a detailed textual description.
 *
 * - analyzeSceneBackground - A function that handles the scene analysis process.
 * - AnalyzeSceneBackgroundInput - The input type for the analyzeSceneBackground function.
 * - AnalyzeSceneBackgroundOutput - The return type for the analyzeSceneBackground function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSceneBackgroundInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a scene background, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSceneBackgroundInput = z.infer<typeof AnalyzeSceneBackgroundInputSchema>;

const AnalyzeSceneBackgroundOutputSchema = z.object({
  sceneDescription: z.string().describe('A detailed description of the scene environment, including lighting, colors, objects, and atmosphere.'),
});
export type AnalyzeSceneBackgroundOutput = z.infer<typeof AnalyzeSceneBackgroundOutputSchema>;

export async function analyzeSceneBackground(input: AnalyzeSceneBackgroundInput): Promise<AnalyzeSceneBackgroundOutput> {
  return analyzeSceneBackgroundFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSceneBackgroundPrompt',
  input: {schema: AnalyzeSceneBackgroundInputSchema},
  output: {schema: AnalyzeSceneBackgroundOutputSchema},
  prompt: `You are an expert in cinematic scene description. Analyze the provided image and generate a detailed description of the scene's environment. Focus on the following elements:

- Lighting: Is it natural or artificial? Bright or dim? What is the mood it creates?
- Colors: What are the dominant colors? Is the palette warm or cold?
- Objects: What are the key objects in the scene? Describe their placement and condition.
- Atmosphere: What is the overall feeling or mood of the scene? (e.g., cozy, tense, futuristic, etc.)

Provide a comprehensive description based on the image below. The description should be in Portuguese.

Image: {{media url=photoDataUri}}`,
});

const analyzeSceneBackgroundFlow = ai.defineFlow(
  {
    name: 'analyzeSceneBackgroundFlow',
    inputSchema: AnalyzeSceneBackgroundInputSchema,
    outputSchema: AnalyzeSceneBackgroundOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
