'use server';

/**
 * @fileOverview Um agente de IA gerador de perfil de personagem que analisa uma imagem ou texto e preenche os detalhes do personagem.
 *
 * - generateCharacterProfile - Uma função que lida com o processo de geração de perfil de personagem.
 * - GenerateCharacterProfileInput - O tipo de entrada para a função generateCharacterProfile.
 * - GenerateCharacterProfileOutput - O tipo de retorno para a função generateCharacterProfile.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCharacterProfileInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "Uma foto de um personagem, como um data URI que deve incluir um tipo MIME e usar codificação Base64. Formato esperado: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  textDescription: z
    .string()
    .optional()
    .describe('Uma descrição em texto do personagem.'),
});
export type GenerateCharacterProfileInput = z.infer<typeof GenerateCharacterProfileInputSchema>;

const GenerateCharacterProfileOutputSchema = z.object({
  name: z.string().describe('O nome do personagem.'),
  niche: z.string().describe('O nicho do personagem.'),
  personality: z.string().describe('A personalidade do personagem.'),
  physicalAppearance: z.string().describe('A aparência física do personagem.'),
  clothingStyle: z.string().describe('O estilo de roupa do personagem.'),
  biography: z.string().describe('Uma pequena biografia do personagem.'),
  uniqueTraits: z.string().describe('Traços únicos do personagem.'),
  accent: z.string().describe('O sotaque do personagem (em português do Brasil).'),
  age: z.string().describe('A idade do personagem.'),
  gender: z.string().describe('O gênero do personagem.'),
  generationSeed: z.string().describe('Uma seed de geração numérica aleatória.'),
  negativePrompt: z.string().optional().describe('Um prompt negativo do que deve ser evitado.'),
});
export type GenerateCharacterProfileOutput = z.infer<typeof GenerateCharacterProfileOutputSchema>;

export async function generateCharacterProfile(input: GenerateCharacterProfileInput): Promise<GenerateCharacterProfileOutput> {
  return generateCharacterProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCharacterProfilePrompt',
  input: {schema: GenerateCharacterProfileInputSchema},
  output: {schema: GenerateCharacterProfileOutputSchema},
  prompt: `Você é um gerador de perfil de personagem de IA. Você analisará a imagem ou o texto do personagem e extrairá as seguintes informações para preencher o perfil do personagem:

- Nome: O nome do personagem.
- Nicho: O nicho do personagem.
- Personalidade: A personalidade do personagem.
- Aparência Física: A aparência física do personagem.
- Estilo de Roupa: O estilo de roupa do personagem.
- Biografia: Uma pequena biografia do personagem.
- Traços Únicos: Traços únicos do personagem.
- Sotaque: O sotaque do personagem (em português do Brasil).
- Idade: A idade do personagem.
- Gênero: O gênero do personagem.
- Seed de Geração: Gere uma seed de geração numérica aleatória de 6 dígitos.
- Prompt Negativo: Opcional, o que deve ser evitado na geração.

Analise a imagem ou texto a seguir para extrair as informações acima:

{{#if photoDataUri}}
Imagem: {{media url=photoDataUri}}
{{/if}}
{{#if textDescription}}
Descrição em Texto: {{{textDescription}}}
{{/if}}

Certifique-se de produzir todos os campos em português.`,
});

const generateCharacterProfileFlow = ai.defineFlow(
  {
    name: 'generateCharacterProfileFlow',
    inputSchema: GenerateCharacterProfileInputSchema,
    outputSchema: GenerateCharacterProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
