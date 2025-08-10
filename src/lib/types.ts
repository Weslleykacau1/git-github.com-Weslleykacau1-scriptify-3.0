// src/lib/types.ts

export interface Character {
    id: string;
    name?: string;
    niche?: string;
    personality?: string;
    physicalAppearance?: string;
    clothingStyle?: string;
    biography?: string;
    uniqueTraits?: string;
    accent?: string;
    age?: string;
    gender?: 'Masculino' | 'Feminino' | 'Não-binário';
    generationSeed?: string;
    negativePrompt?: string;
}

export interface Product {
    id?: string;
    name?: string;
    brand?: string;
    description?: string;
}

export interface Scene {
    id: string;
    title?: string;
    setting?: string;
    mainAction?: string;
    dialogue?: string;
    cameraAngle?: 'dynamic' | 'vlog' | 'selfie' | 'pov' | 'medium_shot' | 'wide_shot';
    duration?: number;
    videoFormat?: '9:16' | '16:9' | '1:1';
    allowsDigitalText?: boolean;
    onlyPhysicalText?: boolean;
    product?: Product | null;
}

export interface Propaganda {
    id: string;
    productName: string;
    targetAudience: string;
    mainMessage: string;
    sceneFocus?: string;
    talent: string;
    narration?: string;
    tone: string;
    voiceStyle: string;
    duration: '5s' | '8s';
    image: string | null;
    generatedScript: string;
    allowsDigitalText?: boolean;
    onlyPhysicalText?: boolean;
}
