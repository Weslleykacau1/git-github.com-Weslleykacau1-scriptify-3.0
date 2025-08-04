'use server';

/**
 * @fileOverview An AI agent that transcribes an uploaded video file.
 *
 * - transcribeUploadedVideo - A function that handles the video transcription process.
 * - TranscribeUploadedVideoInput - The input type for the function.
 * - TranscribeUploadedVideoOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeUploadedVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeUploadedVideoInput = z.infer<typeof TranscribeUploadedVideoInputSchema>;

const TranscribeUploadedVideoOutputSchema = z.object({
  transcription: z.string().describe('The full transcription of the video in Brazilian Portuguese, with timestamps.'),
});
export type TranscribeUploadedVideoOutput = z.infer<typeof TranscribeUploadedVideoOutputSchema>;

export async function transcribeUploadedVideo(input: TranscribeUploadedVideoInput): Promise<TranscribeUploadedVideoOutput> {
  return transcribeUploadedVideoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeUploadedVideoPrompt',
  input: {schema: TranscribeUploadedVideoInputSchema},
  output: {schema: TranscribeUploadedVideoOutputSchema},
  prompt: `You are a transcription expert. Your task is to transcribe the provided video.

- The transcription must be in Brazilian Portuguese. If the original audio is in another language, translate it.
- Add timestamps (e.g., [00:05]) at the beginning of significant speech segments.
- Be accurate and thorough.

Video to transcribe:
{{media url=videoDataUri}}`,
});

const transcribeUploadedVideoFlow = ai.defineFlow(
  {
    name: 'transcribeUploadedVideoFlow',
    inputSchema: TranscribeUploadedVideoInputSchema,
    outputSchema: TranscribeUploadedVideoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
