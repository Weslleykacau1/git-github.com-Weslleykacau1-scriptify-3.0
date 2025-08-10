
'use server';

/**
 * @fileOverview Generates a commercial script in JSON format based on the AIDA formula.
 *
 * - generatePropagandaJsonScript - A function that generates the JSON script.
 * - GeneratePropagandaJsonScriptInput - The input type for the function.
 * - GeneratePropagandaJsonScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SceneSchema = z.object({
  time: z.string().describe('The time range for the scene, e.g., "0-3s".'),
  visual: z.string().describe('A detailed visual description for the scene in English.'),
  audio: z.string().describe('A detailed audio description for the scene in English (music, SFX).'),
});

const GeneratePropagandaJsonScriptInputSchema = z.object({
  productName: z.string().describe('The name of the product or service.'),
  targetAudience: z.string().describe('The target audience for the commercial.'),
  mainMessage: z.string().describe('The core message or main benefit of the product.'),
  tone: z.enum([
      'Sério', 'Emocional', 'Divertido', 'Criativo', 'Didático', 
      'Motivacional', 'Luxuoso', 'Tecnológico', 'Confiável', 
      'Natural', 'Urgente', 'Calmo', 'Jovem / Cool'
  ]).describe('The desired tone for the commercial.'),
  duration: z.enum(['5s', '8s']).describe('The total duration of the commercial.'),
  narration: z.string().optional().describe('An optional narration script to base the ad on.'),
  imagePrompt: z.string().optional().describe("An optional reference image for the ad's visual style, as a data URI."),
});
export type GeneratePropagandaJsonScriptInput = z.infer<typeof GeneratePropagandaJsonScriptInputSchema>;

const GeneratePropagandaJsonScriptOutputSchema = z.object({
  title: z.string().describe('The title of the commercial.'),
  script: z.object({
    attention: SceneSchema.describe('AIDA - Attention: Grab attention in the first seconds.'),
    interest: SceneSchema.describe('AIDA - Interest: Show the direct benefit.'),
    desire: SceneSchema.describe('AIDA - Desire: Create desire (e.g., transformation, emotion).'),
    action: SceneSchema.describe('AIDA - Action: Clear call-to-action.'),
  }),
});
export type GeneratePropagandaJsonScriptOutput = z.infer<typeof GeneratePropagandaJsonScriptOutputSchema>;

export async function generatePropagandaJsonScript(input: GeneratePropagandaJsonScriptInput): Promise<GeneratePropagandaJsonScriptOutput> {
  return generatePropagandaJsonScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropagandaJsonScriptPrompt',
  input: {schema: GeneratePropagandaJsonScriptInputSchema},
  output: {schema: GeneratePropagandaJsonScriptOutputSchema},
  prompt: `You are an expert advertising screenwriter. Create a detailed commercial script in JSON format with a total duration of {{duration}}.

The script must be structured using the AIDA formula:
- Attention (A): Grab attention in the first 3 seconds.
- Interest (I): Show the direct benefit of the product.
- Desire (D): Generate desire (e.g., show transformation, use testimonials, evoke emotion).
- Action (A): Provide a clear call-to-action (e.g., buy, click, learn more).

**Product/Service Details:**
- Name: {{productName}}
- Target Audience: {{targetAudience}}
- Main Message: {{mainMessage}}
- Desired Tone: {{tone}}

{{#if narration}}
- Base Narration (use this as the primary guide for the dialogue): "{{narration}}"
{{/if}}

{{#if imagePrompt}}
- Reference Image (use for visual inspiration): {{media url=imagePrompt}}
{{/if}}

The final output must be in JSON. All visual and audio descriptions must be in English. The narration, if generated, must be in Brazilian Portuguese. Ensure the timing for each section is appropriate for the total {{duration}}.
`,
});

const generatePropagandaJsonScriptFlow = ai.defineFlow(
  {
    name: 'generatePropagandaJsonScriptFlow',
    inputSchema: GeneratePropagandaJsonScriptInputSchema,
    outputSchema: GeneratePropagandaJsonScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
