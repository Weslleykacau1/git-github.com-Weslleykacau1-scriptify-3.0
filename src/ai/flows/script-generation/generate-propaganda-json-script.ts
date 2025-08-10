
'use server';

/**
 * @fileOverview Generates a commercial script in JSON format based on the AIDA formula, compatible with Veo 3.
 *
 * - generatePropagandaJsonScript - A function that generates the JSON script.
 * - GeneratePropagandaJsonScriptInput - The input type for the function.
 * - GeneratePropagandaJsonScriptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CameraSchema = z.object({
    type: z.string().describe('The type of camera, e.g., "mirrorless_compact", "drone_or_gimbal_wide".'),
    lens: z.string().describe('The lens equivalent, e.g., "50mm_equiv", "24mm_equiv".'),
    movement: z.string().describe('The camera movement, e.g., "slow_push_in_gimbal", "arc_around_subject".'),
    notes: z.string().optional().describe('Additional notes for the camera work, e.g., "POV feel; leve handheld shake".'),
});

const TalentSchema = z.object({
    character: z.string().describe('The character in the scene, e.g., "Comediante", "Amigo".'),
    expression: z.string().describe('The character\'s expression, e.g., "surpreso/encantado", "confiante".'),
    action: z.string().describe('The character\'s action, e.g., "pega o produto e sorri para a câmera".'),
});

const SoundSchema = z.object({
    sfx: z.string().optional().describe('Sound effects for the scene, e.g., "whoosh_subtle", "impact_punch".'),
    music: z.string().describe('The music for the scene, e.g., "upbeat_intro", "build_beat".'),
    vo_level: z.string().optional().describe('Voice-over level, e.g., "clear".'),
    vo: z.string().optional().describe('A call to action or final voice over line.'),
});

const SceneSchema = z.object({
  id: z.number().describe('The scene identifier.'),
  duration: z.number().describe('The duration of the scene in seconds.'),
  frame: z.string().describe('The framing of the shot, e.g., "close_up", "medium", "wide_scene".'),
  camera: CameraSchema,
  talent: TalentSchema,
  dialogue: z.string().describe('The dialogue for the scene in Brazilian Portuguese.'),
  effects: z.array(z.string()).describe('Visual effects to be applied, e.g., ["color_grade:high_saturation", "film_grain:light"].'),
  sound: SoundSchema,
  post_notes: z.string().describe('Notes for post-production, e.g., "Adicionar kinetic_typography...".'),
});

const GeneratePropagandaJsonScriptInputSchema = z.object({
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
export type GeneratePropagandaJsonScriptInput = z.infer<typeof GeneratePropagandaJsonScriptInputSchema>;

const GeneratePropagandaJsonScriptOutputSchema = z.object({
  metadata: z.object({
      project_name: z.string().describe('A generated project name for the commercial.'),
      duration_seconds: z.number().describe('The total duration of the project in seconds.'),
      target_formats: z.array(z.string()).describe('The target formats, e.g., ["9:16", "16:9"].'),
      notes: z.string().optional().describe('General notes for the project.'),
  }),
  scenes: z.array(SceneSchema).describe('An array of scenes that make up the script.'),
});
export type GeneratePropagandaJsonScriptOutput = z.infer<typeof GeneratePropagandaJsonScriptOutputSchema>;

export async function generatePropagandaJsonScript(input: GeneratePropagandaJsonScriptInput): Promise<GeneratePropagandaJsonScriptOutput> {
  return generatePropagandaJsonScriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePropagandaJsonScriptPrompt',
  input: {schema: GeneratePropagandaJsonScriptInputSchema},
  output: {schema: GeneratePropagandaJsonScriptOutputSchema},
  prompt: `You are an expert advertising screenwriter creating a commercial script for the Veo 3 video generation model. 
  Create a detailed script in JSON format with a total duration of approximately {{duration}}.
  The script should be divided into a few scenes, and the total duration of the scenes should match the metadata's duration_seconds.

**Product/Service Details:**
- Name: {{productName}}
- Target Audience: {{targetAudience}}
- Main Message: {{mainMessage}}
- Desired Tone: {{tone}}

{{#if sceneFocus}}
- Scene Focus: "{{sceneFocus}}" - This should be the central point of the commercial's visuals and narrative. Use this as the primary guide for the 'action' and 'notes' fields.
{{/if}}

{{#if videoStyle}}
- Video Style: "{{videoStyle}}" - This is a key instruction. It should heavily influence the camera movements, editing style (e.g., 'fast_cut_energetic'), visual effects, and overall look and feel of the commercial. For example, a 'cinematic' style would imply different camera work than a 'social_media_trend' style.
{{/if}}

{{#if narration}}
- Base Narration (use this as the primary guide for the dialogue): "{{narration}}"
{{/if}}

{{#if imagePrompt}}
- Reference Image (use for visual inspiration): {{media url=imagePrompt}}
{{/if}}

**Text Control:**
- Allows Digital Text on Screen: {{#if allowsDigitalText}}Yes{{else}}No{{/if}}
- Only Physical Text on Screen: {{#if onlyPhysicalText}}Yes{{else}}No{{/if}}
- Based on these text controls, decide whether to include on-screen text overlays (like in 'post_notes' for kinetic typography) or to only describe text that is physically present in the scene.

- The final output must be in JSON, following the provided output schema precisely.
- All text fields like notes, descriptions, and prompts must be in English.
- The 'dialogue' field must be in Brazilian Portuguese.
- Be very creative and descriptive with camera movements, effects, and sound design to create a high-impact commercial.
- Generate a script that is appropriate for the total {{duration}}.
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
