// src/ai/flows/generate-media-prompts.ts
'use server';

/**
 * @fileOverview Gera prompts de imagem e vídeo a partir de parâmetros de cena usando IA.
 *
 * - generateMediaPrompts - Uma função que gera prompts de imagem e vídeo.
 * - GenerateMediaPromptsInput - O tipo de entrada para a função generateMediaPrompts.
 * - GenerateMediaPromptsOutput - O tipo de retorno para a função generateMediaPrompts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMediaPromptsInputSchema = z.object({
  sceneTitle: z.string().describe('O título da cena.'),
  sceneSetting: z.string().describe('Uma descrição do cenário da cena.'),
  sceneAction: z.string().describe('Uma descrição da ação principal na cena.'),
  cameraAngle: z.string().describe('O ângulo da câmera para a cena.'),
  videoDuration: z.string().describe('A duração do vídeo.'),
  productDetails: z.string().optional().describe('Detalhes de quaisquer produtos apresentados na cena.'),
});
export type GenerateMediaPromptsInput = z.infer<typeof GenerateMediaPromptsInputSchema>;

const GenerateMediaPromptsOutputSchema = z.object({
  imagePrompt: z.string().describe('Um prompt para gerar uma imagem da cena.'),
  videoPrompt: z.string().describe('Um prompt para gerar um vídeo da cena.'),
  seoKeywords: z.string().describe('Palavras-chave de SEO relacionadas à cena.'),
  thumbnailIdeas: z.string().describe('Ideias para criar uma miniatura para a cena.'),
});
export type GenerateMediaPromptsOutput = z.infer<typeof GenerateMediaPromptsOutputSchema>;

export async function generateMediaPrompts(input: GenerateMediaPromptsInput): Promise<GenerateMediaPromptsOutput> {
  return generateMediaPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMediaPromptsPrompt',
  input: {schema: GenerateMediaPromptsInputSchema},
  output: {schema: GenerateMediaPromptsOutputSchema},
  prompt: `Você é um assistente criativo que ajuda criadores de conteúdo a gerar prompts de mídia e informações de SEO para suas cenas.

  Com base nos seguintes parâmetros de cena, gere um prompt de imagem, um prompt de vídeo, palavras-chave de SEO e ideias de miniaturas.

  Título da Cena: {{{sceneTitle}}}
  Cenário da Cena: {{{sceneSetting}}}
  Ação da Cena: {{{sceneAction}}}
  Ângulo da Câmera: {{{cameraAngle}}}
  Duração do Vídeo: {{{videoDuration}}}
  Detalhes do Produto: {{{productDetails}}}

  Certifique-se de que os prompts de imagem e vídeo sejam detalhados e descritivos, adequados para uso com modelos de geração de imagem e vídeo de IA. Os prompts de imagem e vídeo devem ser em português.

  As palavras-chave de SEO devem ser relevantes para a cena e otimizadas para YouTube e TikTok.
  As ideias de miniaturas devem ser envolventes e dignas de clique.

  Toda a saída deve ser em português.
  `,
});

const generateMediaPromptsFlow = ai.defineFlow(
  {
    name: 'generateMediaPromptsFlow',
    inputSchema: GenerateMediaPromptsInputSchema,
    outputSchema: GenerateMediaPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
