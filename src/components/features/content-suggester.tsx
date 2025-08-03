// src/components/features/content-suggester.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { generateScriptIdeas } from '@/ai/flows/generate-script-ideas';
import { generateJsonScript } from '@/ai/flows/script-generation/generate-json-script';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';

interface ContentSuggesterProps {
  characterProfile: string;
  sceneDescription: string;
}

export function ContentSuggester({ characterProfile, sceneDescription }: ContentSuggesterProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedScript, setGeneratedScript] = useState('');
  const { toast } = useToast();

  const handleGenerate = async (format: 'markdown' | 'json') => {
    if (!characterProfile || !sceneDescription) {
        toast({ title: 'Erro', description: 'Por favor, preencha o perfil do influenciador e a descrição da cena.', variant: 'destructive' });
        return;
    }

    setIsLoading(true);
    setGeneratedScript('');
    toast({
      title: 'Gerando roteiro...',
      description: `O roteiro está sendo gerado em formato ${format}.`,
    });
    
    try {
        if (format === 'markdown') {
            const result = await generateScriptIdeas({ characterProfile, sceneDescription });
            setGeneratedScript(result.scriptIdea);
        } else {
            const result = await generateJsonScript({ characterProfile, sceneDescription });
            setGeneratedScript(JSON.stringify(result, null, 2));
        }
        toast({
            title: 'Roteiro Gerado!',
            description: 'Seu roteiro foi gerado com sucesso.',
        });
    } catch (error) {
        console.error(error);
        toast({
            title: 'Erro ao gerar roteiro',
            description: 'Ocorreu um erro ao gerar o roteiro.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold font-headline">3. Gere o Roteiro Detalhado</h2>
      </div>
      <p className="text-muted-foreground">
        Use o influenciador e a cena definidos para gerar um roteiro detalhado para um vídeo.
      </p>

      <div className="flex flex-col space-y-4 flex-grow justify-center">
        <Button onClick={() => handleGenerate('markdown')} disabled={isLoading} size="lg" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold text-lg">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4"/>}
          Gerar Roteiro (Markdown)
        </Button>
        <Button onClick={() => handleGenerate('json')} disabled={isLoading} variant="ghost" className="text-lg">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="font-mono mr-2">{'{ }'}</span>
          )}
          Gerar Roteiro (JSON)
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <p>A IA está a criar o seu roteiro...</p>
        </div>
      )}

      {generatedScript && (
        <Card>
            <CardHeader>
                <CardTitle>Roteiro Gerado</CardTitle>
            </CardHeader>
            <CardContent>
                <Textarea value={generatedScript} readOnly className="min-h-[200px] bg-muted font-code" />
            </CardContent>
        </Card>
      )}

      <Alert>
        <AlertDescription className="text-xs text-center">
          Para gerar, é preciso carregar ou guardar um influenciador e preencher o campo 'Cenário' na cena.
        </AlertDescription>
      </Alert>
    </div>
  );
}
