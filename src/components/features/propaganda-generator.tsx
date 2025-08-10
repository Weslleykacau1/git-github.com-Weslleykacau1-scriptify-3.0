// src/components/features/propaganda-generator.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil, Image as ImageIcon, Rocket, Wand2, Megaphone, Sparkles } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileUploader } from '../ui/file-uploader';
import { generatePropagandaScript } from '@/ai/flows/script-generation/generate-propaganda-script';
import { generatePropagandaJsonScript } from '@/ai/flows/script-generation/generate-propaganda-json-script';
import { analyzeProductImage } from '@/ai/flows/analysis/analyze-product-image';
import { generateNarrationForPropaganda } from '@/ai/flows/script-generation/generate-narration-for-propaganda';


export function PropagandaGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingNarration, setIsLoadingNarration] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [mainMessage, setMainMessage] = useState('');
  const [narration, setNarration] = useState('');
  const [tone, setTone] = useState('Criativo');
  const [duration, setDuration] = useState<'5s' | '8s'>('8s');
  const [generatedScript, setGeneratedScript] = useState('');

  const { toast } = useToast();

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleAnalyzeImage = async () => {
    if (!image) {
      toast({ title: 'Erro', description: 'Por favor, carregue uma imagem para analisar.', variant: 'destructive' });
      return;
    }
    setIsLoadingAnalysis(true);
    toast({ title: 'Analisando imagem...' });
    try {
      const result = await analyzeProductImage({ photoDataUri: image });
      setProductName(result.productName);
      setMainMessage(result.description);
      toast({ title: 'Análise concluída!', description: 'Os campos foram preenchidos com base na imagem.' });
    } catch (error) {
      console.error("Failed to analyze product image", error);
      toast({ title: 'Erro na análise', description: 'Não foi possível analisar a imagem.', variant: 'destructive' });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleGenerateNarration = async () => {
    if (!productName || !mainMessage || !tone) {
      toast({ title: 'Erro', description: 'Preencha o nome, mensagem e tom para gerar a narração.', variant: 'destructive' });
      return;
    }
    setIsLoadingNarration(true);
    toast({ title: 'Gerando narração...' });
    try {
      const result = await generateNarrationForPropaganda({
        productName: productName,
        mainMessage: mainMessage,
        tone: tone,
      });
      setNarration(result.narration);
      toast({ title: 'Narração gerada com sucesso!' });
    } catch (error) {
      console.error("Failed to generate narration", error);
      toast({ title: 'Erro ao gerar narração', variant: 'destructive' });
    } finally {
      setIsLoadingNarration(false);
    }
  };

  const handleGenerate = async (format: 'markdown' | 'json') => {
    if (!productName || !targetAudience || !mainMessage) {
      toast({ title: 'Erro', description: 'Por favor, preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setGeneratedScript('');
    toast({ title: `Gerando propaganda em ${format}...` });
    
    try {
      let script;
      if (format === 'json') {
          const result = await generatePropagandaJsonScript({
              productName,
              targetAudience,
              mainMessage,
              tone,
              duration,
              imagePrompt: image || undefined,
              narration: narration || undefined,
          });
          script = JSON.stringify(result, null, 2);
      } else {
           const result = await generatePropagandaScript({
              productName,
              targetAudience,
              mainMessage,
              tone,
              duration,
              imagePrompt: image || undefined,
              narration: narration || undefined,
          });
          script = result.script;
      }
      setGeneratedScript(script);
      toast({ title: 'Propaganda gerada com sucesso!' });
    } catch (error) {
      console.error(`Failed to generate propaganda script in ${format}`, error);
      toast({ title: 'Erro ao gerar roteiro', description: 'Ocorreu um erro ao comunicar com a IA.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h2 className="text-xl font-bold font-headline">Gerador de Propaganda</h2>
            <p className="text-sm text-muted-foreground">
                Crie roteiros para anúncios de rádio, TV ou internet.
            </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Imagem do Produto (Opcional)</Label>
        <FileUploader onFileChange={setImage} file={image} />
         {image && (
            <Button onClick={handleAnalyzeImage} disabled={isLoadingAnalysis} className="mt-2 w-full">
                {isLoadingAnalysis ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analisar Imagem
            </Button>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="product-name">Nome do Produto/Serviço</Label>
        <Input id="product-name" placeholder="Ex: Copo Térmico Stanley" value={productName} onChange={(e) => setProductName(e.target.value)} />
      </div>

       <div className="space-y-1">
        <Label htmlFor="target-audience">Público-Alvo</Label>
        <Input id="target-audience" placeholder="Ex: Jovens de 18 a 25 anos, que gostam de aventura" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
      </div>

       <div className="space-y-1">
        <Label htmlFor="main-message">Mensagem Principal</Label>
        <Textarea id="main-message" placeholder="Ex: Mantém a sua bebida gelada por 24 horas" value={mainMessage} onChange={(e) => setMainMessage(e.target.value)} />
      </div>
      
       <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label htmlFor="narration">Narração (Opcional)</Label>
           <Button variant="ghost" size="sm" onClick={handleGenerateNarration} disabled={isLoadingNarration}>
                {isLoadingNarration ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Gerar com IA
            </Button>
        </div>
        <Textarea id="narration" placeholder="Escreva a narração que você quer que a IA use como base..." value={narration} onChange={(e) => setNarration(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="tone">Tom</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Sério">Sério</SelectItem>
              <SelectItem value="Emocional">Emocional</SelectItem>
              <SelectItem value="Divertido">Divertido</SelectItem>
              <SelectItem value="Criativo">Criativo</SelectItem>
              <SelectItem value="Didático">Didático</SelectItem>
              <SelectItem value="Motivacional">Motivacional</SelectItem>
              <SelectItem value="Luxuoso">Luxuoso</SelectItem>
              <SelectItem value="Tecnológico">Tecnológico</SelectItem>
              <SelectItem value="Confiável">Confiável</SelectItem>
              <SelectItem value="Natural">Natural</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
              <SelectItem value="Calmo">Calmo</SelectItem>
              <SelectItem value="Jovem / Cool">Jovem / Cool</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="duration">Duração</Label>
          <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5s">5 seg</SelectItem>
              <SelectItem value="8s">8 seg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={() => handleGenerate('markdown')} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
            Gerar Propaganda
        </Button>
         <Button onClick={() => handleGenerate('json')} disabled={isLoading} variant="outline" className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="font-mono mr-2">{'{ }'}</span>
          )}
          Gerar em JSON
        </Button>
      </div>

      {generatedScript && (
          <div className='space-y-2'>
              <Label>Roteiro Gerado</Label>
              <Textarea readOnly value={generatedScript} className='min-h-[250px] bg-muted' />
          </div>
      )}
    </div>
  );
}
