'use server';

/**
 * @fileOverview O fluxo principal que gera um roteiro detalhado, segundo a segundo, combinando os dados de um personagem e de uma cena.
 *
 * - generateVideoScript - A função que gera o roteiro.
 * - GenerateVideoScriptInput - O tipo de entrada para a função.
 * - GenerateVideoScriptOutput - O tipo de retorno para a função.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { Character, Scene } from '@/lib/types';


const GenerateVideoScriptInputSchema = z.object({
  character: z.custom<Character>(),
  scene: z.custom<Scene>(),
});

export type GenerateVideoScriptInput = z.infer<typeof GenerateVideoScriptInputSchema>;

const GenerateVideoScriptOutputSchema = z.object({
  script: z.string().describe('Um roteiro detalhado para um vídeo, formatado em Markdown, dividido segundo a segundo, com descrições visuais (em inglês), diálogos (em português do Brasil) e efeitos sonoros (SFX, em inglês).'),
});
export type GenerateVideoScriptOutput = z.infer<typeof GenerateVideoScriptOutputSchema>;

export async function generateVideoScript(input: GenerateVideoScriptInput): Promise<GenerateVideoScriptOutput> {
  return generateVideoScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateVideoScriptPrompt',
  input: {schema: GenerateVideoScriptInputSchema},
  output: {schema: GenerateVideoScriptOutputSchema},
  prompt: `You are a creative director and screenwriter for short-form videos. Your task is to create a detailed, second-by-second script based on the provided character and scene information. Be absolutely faithful to all provided details.

The output must be in MARKDOWN format.
The script should have a total duration of {{scene.duration}} seconds.
For each second, describe the visual action and camera work in detail. Visual descriptions and SFX must be in ENGLISH.
The character's dialogue must be in BRAZILIAN PORTUGUESE, matching their personality and the specified accent.

**Character Profile (Be Faithful):**
- Name: {{character.name}}
- Personality: {{character.personality}}
- Physical Appearance: {{character.physicalAppearance}}
- Clothing Style: {{character.clothingStyle}}
- Unique Traits: {{character.uniqueTraits}}
- Accent (for dialogue): {{character.accent}}
- Generation Seed (for visual consistency): {{character.generationSeed}}
- Negative Prompt (what to avoid in visuals): {{character.negativePrompt}}

**Scene Details (Be Faithful):**
- Title: {{scene.title}}
- Setting Description: {{scene.setting}}
- Main Action: {{scene.mainAction}}
- Dialogue: {{scene.dialogue}}
- Camera Angle: {{scene.cameraAngle}}
- Video Format: {{scene.videoFormat}}
{{#if scene.product}}
- Product to feature: {{scene.product.name}} by {{scene.product.brand}}. Description: {{scene.product.description}}
{{/if}}

Generate the script now.`,
});

const generateVideoScriptFlow = ai.defineFlow(
  {
    name: 'generateVideoScriptFlow',
    inputSchema: GenerateVideoScriptInputSchema,
    outputSchema: GenerateVideoScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
