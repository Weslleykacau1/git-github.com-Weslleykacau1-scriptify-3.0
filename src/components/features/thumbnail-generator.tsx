
// src/components/features/thumbnail-generator.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image as ImageIcon, Sparkles, Loader2, Camera, Film, Copy, Download } from 'lucide-react';
import { generateThumbnailIdeas, GenerateThumbnailIdeasOutput } from '@/ai/flows/media-generation/generate-thumbnail-ideas';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ThumbnailGenerator() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [style, setStyle] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateThumbnailIdeasOutput | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!mainImage || !theme) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, carregue la imagem principal e defina um tema.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    toast({ title: 'Gerando ideias para thumbnail...', description: 'A IA está a trabalhar. Isto pode demorar um pouco.' });
    try {
      const generatedResult = await generateThumbnailIdeas({
        mainImageUri: mainImage,
        backgroundImageUri: backgroundImage || undefined,
        theme,
        style,
      });
      setResult(generatedResult);
      toast({ title: 'Ideias de thumbnail geradas com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao gerar ideias',
        description: 'Ocorreu um erro ao comunicar com a IA.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Texto copiado!' });
  };
  
  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `thumbnail_${theme.replace(/\s/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full w-full">
      <div className="flex flex-col space-y-4">
        <div className='flex items-center gap-3'>
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Passo 1: Imagem de Referência</h3>
            <p className="text-sm text-muted-foreground">Anexe imagens e digite um tema para gerar ideias.</p>
          </div>
        </div>
        
        <div className="space-y-2">
            <Label className="flex items-center gap-2"><Camera className="h-4 w-4" /> Imagem Principal</Label>
            <FileUploader onFileChange={setMainImage} file={mainImage} />
        </div>

        <div className="space-y-2">
            <Label className="flex items-center gap-2"><Film className="h-4 w-4" /> Imagem de Fundo (Opcional)</Label>
            <FileUploader onFileChange={setBackgroundImage} file={backgroundImage} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Tema para Thumbnail</Label>
          <Input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex: Minha rotina de skincare..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Estilo da Thumbnail</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger id="style">
              <SelectValue placeholder="Selecione um estilo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Estilo Padrão da IA</SelectItem>
              <SelectItem value="shocked">Expressão Chocada + Fundo Caótico</SelectItem>
              <SelectItem value="half-human">Metade Humano / Metade IA ou Vilão</SelectItem>
              <SelectItem value="three-emotions">Três Emoções do Mesmo Rosto</SelectItem>
              <SelectItem value="floating">Personagem Flutuando ou Fora da Realidade</SelectItem>
              <SelectItem value="dramatic-close-up">Close no Rosto com Detalhe Dramático</SelectItem>
              <SelectItem value="mysterious-object">Segurando um Objeto Misterioso ou Dossiê</SelectItem>
              <SelectItem value="versus">Versus (Agente vs Inimigo / Empresa / Objeto)</SelectItem>
              <SelectItem value="pop-color">Fundo Pop Colorido + Texto Impactante</SelectItem>
              <SelectItem value="detective">Detetive no Escuro com Lupa / Pistas</SelectItem>
              <SelectItem value="hacker">Estilo Hacker (Capuz + Código Refletido nos Óculos)</SelectItem>
              <SelectItem value="extreme-zoom">Zoom Extremo nos Olhos / Expressão Facial</SelectItem>
              <SelectItem value="arrows-circle">Setas Vermelhas + Circulo de Destaque</SelectItem>
              <SelectItem value="before-after">Antes e Depois (divisão de tela com contraste)</SelectItem>
              <SelectItem value="frozen-action">Mini Cena de Ação Congelada (tipo filme)</SelectItem>
              <SelectItem value="neon-lighting">Iluminação Neon (Cyberpunk / Tech Vibe)</SelectItem>
              <SelectItem value="mysterious-silhouette">Silhueta Misteriosa com "Quem é?"</SelectItem>
              <SelectItem value="giant-text">Texto Gigante Coberto por Emojis / Censurado</SelectItem>
              <SelectItem value="explosion-background">Explosão no Fundo com Personagem Central Calmo</SelectItem>
              <SelectItem value="fire-ice">Rosto em Chamas / Gelo (efeitos extremos)</SelectItem>
              <SelectItem value="movie-poster">Thumbnail Estilo Cartaz de Filme / Série</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Deixe a IA decidir o melhor estilo com base no conteúdo.</p>
        </div>

        <Button onClick={handleGenerate} disabled={isLoading} className="mt-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Gerar Ideias para Thumbnail
        </Button>
      </div>

      {/* Step 2: Thumbnail Result */}
      <div className="flex flex-col space-y-4">
        <h3 className="font-semibold text-lg">Passo 2: Resultado da Thumbnail</h3>
        <p className="text-sm text-muted-foreground">Aqui estão as sugestões da IA.</p>
        <div className="flex-grow border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-card p-4 min-h-[300px]">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!isLoading && !result && <p className="text-muted-foreground text-center">Aguardando a geração de ideias...</p>}
          {result && (
            <div className="w-full space-y-4">
                 <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Ideias de Texto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <p><strong>Título:</strong> {result.title} <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(result.title)}><Copy className="h-4 w-4"/></Button></p>
                        <p><strong>Texto Sobreposto:</strong> {result.overlayText} <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(result.overlayText)}><Copy className="h-4 w-4"/></Button></p>
                        <p><strong>Emoji:</strong> {result.emoji}</p>
                    </CardContent>
                </Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Image src={result.thumbnailImage1Uri} alt="Thumbnail 1" width={512} height={288} className="rounded-lg object-cover" />
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownload(result.thumbnailImage1Uri)}><Download className="mr-2 h-4 w-4"/>Baixar Variação 1</Button>
                    </div>
                    <div className="space-y-2">
                        <Image src={result.thumbnailImage2Uri} alt="Thumbnail 2" width={512} height={288} className="rounded-lg object-cover" />
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownload(result.thumbnailImage2Uri)}><Download className="mr-2 h-4 w-4"/>Baixar Variação 2</Button>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
