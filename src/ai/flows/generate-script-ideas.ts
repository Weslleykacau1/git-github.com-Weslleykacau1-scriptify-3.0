'use server';

/**
 * @fileOverview Um gerador de ideias de roteiro que combina um personagem e uma cena para produzir conteúdo criativo.
 *
 * - generateScriptIdeas - Uma função que gera ideias de roteiro.
 * - GenerateScriptIdeasInput - O tipo de entrada para a função generateScriptIdeas.
 * - GenerateScriptIdeasOutput - O tipo de retorno para a função generateScriptIdeas.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateScriptIdeasInputSchema = z.object({
  characterProfile: z
    .string()
    .describe('Uma descrição detalhada do personagem, incluindo nome, nicho, personalidade, aparência e história de fundo.'),
  sceneDescription: z
    .string()
    .describe('Uma descrição detalhada da cena, incluindo cenário, ação e clima.'),
});
export type GenerateScriptIdeasInput = z.infer<typeof GenerateScriptIdeasInputSchema>;

const GenerateScriptIdeasOutputSchema = z.object({
  scriptIdea: z.string().describe('Uma ideia de roteiro criativa combinando o personagem e a cena.'),
});
export type GenerateScriptIdeasOutput = z.infer<typeof GenerateScriptIdeasOutputSchema>;

export async function generateScriptIdeas(input: GenerateScriptIdeasInput): Promise<GenerateScriptIdeasOutput> {
  return generateScriptIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScriptIdeasPrompt',
  input: {schema: GenerateScriptIdeasInputSchema},
  output: {schema: GenerateScriptIdeasOutputSchema},
  prompt: `Você é um roteirista criativo. Gere uma ideia de roteiro com base nas descrições de personagem e cena fornecidas. A saída deve ser em português.

Perfil do Personagem:
{{characterProfile}}

Descrição da Cena:
{{sceneDescription}}

Ideia de Roteiro:`,
});

const generateScriptIdeasFlow = ai.defineFlow(
  {
    name: 'generateScriptIdeasFlow',
    inputSchema: GenerateScriptIdeasInputSchema,
    outputSchema: GenerateScriptIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
