'use server';
/**
 * @fileOverview Sugere um título para uma cena com base na sua descrição e ação.
 *
 * - suggestTitle - A função que gera a sugestão de título.
 * - SuggestTitleInput - O tipo de entrada para a função.
 * - SuggestTitleOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTitleInputSchema = z.object({
  sceneDescription: z.string().describe('A descrição do cenário.'),
  sceneAction: z.string().describe('A ação principal da cena.'),
});
export type SuggestTitleInput = z.infer<typeof SuggestTitleInputSchema>;

const SuggestTitleOutputSchema = z.object({
  title: z.string().describe('Um título curto e criativo para a cena.'),
});
export type SuggestTitleOutput = z.infer<typeof SuggestTitleOutputSchema>;

export async function suggestTitle(input: SuggestTitleInput): Promise<SuggestTitleOutput> {
  return suggestTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTitlePrompt',
  input: {schema: SuggestTitleInputSchema},
  output: {schema: SuggestTitleOutputSchema},
  prompt: `Você é um especialista em títulos criativos. Crie um título curto e impactante para a cena descrita abaixo.

Cenário:
{{sceneDescription}}

Ação:
{{sceneAction}}

Sugestão de Título:`,
});

const suggestTitleFlow = ai.defineFlow(
  {
    name: 'suggestTitleFlow',
    inputSchema: SuggestTitleInputSchema,
    outputSchema: SuggestTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
