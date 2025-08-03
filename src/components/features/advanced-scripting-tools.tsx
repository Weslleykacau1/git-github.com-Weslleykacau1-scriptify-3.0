// src/components/features/advanced-scripting-tools.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LongScriptGenerator } from './long-script-generator';
import { MediaPromptGenerator } from './media-prompt-generator';
import { WebDocGenerator } from './web-doc-generator';
import { BookOpen, FileInput, Film } from 'lucide-react';

export function AdvancedScriptingTools() {
  return (
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
  );
}
