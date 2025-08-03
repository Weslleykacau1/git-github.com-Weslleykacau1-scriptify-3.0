'use server';

/**
 * @fileOverview Fluxo de sugestão de conteúdo com IA para títulos e diálogos de vídeo.
 *
 * - suggestContent - Uma função que sugere títulos e diálogos de vídeo com base na descrição de uma cena e no perfil de um personagem.
 * - SuggestContentInput - O tipo de entrada para a função suggestContent.
 * - SuggestContentOutput - O tipo de retorno para a função suggestContent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestContentInputSchema = z.object({
  sceneDescription: z.string().describe('A descrição da cena.'),
  characterProfile: z.string().describe('O perfil do personagem.'),
});
export type SuggestContentInput = z.infer<typeof SuggestContentInputSchema>;

const SuggestContentOutputSchema = z.object({
  videoTitles: z.array(z.string()).describe('Títulos de vídeo sugeridos.'),
  dialogues: z.array(z.string()).describe('Diálogos sugeridos.'),
});
export type SuggestContentOutput = z.infer<typeof SuggestContentOutputSchema>;

export async function suggestContent(input: SuggestContentInput): Promise<SuggestContentOutput> {
  return suggestContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestContentPrompt',
  input: {schema: SuggestContentInputSchema},
  output: {schema: SuggestContentOutputSchema},
  prompt: `Você é um estrategista de conteúdo criativo. Dada a descrição da cena e o perfil do personagem, sugira títulos de vídeo e diálogos envolventes. A saída deve ser em português.

Descrição da Cena: {{{sceneDescription}}}
Perfil do Personagem: {{{characterProfile}}}

Sugira pelo menos 3 títulos de vídeo e 3 diálogos.

Formate sua resposta como um objeto JSON com os arrays 'videoTitles' e 'dialogues'.
`, 
});

const suggestContentFlow = ai.defineFlow(
  {
    name: 'suggestContentFlow',
    inputSchema: SuggestContentInputSchema,
    outputSchema: SuggestContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
