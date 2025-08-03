'use server';

/**
 * @fileOverview Analisa um roteiro, o divide em cenas e gera prompts de imagem e vídeo para cada cena.
 *
 * - generateMediaPrompts - Uma função que analisa um roteiro e gera prompts de mídia.
 * - GenerateMediaPromptsInput - O tipo de entrada para a função generateMediaPrompts.
 * - GenerateMediaPromptsOutput - O tipo de retorno para a função generateMediaPrompts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScenePromptsSchema = z.object({
  sceneTitle: z.string().describe('O título da cena, por exemplo, "Cena 1".'),
  imagePrompt: z.string().describe('Um prompt detalhado em inglês para gerar uma imagem da cena.'),
  videoPrompt: z.string().describe('Um prompt detalhado em inglês para gerar um vídeo da cena.'),
});

const GenerateMediaPromptsInputSchema = z.object({
  script: z.string().describe('O roteiro completo a ser analisado.'),
});
export type GenerateMediaPromptsInput = z.infer<typeof GenerateMediaPromptsInputSchema>;

const GenerateMediaPromptsOutputSchema = z.object({
  scenes: z.array(ScenePromptsSchema).describe('Uma lista de prompts para cada cena identificada no roteiro.'),
  seoKeywords: z.string().describe('Palavras-chave de SEO relevantes para o roteiro como um todo.'),
  thumbnailIdeas: z.string().describe('Ideias para criar uma miniatura para o vídeo.'),
});
export type GenerateMediaPromptsOutput = z.infer<typeof GenerateMediaPromptsOutputSchema>;

export async function generateMediaPrompts(input: GenerateMediaPromptsInput): Promise<GenerateMediaPromptsOutput> {
  return generateMediaPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMediaPromptsPrompt',
  input: {schema: GenerateMediaPromptsInputSchema},
  output: {schema: GenerateMediaPromptsOutputSchema},
  prompt: `Você é um assistente criativo que ajuda criadores de conteúdo a transformar roteiros em prompts de mídia.

  Analise o seguinte roteiro. Divida-o em cenas individuais. Para cada cena, gere um prompt de imagem e um prompt de vídeo em INGLÊS. Os prompts devem ser detalhados e adequados para uso com modelos de IA de geração de imagem e vídeo.

  Além disso, gere palavras-chave de SEO relevantes para o roteiro geral e forneça algumas ideias de miniaturas (thumbnails).

  Roteiro:
  {{{script}}}

  A saída de cada prompt de imagem e vídeo deve ser em inglês. O restante da saída deve ser em português.
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
