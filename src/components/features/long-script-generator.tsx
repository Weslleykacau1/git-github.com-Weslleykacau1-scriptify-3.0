
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { FileText, User, Clapperboard, Clock, BookOpen, Loader2, Copy, Image as ImageIcon, Video, Search, Film, Download, List, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLongScript, GenerateLongScriptOutput } from '@/ai/flows/script-generation/generate-long-script';
import type { Character, Scene } from '@/lib/types';
import { generateImage } from '@/ai/flows/media-generation/generate-image';
import { ImagePreviewDialog } from './image-preview-dialog';
import { generateThumbnailFromScript } from '@/ai/flows/media-generation/generate-thumbnail-from-script';
import { SeoPreviewDialog } from './seo-preview-dialog';
import { generateSeoMetadata, GenerateSeoMetadataOutput } from '@/ai/flows/content-assistance/generate-seo-metadata';
import { Switch } from '../ui/switch';


export function LongScriptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [topic, setTopic] = useState('');
  const [numberOfScenes, setNumberOfScenes] = useState(5);
  const [result, setResult] = useState<GenerateLongScriptOutput | null>(null);
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generatedImageData, setGeneratedImageData] = useState<{ url: string; prompt: string } | null>(null);
  const [generatedImageData2, setGeneratedImageData2] = useState<{ url: string; prompt: string } | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  const [seoData, setSeoData] = useState<GenerateSeoMetadataOutput | null>(null);


  useEffect(() => {
    try {
      const storedCharacters = localStorage.getItem('fg-characters');
      if (storedCharacters) setCharacters(JSON.parse(storedCharacters));
      
      const storedScenes = localStorage.getItem('fg-scenes');
      if (storedScenes) setScenes(JSON.parse(storedScenes));
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
        toast({ title: "Erro ao carregar dados locais", variant: "destructive" });
    }
  }, [toast]);
  

  const handleGenerate = async () => {
    if (!topic) {
        toast({ title: 'O tema é obrigatório', variant: 'destructive'});
        return;
    }
    if (numberOfScenes < 1) {
        toast({ title: 'O número de cenas deve ser pelo menos 1', variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    setResult(null);
    toast({title: 'Gerando roteiro longo...'});
    try {
        const result = await generateLongScript({
            characterProfile: selectedCharacter ? JSON.stringify(selectedCharacter) : undefined,
            sceneDescription: selectedScene ? JSON.stringify(selectedScene) : undefined,
            topic,
            numberOfScenes: numberOfScenes,
        });
        setResult(result);
        toast({title: 'Roteiro gerado com sucesso!'});
    } catch (error) {
        console.error(error);
        toast({ title: 'Erro ao gerar roteiro', variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };

  const handleCharacterSelect = (charId: string) => {
    const character = characters.find(c => c.id === charId);
    setSelectedCharacter(character || null);
  }

  const handleSceneSelect = (sceneId: string) => {
    const scene = scenes.find(s => s.id === sceneId);
    setSelectedScene(scene || null);
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copiado para a área de transferência!` });
  };
  
  const handleExport = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${result.title.replace(/\s/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Roteiro exportado como JSON!" });
  };

  const handleGenerateImage = async (prompt: string, index: number) => {
    setIsGenerating(`image-${index}`);
    setGeneratedImageData(null);
    setGeneratedImageData2(null);
    try {
      const { imageDataUri } = await generateImage({ prompt, aspectRatio: '16:9' });
      setGeneratedImageData({ url: imageDataUri, prompt });
      setIsImageDialogOpen(true);
    } catch (error) {
      console.error('Image generation failed', error);
      toast({ title: 'Erro ao gerar imagem', variant: 'destructive' });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateThumbnail = async () => {
    if (!result || !result.scenes.length) return;
    setIsGenerating('thumbnail');
    setGeneratedImageData(null);
    setGeneratedImageData2(null);
    try {
      const { thumbnailImage1Uri, thumbnailImage2Uri } = await generateThumbnailFromScript({
        firstSceneImagePrompt: result.scenes[0].imagePrompt,
        thumbnailIdeas: result.thumbnailIdeas,
      });
      setGeneratedImageData({ url: thumbnailImage1Uri, prompt: 'thumbnail_variation_1' });
      setGeneratedImageData2({ url: thumbnailImage2Uri, prompt: 'thumbnail_variation_2' });
      setIsImageDialogOpen(true);
    } catch (error) {
      console.error('Thumbnail generation failed', error);
      toast({ title: 'Erro ao gerar thumbnails', variant: 'destructive' });
    } finally {
      setIsGenerating(null);
    }
  };

  const handleGenerateSeo = async () => {
    if (!result) return;
    setIsGenerating('seo');
    try {
        const seoResult = await generateSeoMetadata({
            topic: result.title,
            keywords: result.seoKeywords,
        });
        setSeoData(seoResult);
        setIsSeoDialogOpen(true);
    } catch (error) {
        console.error('SEO generation failed', error);
        toast({ title: 'Erro ao otimizar para SEO', variant: 'destructive' });
    } finally {
        setIsGenerating(null);
    }
  };

  const handleActionClick = (featureName: string) => {
    toast({
        title: "Funcionalidade em desenvolvimento",
        description: `A funcionalidade de "${featureName}" será implementada em breve!`,
    });
  };


  return (
    <>
    <ImagePreviewDialog
        isOpen={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        imageData={generatedImageData}
        imageData2={generatedImageData2}
    />
    <SeoPreviewDialog
        isOpen={isSeoDialogOpen}
        onOpenChange={setIsSeoDialogOpen}
        seoData={seoData}
    />
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="m-0 text-xl font-bold font-headline">Gerador de Roteiro de Vídeo Longo</CardTitle>
            <CardDescription>
              Crie roteiros completos para vídeos mais longos. Opcionalmente, carregue um influenciador e um cenário para dar contexto à IA.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Carregar Personagem (Opcional)</Label>
            <Select onValueChange={handleCharacterSelect} value={selectedCharacter?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um influenciador..." />
              </SelectTrigger>
              <SelectContent>
                {characters.map(char => (
                    <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Clapperboard className="h-4 w-4" /> Carregar Cenário (Opcional)</Label>
            <Select onValueChange={handleSceneSelect} value={selectedScene?.id}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cenário..." />
              </SelectTrigger>
              <SelectContent>
                 {scenes.map(scene => (
                    <SelectItem key={scene.id} value={scene.id}>{scene.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><FileText className="h-4 w-4" /> Tema do Roteiro</Label>
          <Input 
            placeholder="Ex: A história da inteligência artificial..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><List className="h-4 w-4" /> Quantidade de Cenas</Label>
          <Input 
            type="number"
            placeholder="Ex: 5"
            value={numberOfScenes}
            onChange={(e) => setNumberOfScenes(parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>
        <div className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Melhorias de Qualidade</h3>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="hyper-realism-long" className='font-medium'>Hiper-realismo</Label>
                        <p className="text-xs text-muted-foreground">Vídeos com aparência realista e detalhes impressionantes.</p>
                    </div>
                    <Switch id="hyper-realism-long" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="4k-long" className='font-medium'>4K</Label>
                        <p className="text-xs text-muted-foreground">Qualidade ultra nítida em altíssima resolução.</p>
                    </div>
                    <Switch id="4k-long" />
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="professional-camera-long" className='font-medium'>Câmera Profissional</Label>
                        <p className="text-xs text-muted-foreground">Movimentos e enquadramentos cinematográficos.</p>
                    </div>
                    <Switch id="professional-camera-long" />
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="px-0 mt-4 flex-col items-stretch gap-4">
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
          Gerar Roteiro Longo
        </Button>
        {isLoading && (
            <div className="mt-6 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {result && (
             <div className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>{result.title}</CardTitle>
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4"/>Exportar JSON</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.scenes.map((scene, index) => (
                            <div key={index} className="border bg-card p-4 rounded-lg space-y-4">
                                <h4 className="font-semibold">{scene.sceneTitle}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <div className="flex items-center gap-2">
                                              <FileText className="h-4 w-4 text-primary" />
                                              <span>Narração (PT-BR)</span>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.narration, 'Narração')}>
                                                <Copy className="mr-2 h-4 w-4" />
                                                <span className="hidden md:inline">Copiar</span>
                                            </Button>
                                        </div>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{scene.narration}</p>
                                        
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-medium">
                                                <div className="flex items-center gap-2">
                                                    <ImageIcon className="h-4 w-4 text-primary" />
                                                    <span>Prompt de Imagem (EN)</span>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.imagePrompt, 'Prompt de Imagem')}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                     <span className="hidden md:inline">Copiar</span>
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{scene.imagePrompt}</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                disabled={isGenerating === `image-${index}`}
                                                onClick={() => handleGenerateImage(scene.imagePrompt, index)}
                                            >
                                                {isGenerating === `image-${index}` ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                <ImageIcon className="mr-2 h-4 w-4" />
                                                )}
                                                Gerar Imagem
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-sm font-medium">
                                               <div className="flex items-center gap-2">
                                                  <Video className="h-4 w-4 text-primary" />
                                                  <span>Prompt de Vídeo (EN)</span>
                                               </div>
                                                <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.videoPrompt, 'Prompt de Vídeo')}>
                                                    <Copy className="mr-2 h-4 w-4" />
                                                     <span className="hidden md:inline">Copiar</span>
                                                </Button>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{scene.videoPrompt}</p>
                                            <Button variant="outline" size="sm" className="w-full" onClick={() => handleActionClick("Gerar Vídeo")}>
                                                <Video className="mr-2 h-4 w-4" />
                                                Gerar Vídeo
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Ideias para Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{result.thumbnailIdeas}</p>
                            <Button variant="outline" size="sm" className='mt-2' onClick={handleGenerateThumbnail} disabled={isGenerating === 'thumbnail'}>
                                {isGenerating === 'thumbnail' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Film className="mr-2 h-4 w-4"/>}
                                Gerar Thumbnail
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Palavras-chave de SEO</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{result.seoKeywords}</p>
                            <Button variant="outline" size="sm" className='mt-2' onClick={handleGenerateSeo} disabled={isGenerating === 'seo'}>
                                {isGenerating === 'seo' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Search className="mr-2 h-4 w-4"/>}
                                Otimizar para SEO
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}
      </CardFooter>
    </Card>
    </>
  );
}
