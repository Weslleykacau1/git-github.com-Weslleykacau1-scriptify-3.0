// src/components/features/script-idea-generator.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil, Image as ImageIcon, Rocket, Wand2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FileUploader } from '../ui/file-uploader';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { generateViralScript } from '@/ai/flows/script-generation/generate-viral-script';

export function ScriptIdeaGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [duration, setDuration] = useState<'8s' | '15s' | '30s'>('8s');
  const [videoType, setVideoType] = useState<'Shorts' | 'Watch'>('Shorts');
  const [cta, setCta] = useState('Siga para mais!');
  const [generatedScript, setGeneratedScript] = useState('');
  
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!theme) {
        toast({ title: 'Erro', description: 'Por favor, insira um tema para o roteiro.', variant: 'destructive' });
        return;
    }
    setIsLoading(true);
    setGeneratedScript('');
    toast({ title: 'Gerando roteiro viral...' });
    
    try {
        const result = await generateViralScript({
            theme,
            duration,
            videoType,
            cta,
            imagePrompt: image || undefined,
        });
        setGeneratedScript(result.script);
        toast({ title: 'Roteiro gerado com sucesso!' });
    } catch (error) {
        console.error("Failed to generate viral script", error);
        toast({ title: 'Erro ao gerar roteiro', description: 'Ocorreu um erro ao comunicar com a IA.', variant: 'destructive' });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Pencil className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h2 className="text-xl font-bold font-headline">Gerador de Roteiro Viral</h2>
            <p className="text-sm text-muted-foreground">
                Escreva um tema, escolha as opções e clique para criar um roteiro. A imagem de referência é opcional.
            </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Imagem de Inspiração (Opcional)</Label>
        <FileUploader onFileChange={setImage} file={image} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="viral-theme">Tema do Roteiro Viral</Label>
        <Input id="viral-theme" placeholder="Ex: Situação inesperada cozinhando" value={theme} onChange={(e) => setTheme(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="duration">Duração</Label>
          <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8s">8 seg</SelectItem>
              <SelectItem value="15s">15 seg</SelectItem>
              <SelectItem value="30s">30 seg</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Tipo de Vídeo</Label>
          <RadioGroup value={videoType} onValueChange={(v) => setVideoType(v as any)} className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Shorts" id="shorts" />
              <Label htmlFor="shorts" className="font-normal">Shorts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Watch" id="watch" />
              <Label htmlFor="watch" className="font-normal">Watch</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="cta">Call to Action (CTA)</Label>
        <Select value={cta} onValueChange={setCta}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Siga para mais!">Siga para mais!</SelectItem>
              <SelectItem value="Comente abaixo!">Comente abaixo!</SelectItem>
              <SelectItem value="Compartilhe com um amigo!">Compartilhe com um amigo!</SelectItem>
            </SelectContent>
          </Select>
      </div>

      <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
        Gerar Roteiro Mega Viral
      </Button>

        {generatedScript && (
            <div className='space-y-2'>
                <Label>Roteiro Gerado (Markdown)</Label>
                <Textarea readOnly value={generatedScript} className='min-h-[200px] bg-muted' />
            </div>
        )}

      <Alert>
        <Wand2 className="h-4 w-4" />
        <AlertTitle>O que é a "Fórmula Mega Viral"?</AlertTitle>
        <AlertDescription className="text-xs space-y-1 mt-2">
            <p>Ao gerar um roteiro de "Shorts", a IA é instruída a seguir uma estrutura com alto potencial de viralização, dividida nestas partes:</p>
            <ul className="list-disc pl-4">
                <li><span className="font-semibold">Set up:</span> Uma frase inicial que cria o contexto.</li>
                <li><span className="font-semibold">Hook:</span> Uma ação inesperada que prende a atenção.</li>
                <li><span className="font-semibold">Escalation:</span> O desenvolvimento da ação.</li>
                <li><span className="font-semibold">Climax/Punchline:</span> O ponto alto ou a piada final.</li>
                <li><span className="font-semibold">CTA:</span> Uma chamada para ação (ex: "Siga para mais!").</li>
            </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
}
