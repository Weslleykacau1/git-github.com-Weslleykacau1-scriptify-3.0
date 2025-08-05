
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Pencil, List, Info, Loader2, Copy, Video, Image as ImageIcon, FileInput, Download, Search, Film, Eye, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateWebDocScript, GenerateWebDocScriptOutput } from '@/ai/flows/script-generation/generate-web-doc-script';
import { generateThumbnailPromptFromIdeas } from '@/ai/flows/media-generation/generate-thumbnail-prompt-from-ideas';
import { SeoPreviewDialog } from './seo-preview-dialog';
import { generateSeoMetadata, GenerateSeoMetadataOutput } from '@/ai/flows/content-assistance/generate-seo-metadata';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { generateImage } from '@/ai/flows/media-generation/generate-image';
import { Textarea } from '../ui/textarea';


const ThumbnailPromptDialog = ({ prompt, isOpen, onOpenChange }: { prompt: string | null; isOpen: boolean; onOpenChange: (open: boolean) => void; }) => {
    const { toast } = useToast();
    const handleCopy = () => {
        if (!prompt) return;
        navigator.clipboard.writeText(prompt);
        toast({ title: "Prompt copiado para a área de transferência!" });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Prompt de Thumbnail Gerado</DialogTitle>
                    <DialogDescription>
                        Use este prompt numa ferramenta de geração de imagem para criar a sua thumbnail.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-4">
                    <Textarea
                        readOnly
                        value={prompt || ''}
                        className="h-48 bg-muted"
                    />
                </div>
                <DialogFooter>
                    <Button onClick={handleCopy}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar Prompt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export function WebDocGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [topicsToCover, setTopicsToCover] = useState('');
  const [numberOfScenes, setNumberOfScenes] = useState(5);
  const [result, setResult] = useState<GenerateWebDocScriptOutput | null>(null);
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  const [seoData, setSeoData] = useState<GenerateSeoMetadataOutput | null>(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);
  
  const [isThumbnailPromptDialogOpen, setIsThumbnailPromptDialogOpen] = useState(false);
  const [thumbnailPrompt, setThumbnailPrompt] = useState<string | null>(null);

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
    toast({ title: 'Gerando roteiro de Web Doc...' });
    try {
      const result = await generateWebDocScript({
        topic,
        topicsToCover: topicsToCover || undefined,
        numberOfScenes: numberOfScenes,
      });
      setResult(result);
      toast({ title: 'Roteiro de Web Doc gerado com sucesso!' });
    } catch (error) {
      console.error('Failed to generate web doc script:', error);
      toast({ title: 'Erro ao gerar roteiro', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copiado para a área de transferência!` });
  };
  
  const handleExport = () => {
    if (!result) return;

    let textContent = `Título: ${result.title}\n\n`;
    textContent += `Palavras-chave de SEO: ${result.seoKeywords}\n\n`;
    textContent += `Ideias para Thumbnail: ${result.thumbnailIdeas}\n\n`;
    textContent += '---\n\n';

    result.scenes.forEach((scene, index) => {
      textContent += `Cena ${index + 1}: ${scene.sceneTitle}\n`;
      textContent += `Narração (PT-BR):\n${scene.narration}\n\n`;
      textContent += `Prompt de Imagem (EN):\n${scene.imagePrompt}\n\n`;
      textContent += `Prompt de Vídeo (EN):\n${scene.videoPrompt}\n\n`;
      textContent += '---\n\n';
    });

    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${result.title.replace(/\s/g, '_')}.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Roteiro exportado como TXT!" });
  };
  
  const handleGenerateThumbnailPrompt = async () => {
    if (!result || !result.scenes.length) return;
    setIsGenerating('thumbnail');
    try {
      const { thumbnailPrompt: prompt } = await generateThumbnailPromptFromIdeas({
        firstSceneImagePrompt: result.scenes[0].imagePrompt,
        thumbnailIdeas: result.thumbnailIdeas,
      });
      setThumbnailPrompt(prompt);
      setIsThumbnailPromptDialogOpen(true);
    } catch (error) {
      console.error('Thumbnail prompt generation failed', error);
      toast({ title: 'Erro ao gerar prompt de thumbnail', variant: 'destructive' });
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

  const handleGenerateImage = async (prompt: string, index: number) => {
    setIsGeneratingImage(`image-${index}`);
    try {
        const { imageDataUri } = await generateImage({ prompt, aspectRatio: '16:9' });
        setCurrentImage(imageDataUri);
        setIsImageModalOpen(true);
    } catch(e) {
        toast({title: 'Erro ao gerar imagem', variant: 'destructive'});
    } finally {
        setIsGeneratingImage(null);
    }
  }

  return (
    <>
      <ThumbnailPromptDialog
        prompt={thumbnailPrompt}
        isOpen={isThumbnailPromptDialogOpen}
        onOpenChange={setIsThumbnailPromptDialogOpen}
      />
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Imagem Gerada</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="relative aspect-video">
              <Image src={currentImage} alt="Imagem gerada" layout="fill" objectFit="contain" />
            </div>
          )}
        </DialogContent>
      </Dialog>
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
              <CardTitle className="m-0 text-xl font-bold font-headline">Gerador de Roteiro para Web Documentário</CardTitle>
              <CardDescription>
                  Crie um roteiro completo, cena por cena, para o seu documentário.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Como usar?</AlertTitle>
            <AlertDescription>
              Defina o tema e a IA criará o roteiro, os prompts de imagem/vídeo para cada cena, ideias de thumbnail e palavras-chave de SEO.
            </AlertDescription>
          </Alert>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Tema do Documentário</Label>
            <Input 
              placeholder="Ex: A ascensão dos impérios digitais..." 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><List className="h-4 w-4" /> Tópicos a Cobrir (Opcional)</Label>
            <Input 
              placeholder="Ex: A origem da internet, As primeiras redes sociais..." 
              value={topicsToCover}
              onChange={(e) => setTopicsToCover(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Separe os tópicos com vírgulas.</p>
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
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
            Gerar Roteiro de Web Doc
          </Button>
        </CardContent>
        <CardFooter className="px-0 mt-4 flex-col items-stretch gap-4">
          
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
                             <Button variant="outline" size="sm" onClick={handleExport}><Download className="mr-2 h-4 w-4"/>Exportar em .txt</Button>
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
                                                  <FileInput className="h-4 w-4 text-primary" />
                                                  <span>Narração (PT-BR)</span>
                                              </div>
                                              <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.narration, 'Narração')}>
                                                  <Copy className="mr-2 h-4 w-4" />
                                                  <span className="hidden md:inline">Copiar</span>
                                              </Button>
                                          </div>
                                          <p className="text-sm text-muted-foreground">{scene.narration}</p>
                                      </div>
                                      <div className="space-y-4">
                                          <div className="space-y-2">
                                               <div className="flex items-center justify-between text-sm font-medium">
                                                  <div className="flex items-center gap-2">
                                                      <ImageIcon className="h-4 w-4 text-primary" />
                                                      <span>Prompt de Imagem (EN)</span>
                                                  </div>
                                                  <div className="flex items-center">
                                                    <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.imagePrompt, 'Prompt de Imagem')}>
                                                        <Copy className="mr-2 h-4 w-4" />
                                                        <span className="hidden md:inline">Copiar</span>
                                                    </Button>
                                                  </div>
                                              </div>
                                              <p className="text-sm text-muted-foreground">{scene.imagePrompt}</p>
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
                               <Button variant="outline" size="sm" className='mt-2' onClick={handleGenerateThumbnailPrompt} disabled={isGenerating === 'thumbnail'}>
                                {isGenerating === 'thumbnail' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4 text-primary" />}
                                Gerar Prompt de Thumbnail
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

    