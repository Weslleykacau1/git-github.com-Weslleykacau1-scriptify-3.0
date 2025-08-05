
// src/components/features/media-prompt-generator.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileInput, Image as ImageIcon, Video, Copy, Download, Search, Film, Eye, Wand2 } from 'lucide-react';
import { generateMediaPrompts, GenerateMediaPromptsOutput } from '@/ai/flows/generate-media-prompts';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { generateThumbnailPromptFromIdeas } from '@/ai/flows/media-generation/generate-thumbnail-prompt-from-ideas';
import { SeoPreviewDialog } from './seo-preview-dialog';
import { generateSeoMetadata, GenerateSeoMetadataOutput } from '@/ai/flows/content-assistance/generate-seo-metadata';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { generateImage } from '@/ai/flows/media-generation/generate-image';


const formSchema = z.object({
  script: z.string().min(1, 'O roteiro é obrigatório.'),
});

type FormData = z.infer<typeof formSchema>;


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


export function MediaPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateMediaPromptsOutput | null>(null);
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  const [seoData, setSeoData] = useState<GenerateSeoMetadataOutput | null>(null);
  const isMobile = useIsMobile();
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);
  
  const [isThumbnailPromptDialogOpen, setIsThumbnailPromptDialogOpen] = useState(false);
  const [thumbnailPrompt, setThumbnailPrompt] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const generatedResult = await generateMediaPrompts(values);
      setResult(generatedResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao analisar roteiro',
        description: 'Ocorreu um erro ao gerar os prompts e ideias.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${type} copiado para a área de transferência!` });
  };
  
  const handleExport = () => {
    if (!result) return;
    
    let textContent = `Palavras-chave de SEO: ${result.seoKeywords}\n\n`;
    textContent += `Ideias para Thumbnail: ${result.thumbnailIdeas}\n\n`;
    textContent += '---\n\n';

    result.scenes.forEach((scene, index) => {
      textContent += `Cena ${index + 1}: ${scene.sceneTitle}\n`;
      textContent += `Roteiro (PT-BR):\n${scene.script}\n\n`;
      textContent += `Prompt de Imagem (EN):\n${scene.imagePrompt}\n\n`;
      textContent += `Prompt de Vídeo (EN):\n${scene.videoPrompt}\n\n`;
      textContent += '---\n\n';
    });


    const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(textContent);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `analise_roteiro.txt`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Análise exportada como TXT!" });
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
            topic: result.scenes[0]?.sceneTitle || 'Roteiro Analisado',
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
              <FileInput className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="m-0 text-xl font-bold font-headline">Analisador de Roteiro Existente</CardTitle>
            </div>
          </div>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="script"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cole um roteiro pronto para que a IA extraia prompts de imagem e vídeo para cada cena, além de gerar SEO e ideias de thumbnail.</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Cole o seu roteiro aqui..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analisar Roteiro e Gerar
            </Button>
          </form>
        </Form>
        {isLoading && (
          <div className="mt-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {result && (
          <div className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className='text-lg'>Prompts Gerados por Cena</CardTitle>
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
                            <span>Roteiro (PT-BR)</span>
                          </div>
                          <Button variant="ghost" size={isMobile ? "icon" : "sm"} onClick={() => handleCopy(scene.script, 'Roteiro')}>
                            <Copy className="h-4 w-4" />
                            {!isMobile && <span className="ml-2">Copiar</span>}
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{scene.script}</p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <div className="flex items-center gap-2">
                              <ImageIcon className="h-4 w-4 text-primary" />
                              <span>Prompt de Imagem (EN)</span>
                            </div>
                             <div className="flex items-center">
                                <Button variant="ghost" size={isMobile ? "icon" : "sm"} onClick={() => handleCopy(scene.imagePrompt, 'Prompt de Imagem')}>
                                  <Copy className="h-4 w-4" />
                                  {!isMobile && <span className="ml-2">Copiar</span>}
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
                            <Button variant="ghost" size={isMobile ? "icon" : "sm"} onClick={() => handleCopy(scene.videoPrompt, 'Prompt de Vídeo')}>
                              <Copy className="h-4 w-4" />
                              {!isMobile && <span className="ml-2">Copiar</span>}
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
                    {isGenerating === 'thumbnail' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4"/>}
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
      </Card>
    </>
  );
}

    