// src/components/features/web-doc-generator.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Pencil, List, Clock, Info, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateWebDocScript, GenerateWebDocScriptOutput } from '@/ai/flows/script-generation/generate-web-doc-script';
import { Textarea } from '../ui/textarea';

export function WebDocGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [topicsToCover, setTopicsToCover] = useState('');
  const [duration, setDuration] = useState(5);
  const [generatedScript, setGeneratedScript] = useState<GenerateWebDocScriptOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic) {
        toast({ title: 'O tema é obrigatório', variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    setGeneratedScript(null);
    toast({ title: 'Gerando roteiro de Web Doc...' });
    try {
      const result = await generateWebDocScript({
        topic,
        topicsToCover: topicsToCover || undefined,
        duration,
      });
      setGeneratedScript(result);
      toast({ title: 'Roteiro de Web Doc gerado com sucesso!' });
    } catch (error) {
      console.error('Failed to generate web doc script:', error);
      toast({ title: 'Erro ao gerar roteiro', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-primary" />
          <CardTitle className="m-0 text-xl font-bold font-headline">Gerador de Roteiro para Web Doc</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Como usar o Gerador de Roteiro para Web Doc</AlertTitle>
          <AlertDescription>
            Esta ferramenta cria um roteiro completo para um documentário, cena por cena. Para cada cena, a IA gera a narração em português e um "prompt" de imagem em inglês. Use este prompt em geradores de imagem (como Midjourney ou DALL-E) para criar os visuais que acompanharão a narração, produzindo um storyboard completo.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Tema do Documentário</Label>
          <Input 
            placeholder="Ex: A ascensão dos impérios digitais, Os segredos do oceano profundo..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><List className="h-4 w-4" /> Tópicos a Cobrir (Opcional)</Label>
          <Input 
            placeholder="Ex: A origem da internet, As primeiras redes sociais, O futuro da conexão..." 
            value={topicsToCover}
            onChange={(e) => setTopicsToCover(e.target.value)}
          />
           <p className="text-xs text-muted-foreground">Separe os tópicos com vírgulas.</p>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Duração do Vídeo</Label>
          <Select value={String(duration)} onValueChange={(v) => setDuration(parseInt(v))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutos</SelectItem>
              <SelectItem value="10">10 minutos</SelectItem>
              <SelectItem value="15">15 minutos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="px-0 mt-4 flex-col items-stretch gap-4">
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
          Gerar Roteiro de Web Doc
        </Button>
        {generatedScript && (
             <div className="space-y-2 w-full">
                <Label>Roteiro Gerado (JSON)</Label>
                <Textarea 
                    value={JSON.stringify(generatedScript, null, 2)} 
                    readOnly 
                    className="min-h-[250px] bg-muted font-mono text-xs" 
                />
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
