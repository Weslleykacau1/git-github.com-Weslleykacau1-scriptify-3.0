
'use server';

/**
 * @fileOverview Generates a commercial script in Markdown format based on the AIDA formula.
 *
 * - generatePropagandaScript - A function that generates the script.
 * - GeneratePropagandaScriptInput - The input type for the function.
 * - GeneratePropagandaScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePropagandaScriptInputSchema = z.object({
  productName: z.string().describe('The name of the product or service.'),
  targetAudience: z.string().describe('The target audience for the commercial.'),
  mainMessage: z.string().describe('The core message or main benefit of the product.'),
  sceneFocus: z.string().optional().describe('The main focus of the scene.'),
  tone: z.enum([
      'Sério', 'Emocional', 'Divertido', 'Criativo', 'Didático', 
      'Motivacional', 'Luxuoso', 'Tecnológico', 'Confiável', 
      'Natural', 'Urgente', 'Calmo', 'Jovem / Cool'
  ]).describe('The desired tone for the commercial.'),
  duration: z.enum(['5s', '8s']).describe('The total duration of the commercial.'),
  narration: z.string().optional().describe('An optional narration script to base the ad on.'),
  imagePrompt: z.string().optional().describe("An optional reference image for the ad's visual style, as a data URI."),
});
export type GeneratePropagandaScriptInput = z.infer<typeof GeneratePropagandaScriptInputSchema>;

const GeneratePropagandaScriptOutputSchema = z.object({
  script: z.string().describe('The generated commercial script in Markdown format, detailing visuals, audio, and dialogue second by second, structured according to the AIDA formula.'),
});
export type GeneratePropagandaScriptOutput = z.infer<typeof GeneratePropagandaScriptOutputSchema>;

export async function generatePropagandaScript(input: GeneratePropagandaScriptInput): Promise<GeneratePropagandaScriptOutput> {
  return generatePropagandaScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropagandaScriptPrompt',
  input: {schema: GeneratePropagandaScriptInputSchema},
  output: {schema: GeneratePropagandaScriptOutputSchema},
  prompt: `You are an expert advertising screenwriter. Create a detailed commercial script in Markdown format with a total duration of {{duration}}.

The script must be structured using the AIDA formula, with timings appropriate for the {{duration}} total:
- **Attention (A):** Grab attention in the first seconds.
- **Interest (I):** Show the direct benefit of the product.
- **Desire (D):** Generate desire (e.g., show transformation, use testimonials, evoke emotion).
- **Action (A):** Provide a clear call-to-action (e.g., buy, click, learn more).

**Product/Service Details:**
- Name: {{productName}}
- Target Audience: {{targetAudience}}
- Main Message: {{mainMessage}}
- Desired Tone: {{tone}}

{{#if sceneFocus}}
- Scene Focus: "{{sceneFocus}}" - This should be the central point of the commercial's visuals and narrative.
{{/if}}

{{#if narration}}
- Base Narration (use this as the primary guide for the dialogue): "{{narration}}"
{{/if}}

{{#if imagePrompt}}
- Reference Image (use for visual inspiration): {{media url=imagePrompt}}
{{/if}}

The final output must be a Markdown script. All visual and audio descriptions must be in English. The narration must be in Brazilian Portuguese. Detail the script second-by-second.
`,
});


const generatePropagandaScriptFlow = ai.defineFlow(
  {
    name: 'generatePropagandaScriptFlow',
    inputSchema: GeneratePropagandaScriptInputSchema,
    outputSchema: GeneratePropagandaScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
