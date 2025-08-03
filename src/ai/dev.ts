'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analysis/analyze-character-image';
import '@/ai/flows/analysis/analyze-text-profile';
import '@/ai/flows/analysis/analyze-scene-background';
import '@/ai/flows/analysis/analyze-product-image';

import '@/ai/flows/script-generation/generate-script-ideas';
import '@/ai/flows/script-generation/generate-long-script';
import '@/ai/flows/script-generation/generate-web-doc-script';
import '@/ai/flows/script-generation/generate-viral-script';
import '@/ai/flows/script-generation/generate-json-script';

import '@/ai/flows/content-assistance/suggest-content';

import '@/ai/flows/media-generation/generate-media-prompts';
import '@/ai/flows/media-generation/generate-thumbnail-ideas';
