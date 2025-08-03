// src/components/features/advanced-scripting-tools.tsx
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LongScriptGenerator } from './long-script-generator';
import { MediaPromptGenerator } from './media-prompt-generator';
import { WebDocGenerator } from './web-doc-generator';

export function AdvancedScriptingTools() {
  return (
    <Tabs defaultValue="long-script" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="long-script">Roteiro Longo</TabsTrigger>
        <TabsTrigger value="web-doc">Web Documentário</TabsTrigger>
        <TabsTrigger value="script-analyzer">Analisador de Roteiro</TabsTrigger>
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
