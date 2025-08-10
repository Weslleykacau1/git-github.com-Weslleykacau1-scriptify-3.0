
'use server';

/**
 * @fileOverview Generates a detailed, cinematic "Super Prompt" for a commercial in a structured JSON format.
 *
 * - generateSuperPrompt - A function that generates the super prompt.
 * - GenerateSuperPromptInput - The input type for the function.
 * - GenerateSuperPromptOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSuperPromptInputSchema = z.object({
  productName: z.string().describe('The name of the product or service.'),
  mainMessage: z.string().describe('The core message or main benefit of the product.'),
  tone: z.string().describe('The desired tone for the commercial (e.g., "Cinematic", "Minimalist Surrealism").'),
  narration: z.string().optional().describe('An optional narration script in Brazilian Portuguese to be used as the text_overlay.'),
});
export type GenerateSuperPromptInput = z.infer<typeof GenerateSuperPromptInputSchema>;

const GenerateSuperPromptOutputSchema = z.object({
    description: z.string().describe("A detailed narrative of the visual sequence."),
    style: z.string().describe("The overall visual style."),
    camera: z.string().describe("Camera movement and type."),
    lighting: z.string().describe("Lighting setup."),
    environment: z.string().describe("The setting."),
    elements: z.array(z.string()).describe("Key visual components."),
    motion: z.string().describe("The sequence of movements."),
    ending: z.string().describe("The final shot."),
    audio: z.object({
        music: z.string().describe("Music description."),
        sfx: z.string().describe("Sound effects description."),
    }),
    text_overlay: z.string().describe("Any text to be displayed."),
    format: z.enum(['16:9', '9:16', '1:1']),
    keywords: z.array(z.string()).describe("SEO-style keywords for the concept."),
});
export type GenerateSuperPromptOutput = z.infer<typeof GenerateSuperPromptOutputSchema>;

export async function generateSuperPrompt(input: GenerateSuperPromptInput): Promise<GenerateSuperPromptOutput> {
  return generateSuperPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSuperPromptPrompt',
  input: {schema: GenerateSuperPromptInputSchema},
  output: {schema: GenerateSuperPromptOutputSchema},
  prompt: `You are an expert creative director for high-end commercials. Your task is to generate a detailed "Super Prompt" in JSON format for a product commercial.
The prompt should be inspired by the following example structure for Coca-Cola, but adapted for the user's product.

**User's Product Details:**
- Product Name: {{{productName}}}
- Main Message: {{{mainMessage}}}
- Desired Tone: {{{tone}}}
{{#if narration}}
- Base Narration: "{{narration}}". Use this exact text for the 'text_overlay' field.
{{/if}}

**Example Structure to follow:**
{
  "description": "Cinematic close-up opens on a glowing horizontal red energy wave pulsing against a black void. The wave ripples with soft fizzing textures and microscopic bubbles. As the camera gently pulls back, the red wave curves and stretches, gradually revealing the shape of a classic Coca-Cola bottle formed entirely from glowing condensation lines and fizz trails. The silhouette is suspended mid-air, hyper-stylized but instantly recognizable. Suddenly, a stream of rich amber Coca-Cola pours from above, seamlessly filling the outline from bottom to top. The glowing fizz dissipates, revealing a fully rendered glass Coca-Cola bottle, cold and glistening with condensation. Subtle mist gathers at the base. No text.",
  "style": "cinematic, minimalist surrealism with crave realism",
  "camera": "close macro start, smooth dolly pullback to centered bottle reveal",
  "lighting": "black void with glowing red energy, internal light from bottle fizz, soft rim lights and condensation glow",
  "environment": "pure black stage with subtle reflective ground plane and ambient mist",
  "elements": [
    "glowing red horizontal fizz wave",
    "microbubbles and energy ripple texture",
    "Coca-Cola bottle outline forming from wave",
    "amber Coke stream pouring into fizz form",
    "bottle taking solid form from top-down",
    "realistic condensation and chill fog",
    "classic Coca-Cola bottle (glass, embossed logo, proper shape)"
  ],
  "motion": "energy wave pulses and curves into outline; Coke pours in; fizz dissolves into physical bottle; condensation builds",
  "ending": "fully formed Coca-Cola bottle centered on screen, glowing softly and fogged with chill, perfectly craveable",
  "audio": {
    "music": "subtle ambient pulse with rising fizz tones",
    "sfx": "micro fizz crackle, wave hum, Coke pour splash, chill hiss"
  },
  "text_overlay": "none",
  "format": "16:9",
  "keywords": [
    "Coca-Cola",
    "bottle reveal",
    "energy silhouette",
    "fizz-driven animation",
    "crave aesthetic",
    "macro realism",
    "minimalist surreal",
    "cold drink focus",
    "photoreal cinematic",
    "no text"
  ]
}

Now, generate a new Super Prompt for the user's product, following the same detailed, structured JSON format.
**Language instructions:**
- **All descriptive fields must be in ENGLISH.** This includes: description, style, camera, lighting, environment, elements, motion, ending, audio.music, audio.sfx, and keywords.
- **Only the 'text_overlay' field must be in BRAZILIAN PORTUGUESE.** This field contains the narration or on-screen text for the ad. If a base narration is provided, use it for this field.
Be extremely creative and visual in your descriptions.
`,
});


const generateSuperPromptFlow = ai.defineFlow(
  {
    name: 'generateSuperPromptFlow',
    inputSchema: GenerateSuperPromptInputSchema,
    outputSchema: GenerateSuperPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
