
// src/components/features/thumbnail-generator.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image as ImageIcon, Sparkles, Loader2, Camera, Film, Copy, Download, Tag, Hash, FileText, Type } from 'lucide-react';
import { generateThumbnailIdeas, GenerateThumbnailIdeasOutput } from '@/ai/flows/media-generation/generate-thumbnail-ideas';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';

export function ThumbnailGenerator() {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [theme, setTheme] = useState('');
  const [style, setStyle] = useState('default');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
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
        aspectRatio,
      });
      setResult(generatedResult);
      toast({ title: 'Ideias de thumbnail e SEO geradas com sucesso!' });
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
  
  const handleCopy = (text: string | undefined, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: `${fieldName} copiado para a área de transferência!` });
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full w-full">
      <div className="flex flex-col space-y-4">
        <div className='flex items-center gap-3'>
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <ImageIcon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Gerador de Thumbnails e SEO</h2>
            <p className="text-sm text-muted-foreground">Anexe imagens, defina um tema e gere ideias.</p>
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
          <Label htmlFor="theme">Tema para Thumbnail e SEO</Label>
          <Input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} placeholder="Ex: Minha rotina de skincare..." />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>
             <div className="space-y-2">
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={(v) => setAspectRatio(v as any)}>
                    <SelectTrigger id="aspectRatio">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="16:9">16:9 (Horizontal)</SelectItem>
                        <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
        
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Melhorias de Qualidade</h3>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="hyper-realism-thumb" className='font-medium'>Hiper-realismo</Label>
                        <p className="text-xs text-muted-foreground">Vídeos com aparência realista e detalhes impressionantes.</p>
                    </div>
                    <Switch id="hyper-realism-thumb" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="4k-thumb" className='font-medium'>4K</Label>
                        <p className="text-xs text-muted-foreground">Qualidade ultra nítida em altíssima resolução.</p>
                    </div>
                    <Switch id="4k-thumb" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="professional-camera-thumb" className='font-medium'>Câmera Profissional</Label>
                        <p className="text-xs text-muted-foreground">Movimentos e enquadramentos cinematográficos.</p>
                    </div>
                    <Switch id="professional-camera-thumb" />
                </div>
            </div>
        </div>


        <Button onClick={handleGenerate} disabled={isLoading} className="mt-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Gerar Ideias e SEO
        </Button>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold font-headline">Resultados Gerados</h2>
        <div className="flex-grow border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-card p-4 min-h-[400px]">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!isLoading && !result && <p className="text-muted-foreground text-center">Aguardando a geração de ideias...</p>}
          {result && (
            <div className="w-full space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Thumbnails</CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                          <div className="space-y-2">
                              <p className="text-sm"><strong>Texto:</strong> {result.overlayText} {result.emoji}</p>
                              <Image src={result.thumbnailImage1Uri} alt="Thumbnail 1" width={512} height={288} className="rounded-lg object-cover" />
                              <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownload(result.thumbnailImage1Uri)}><Download className="mr-2 h-4 w-4"/>Baixar Variação 1</Button>
                          </div>
                          <div className="space-y-2">
                              <Image src={result.thumbnailImage2Uri} alt="Thumbnail 2" width={512} height={288} className="rounded-lg object-cover" />
                              <Button variant="outline" size="sm" className="w-full" onClick={() => handleDownload(result.thumbnailImage2Uri)}><Download className="mr-2 h-4 w-4"/>Baixar Variação 2</Button>
                          </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Metadados de SEO</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                          <div className="space-y-1">
                              <Label htmlFor="youtube-title" className="flex items-center gap-2 text-xs"><Type className="h-3 w-3" /> Título do Vídeo</Label>
                              <div className="flex items-start gap-1">
                                <Textarea id="youtube-title" readOnly value={result.youtubeTitle} className="bg-muted text-xs h-16" />
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(result.youtubeTitle, 'Título')}><Copy className="h-4 w-4" /></Button>
                              </div>
                          </div>
                           <div className="space-y-1">
                              <Label htmlFor="youtube-desc" className="flex items-center gap-2 text-xs"><FileText className="h-3 w-3" /> Descrição</Label>
                              <div className="flex items-start gap-1">
                                <Textarea id="youtube-desc" readOnly value={result.youtubeDescription} className="bg-muted text-xs h-24" />
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(result.youtubeDescription, 'Descrição')}><Copy className="h-4 w-4" /></Button>
                              </div>
                          </div>
                           <div className="space-y-1">
                              <Label htmlFor="youtube-hashtags" className="flex items-center gap-2 text-xs"><Hash className="h-3 w-3" /> Hashtags</Label>
                              <div className="flex items-start gap-1">
                                <Input id="youtube-hashtags" readOnly value={result.hashtags} className="bg-muted text-xs" />
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(result.hashtags, 'Hashtags')}><Copy className="h-4 w-4" /></Button>
                              </div>
                          </div>
                           <div className="space-y-1">
                              <Label htmlFor="youtube-tags" className="flex items-center gap-2 text-xs"><Tag className="h-3 w-3" /> Tags</Label>
                              <div className="flex items-start gap-1">
                                <Textarea id="youtube-tags" readOnly value={result.tags} className="bg-muted text-xs h-20" />
                                <Button variant="ghost" size="icon" onClick={() => handleCopy(result.tags, 'Tags')}><Copy className="h-4 w-4" /></Button>
                              </div>
                          </div>
                      </CardContent>
                    </Card>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
