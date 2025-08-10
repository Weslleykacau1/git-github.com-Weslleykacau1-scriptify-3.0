
'use server';

/**
 * @fileOverview Generates a concise commercial script in JSON format, limited to 1000 characters, suitable for Google Vids.
 *
 * - generateGoogleVidsScript - A function that generates the JSON script.
 * - GenerateGoogleVidsScriptInput - The input type for the function.
 * - GenerateGoogleVidsScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGoogleVidsScriptInputSchema = z.object({
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
  videoStyle: z.string().optional().describe('The desired video style (e.g., "cinematic", "fast_cut_energetic").'),
  narration: z.string().optional().describe('An optional narration script to base the ad on.'),
  imagePrompt: z.string().optional().describe("An optional reference image for the ad's visual style, as a data URI."),
  allowsDigitalText: z.boolean().optional().describe('Whether digital text is allowed on screen.'),
  onlyPhysicalText: z.boolean().optional().describe('Whether only physical text is allowed on screen.'),
});
export type GenerateGoogleVidsScriptInput = z.infer<typeof GenerateGoogleVidsScriptInputSchema>;

const GenerateGoogleVidsScriptOutputSchema = z.object({
  script: z.string().describe('The generated commercial script in JSON format, strictly under 1000 characters.'),
});
export type GenerateGoogleVidsScriptOutput = z.infer<typeof GenerateGoogleVidsScriptOutputSchema>;

export async function generateGoogleVidsScript(input: GenerateGoogleVidsScriptInput): Promise<GenerateGoogleVidsScriptOutput> {
  return generateGoogleVidsScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGoogleVidsScriptPrompt',
  input: {schema: GenerateGoogleVidsScriptInputSchema},
  output: {schema: GenerateGoogleVidsScriptOutputSchema},
  prompt: `You are an expert advertising screenwriter creating a commercial script for Google Vids. 
  Create a detailed script in JSON format with a total duration of approximately {{duration}}.
  
  **IMPORTANT: The entire JSON output must be less than 1000 characters long.** Be concise and direct.

**Product/Service Details:**
- Name: {{productName}}
- Target Audience: {{targetAudience}}
- Main Message: {{mainMessage}}
- Desired Tone: {{tone}}

{{#if sceneFocus}}
- Scene Focus: "{{sceneFocus}}"
{{/if}}

{{#if videoStyle}}
- Video Style: "{{videoStyle}}" - This should heavily influence the camera, editing, and visual effects descriptions.
{{/if}}

{{#if narration}}
- Base Narration: "{{narration}}"
{{/if}}

{{#if imagePrompt}}
- Reference Image: {{media url=imagePrompt}}
{{/if}}

**Text Control:**
- Allows Digital Text on Screen: {{#if allowsDigitalText}}Yes{{else}}No{{/if}}
- Only Physical Text on Screen: {{#if onlyPhysicalText}}Yes{{else}}No{{/if}}

- The 'dialogue' field must be in Brazilian Portuguese. All other descriptive fields must be in English.
- The final output must be a single, valid JSON object and nothing else.
`,
});

const generateGoogleVidsScriptFlow = ai.defineFlow(
  {
    name: 'generateGoogleVidsScriptFlow',
    inputSchema: GenerateGoogleVidsScriptInputSchema,
    outputSchema: GenerateGoogleVidsScriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output || !output.script) {
        throw new Error('Failed to generate script.');
    }
     if (output.script.length > 1000) {
      // This is a fallback, the prompt should handle it, but just in case.
      console.warn('Generated script is over 1000 characters, attempting to shorten...');
      // A simple truncation, not ideal but better than failing.
      output.script = output.script.substring(0, 995) + '...}'; 
    }
    return { script: output.script };
  }
);
