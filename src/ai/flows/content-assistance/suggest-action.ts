'use server';

/**
 * @fileOverview Sugere a ação principal para uma cena com base na sua descrição.
 *
 * - suggestAction - A função que gera a sugestão de ação.
 * - SuggestActionInput - O tipo de entrada para a função.
 * - SuggestActionOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionInputSchema = z.object({
  sceneDescription: z.string().describe('A descrição detalhada do cenário (ambiente, iluminação, objetos).'),
});
export type SuggestActionInput = z.infer<typeof SuggestActionInputSchema>;

const SuggestActionOutputSchema = z.object({
  action: z.string().describe('A sugestão de ação principal que o personagem deve realizar na cena.'),
});
export type SuggestActionOutput = z.infer<typeof SuggestActionOutputSchema>;

export async function suggestAction(input: SuggestActionInput): Promise<SuggestActionOutput> {
  return suggestActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionPrompt',
  input: {schema: SuggestActionInputSchema},
  output: {schema: SuggestActionOutputSchema},
  prompt: `Você é um diretor de cena criativo. Com base na descrição do cenário, sugira uma ação principal interessante para o personagem realizar. A ação deve ser concisa e direta.

Cenário:
{{{sceneDescription}}}

Sugestão de Ação Principal:`,
});

const suggestActionFlow = ai.defineFlow(
  {
    name: 'suggestActionFlow',
    inputSchema: SuggestActionInputSchema,
    outputSchema: SuggestActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
