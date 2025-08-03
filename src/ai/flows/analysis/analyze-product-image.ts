'use server';

/**
 * @fileOverview An AI agent that examines a product image and extracts its name, brand, and a detailed description.
 *
 * - analyzeProductImage - A function that handles the product image analysis.
 * - AnalyzeProductImageInput - The input type for the analyzeProductImage function.
 * - AnalyzeProductImageOutput - The return type for the analyzeProductImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeProductImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeProductImageInput = z.infer<typeof AnalyzeProductImageInputSchema>;

const AnalyzeProductImageOutputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  brand: z.string().describe('The brand of the product.'),
  description: z.string().describe('A detailed description of the product.'),
});
export type AnalyzeProductImageOutput = z.infer<typeof AnalyzeProductImageOutputSchema>;

export async function analyzeProductImage(input: AnalyzeProductImageInput): Promise<AnalyzeProductImageOutput> {
  return analyzeProductImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeProductImagePrompt',
  input: {schema: AnalyzeProductImageInputSchema},
  output: {schema: AnalyzeProductImageOutputSchema},
  prompt: `Você é um especialista em análise de produtos. Analise a imagem fornecida e extraia as seguintes informações com o máximo de detalhes e fidelidade:

- Nome do Produto: O nome comercial exato do produto.
- Marca: A marca que fabrica o produto.
- Descrição: Uma descrição extremamente detalhada e fiel do produto. Descreva todas as características visíveis, como materiais, texturas, cores, padrões, dimensões aparentes e quaisquer funcionalidades ou usos potenciais que possam ser inferidos da imagem.

A saída deve ser em português.

Imagem: {{media url=photoDataUri}}`,
});

const analyzeProductImageFlow = ai.defineFlow(
  {
    name: 'analyzeProductImageFlow',
    inputSchema: AnalyzeProductImageInputSchema,
    outputSchema: AnalyzeProductImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
