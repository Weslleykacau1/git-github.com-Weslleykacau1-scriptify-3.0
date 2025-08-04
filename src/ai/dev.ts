'use server';
import { config } from 'dotenv';
config();

// Analysis
import '@/ai/flows/analysis/analyze-character-image';
import '@/ai/flows/analysis/analyze-text-profile';
import '@/ai/flows/analysis/analyze-scene-background';
import '@/ai/flows/analysis/analyze-product-image';

// Script Generation
import '@/ai/flows/script-generation/generate-script-ideas';
import '@/ai/flows/script-generation/generate-long-script';
import '@/ai/flows/script-generation/generate-web-doc-script';
import '@/ai/flows/script-generation/generate-viral-script';
import '@/ai/flows/script-generation/generate-json-script';

// Content Assistance
import '@/ai/flows/content-assistance/suggest-action';
import '@/ai/flows/content-assistance/suggest-dialogue';
import '@/ai/flows/content-assistance/suggest-title';
import '@/ai/flows/content-assistance/generate-seo-metadata';
import '@/ai/flows/content-assistance/generate-script-from-transcription';
import '@/ai/flows/content-assistance/paraphrase-script';


// Media Generation
import '@/ai/flows/generate-media-prompts';
import '@/ai/flows/media-generation/generate-thumbnail-ideas';
import '@/ai/flows/media-generation/generate-image';
import '@/ai/flows/media-generation/generate-thumbnail-from-script';

// Transcription
import '@/ai/flows/transcribe-uploaded-video';
