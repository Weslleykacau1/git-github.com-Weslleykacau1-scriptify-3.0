
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Image as ImageIcon, Sparkles, Loader2, Camera, Film, Copy, Tag, Hash, FileText, Type } from 'lucide-react';
import { generateThumbnailIdeas, GenerateThumbnailIdeasOutput } from '@/ai/flows/media-generation/generate-thumbnail-ideas';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';

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
        aspectRatio: '16:9',
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

        <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
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
        </div>

        <Button onClick={handleGenerate} disabled={isLoading} className="mt-auto">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
          Gerar Prompt e SEO
        </Button>
      </div>

      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-bold font-headline">Resultados Gerados</h2>
        <div className="flex-grow border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-card p-4 min-h-[400px] lg:min-h-0">
          {isLoading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
          {!isLoading && !result && <p className="text-muted-foreground text-center">Aguardando a geração de ideias...</p>}
          {result && (
            <Card className="w-full">
              <CardContent className="p-4 grid grid-cols-1 gap-4">
                <div className="space-y-3">
                   <h3 className="font-semibold">Prompt e Metadados de SEO</h3>
                    <div className="space-y-1">
                        <Label htmlFor="image-prompt" className="flex items-center gap-2 text-xs"><ImageIcon className="h-3 w-3" /> Prompt de Imagem (EN)</Label>
                        <div className="flex items-start gap-1">
                          <Textarea id="image-prompt" readOnly value={result.imagePrompt} className="bg-muted text-xs h-28" />
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(result.imagePrompt, 'Prompt de Imagem')}><Copy className="h-4 w-4" /></Button>
                        </div>
                    </div>
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
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
