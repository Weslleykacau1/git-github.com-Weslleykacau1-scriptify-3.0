
'use server';

/**
 * @fileOverview An AI agent that analyzes a block of text and extracts key details for a commercial.
 *
 * - analyzePropagandaText - A function that handles the text analysis for propaganda.
 * - AnalyzePropagandaTextInput - The input type for the function.
 * - AnalyzePropagandaTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TONES = [
  'Sério', 'Emocional', 'Divertido', 'Criativo', 'Didático',
  'Motivacional', 'Luxuoso', 'Tecnológico', 'Confiável',
  'Natural', 'Urgente', 'Calmo', 'Jovem / Cool'
] as const;

const AnalyzePropagandaTextInputSchema = z.object({
  textDescription: z.string().describe('A block of text describing the commercial or campaign.'),
});
export type AnalyzePropagandaTextInput = z.infer<typeof AnalyzePropagandaTextInputSchema>;

const AnalyzePropagandaTextOutputSchema = z.object({
  productName: z.string().describe('The name of the product or service.'),
  targetAudience: z.string().describe('The target audience for the commercial.'),
  mainMessage: z.string().describe('The core message or main benefit of the product.'),
  sceneFocus: z.string().optional().describe('The main focus of the scene.'),
  tone: z.enum(TONES).describe('The desired tone for the commercial.'),
  narration: z.string().optional().describe('A suggested narration script based on the text.'),
});
export type AnalyzePropagandaTextOutput = z.infer<typeof AnalyzePropagandaTextOutputSchema>;

export async function analyzePropagandaText(input: AnalyzePropagandaTextInput): Promise<AnalyzePropagandaTextOutput> {
  return analyzePropagandaTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePropagandaTextPrompt',
  input: {schema: AnalyzePropagandaTextInputSchema},
  output: {schema: AnalyzePropagandaTextOutputSchema},
  prompt: `You are an expert advertising campaign analyst. Analyze the provided text and extract the following information to structure a commercial. The output must be in Brazilian Portuguese.

- **Nome do Produto/Serviço:** Identify the product or service being advertised.
- **Público-Alvo:** Determine the target audience for the campaign.
- **Mensagem Principal:** Extract the core message or main benefit.
- **Foco Principal da Cena:** Infer the main visual or narrative focus for a scene.
- **Tom:** Select the most appropriate tone from the available options. The tone should match the overall feeling of the text.
- **Narração:** Suggest a short narration script based on the text.

Available Tones: ${TONES.join(', ')}

Analyze the following text:
{{{textDescription}}}
`,
});

const analyzePropagandaTextFlow = ai.defineFlow(
  {
    name: 'analyzePropagandaTextFlow',
    inputSchema: AnalyzePropagandaTextInputSchema,
    outputSchema: AnalyzePropagandaTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
