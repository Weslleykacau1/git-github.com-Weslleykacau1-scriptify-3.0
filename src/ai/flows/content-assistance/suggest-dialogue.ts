'use server';

/**
 * @fileOverview Gera um diálogo para uma cena com base na personalidade do personagem e no contexto da cena.
 *
 * - suggestDialogue - A função que gera a sugestão de diálogo.
 * - SuggestDialogueInput - O tipo de entrada para a função.
 * - SuggestDialogueOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDialogueInputSchema = z.object({
  characterPersonality: z.string().describe('Os traços de personalidade do personagem.'),
  sceneDescription: z.string().describe('A descrição do cenário.'),
  sceneAction: z.string().describe('A ação principal que o personagem está a realizar.'),
});
export type SuggestDialogueInput = z.infer<typeof SuggestDialogueInputSchema>;

const SuggestDialogueOutputSchema = z.object({
  dialogue: z.string().describe('Uma linha de diálogo (em português do Brasil) que o personagem diria nesta situação.'),
});
export type SuggestDialogueOutput = z.infer<typeof SuggestDialogueOutputSchema>;

export async function suggestDialogue(input: SuggestDialogueInput): Promise<SuggestDialogueOutput> {
  return suggestDialogueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDialoguePrompt',
  input: {schema: SuggestDialogueInputSchema},
  output: {schema: SuggestDialogueOutputSchema},
  prompt: `Você é um roteirista de diálogos. Crie uma linha de diálogo autêntica e curta para o personagem, considerando sua personalidade e o que está acontecendo na cena. O diálogo deve ser em português do Brasil.

Personalidade do Personagem:
{{{characterPersonality}}}

Cenário:
{{{sceneDescription}}}

Ação Principal:
{{{sceneAction}}}

Diálogo Sugerido:`,
});

const suggestDialogueFlow = ai.defineFlow(
  {
    name: 'suggestDialogueFlow',
    inputSchema: SuggestDialogueInputSchema,
    outputSchema: SuggestDialogueOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
