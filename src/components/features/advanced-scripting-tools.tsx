// src/components/features/advanced-scripting-tools.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LongScriptGenerator } from './long-script-generator';
import { MediaPromptGenerator } from './media-prompt-generator';
import { WebDocGenerator } from './web-doc-generator';
import { BookOpen, FileInput, Film } from 'lucide-react';

export function AdvancedScriptingTools() {
  return (
    <div className="flex flex-col h-full w-full">
        <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h2 className="text-xl font-bold font-headline">Ferramentas de Roteiro Avançadas</h2>
                <p className="text-sm text-muted-foreground">
                Gere roteiros longos, para web docs, e transforme roteiros prontos em prompts de imagem e video.
                </p>
            </div>
        </div>
        <Tabs defaultValue="long-script" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="long-script">
            <BookOpen className="mr-2 h-4 w-4" />
            Roteiro Longo
            </TabsTrigger>
            <TabsTrigger value="web-doc">
            <Film className="mr-2 h-4 w-4" />
            Web Documentário
            </TabsTrigger>
            <TabsTrigger value="script-analyzer">
            <FileInput className="mr-2 h-4 w-4" />
            Analisador de Roteiro
            </TabsTrigger>
        </TabsList>
        <TabsContent value="long-script">
            <LongScriptGenerator />
        </TabsContent>
        <TabsContent value="web-doc">
            <WebDocGenerator />
        </TabsContent>
        <TabsContent value="script-analyzer">
            <MediaPromptGenerator />
        </TabsContent>
        </Tabs>
    </div>
  );
}
