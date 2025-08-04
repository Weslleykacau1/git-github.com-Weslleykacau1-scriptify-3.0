
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LongScriptGenerator } from './long-script-generator';
import { MediaPromptGenerator } from './media-prompt-generator';
import { WebDocGenerator } from './web-doc-generator';
import { BookOpen, FileInput, Film, Zap } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export function AdvancedScriptingTools() {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full w-full">
        <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
                <h2 className="text-xl font-bold font-headline">Ferramentas de Roteiro Avançadas</h2>
                <p className="text-sm text-muted-foreground">
                  Gere roteiros longos, web docs, e analise roteiros prontos.
                </p>
            </div>
        </div>
        <Tabs defaultValue="long-script" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 mb-4 h-auto md:h-10">
            <TabsTrigger value="long-script" className="py-2 md:py-1.5">
              <BookOpen className="mr-2 h-4 w-4" />
              {isMobile ? "Longo" : "Roteiro Longo"}
            </TabsTrigger>
            <TabsTrigger value="web-doc" className="py-2 md:py-1.5">
              <Film className="mr-2 h-4 w-4" />
              Web Doc
            </TabsTrigger>
            <TabsTrigger value="script-analyzer" className="py-2 md:py-1.5">
              <FileInput className="mr-2 h-4 w-4" />
              {isMobile ? "Analisar" : "Analisador de Roteiro"}
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
