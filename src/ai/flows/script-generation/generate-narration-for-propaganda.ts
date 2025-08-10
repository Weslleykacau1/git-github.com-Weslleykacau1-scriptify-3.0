
'use server';

/**
 * @fileOverview Generates a compelling narration for a commercial based on product details and a desired tone.
 *
 * - generateNarrationForPropaganda - The function that generates the narration.
 * - GenerateNarrationForPropagandaInput - The input type for the function.
 * - GenerateNarrationForPropagandaOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateNarrationForPropagandaInputSchema = z.object({
  productName: z.string().describe('The name of the product or service.'),
  mainMessage: z.string().describe('The core message or main benefit of the product.'),
  tone: z.string().describe('The desired tone for the narration (e.g., "Divertido", "Sério", "Emocional").'),
});
export type GenerateNarrationForPropagandaInput = z.infer<typeof GenerateNarrationForPropagandaInputSchema>;

const GenerateNarrationForPropagandaOutputSchema = z.object({
  narration: z.string().describe('The generated narration script in Brazilian Portuguese.'),
});
export type GenerateNarrationForPropagandaOutput = z.infer<typeof GenerateNarrationForPropagandaOutputSchema>;

export async function generateNarrationForPropaganda(input: GenerateNarrationForPropagandaInput): Promise<GenerateNarrationForPropagandaOutput> {
  return generateNarrationForPropagandaFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateNarrationForPropagandaPrompt',
  input: {schema: GenerateNarrationForPropagandaInputSchema},
  output: {schema: GenerateNarrationForPropagandaOutputSchema},
  prompt: `Você é um roteirista de comerciais e especialista em copywriting. Sua tarefa é criar uma narração curta e impactante para um comercial com aproximadamente 8 segundos de duração.

Dados do Produto:
- Nome: {{{productName}}}
- Mensagem Principal: {{{mainMessage}}}
- Tom Desejado: {{{tone}}}

Gere uma narração persuasiva e criativa em português do Brasil que se alinhe perfeitamente com o tom solicitado e venda o produto de forma eficaz dentro do tempo estipulado.
`,
});

const generateNarrationForPropagandaFlow = ai.defineFlow(
  {
    name: 'generateNarrationForPropagandaFlow',
    inputSchema: GenerateNarrationForPropagandaInputSchema,
    outputSchema: GenerateNarrationForPropagandaOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
