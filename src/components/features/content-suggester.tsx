// src/components/features/content-suggester.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ContentSuggester() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (format: 'markdown' | 'json') => {
    setIsLoading(true);
    toast({
      title: 'Gerando roteiro...',
      description: `O roteiro está sendo gerado em formato ${format}.`,
    });
    // Simular chamada de API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    toast({
      title: 'Roteiro Gerado!',
      description: 'Seu roteiro foi gerado com sucesso.',
    });
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
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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

      <Alert>
        <AlertDescription className="text-xs text-center">
          Para gerar, é preciso carregar ou guardar um influenciador e preencher o campo 'Cenário' na cena.
        </AlertDescription>
      </Alert>
    </div>
  );
}
