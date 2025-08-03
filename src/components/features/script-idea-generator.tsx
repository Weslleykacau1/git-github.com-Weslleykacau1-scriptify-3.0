// src/components/features/script-idea-generator.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil, Image as ImageIcon, Rocket, Wand2 } from 'lucide-react';
import { generateScriptIdeas } from '@/ai/flows/generate-script-ideas';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FileUploader } from '../ui/file-uploader';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function ScriptIdeaGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [image, setImage] = useState<string | null>(null);

  const handleGenerate = () => {
    setIsLoading(true);
    toast({ title: 'Gerando roteiro viral...' });
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: 'Roteiro gerado com sucesso!' });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex items-center gap-3">
        <Pencil className="h-6 w-6 text-primary" />
        <div>
            <h2 className="text-xl font-bold font-headline">Gerador de Roteiro Viral</h2>
            <p className="text-sm text-muted-foreground">
                Escreva um tema, escolha as opções e clique para criar um roteiro. A imagem de referência é opcional. O resultado será guardado na sua galeria.
            </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Imagem de Inspiração (Opcional)</Label>
        <FileUploader onFileChange={setImage} file={image} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="viral-theme">Tema do Roteiro Viral</Label>
        <Input id="viral-theme" placeholder="Ex: Situação inesperada cozinhando" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="duration">Duração</Label>
          <Select defaultValue="8">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="8">8 seg</SelectItem>
              <SelectItem value="15">15 seg</SelectItem>
              <SelectItem value="30">30 seg</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Tipo de Vídeo</Label>
          <RadioGroup defaultValue="shorts" className="flex items-center space-x-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="shorts" id="shorts" />
              <Label htmlFor="shorts" className="font-normal">Shorts</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="watch" id="watch" />
              <Label htmlFor="watch" className="font-normal">Watch</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="cta">Call to Action (CTA)</Label>
        <Select defaultValue="follow">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="follow">Siga para mais!</SelectItem>
              <SelectItem value="comment">Comente abaixo!</SelectItem>
              <SelectItem value="share">Compartilhe com um amigo!</SelectItem>
            </SelectContent>
          </Select>
      </div>

      <Button onClick={handleGenerate} disabled={isLoading} size="lg" className="w-full">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
        Gerar Roteiro Mega Viral
      </Button>

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
