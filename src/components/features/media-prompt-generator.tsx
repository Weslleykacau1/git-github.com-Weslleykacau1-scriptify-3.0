
// src/components/features/media-prompt-generator.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileInput, Image as ImageIcon, Video, Copy, Download, Search, Film } from 'lucide-react';
import { generateMediaPrompts, GenerateMediaPromptsOutput } from '@/ai/flows/generate-media-prompts';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { generateThumbnailFromScript } from '@/ai/flows/media-generation/generate-thumbnail-from-script';
import { SeoPreviewDialog } from './seo-preview-dialog';
import { generateSeoMetadata, GenerateSeoMetadataOutput } from '@/ai/flows/content-assistance/generate-seo-metadata';
import { useIsMobile } from '@/hooks/use-mobile';


const formSchema = z.object({
  script: z.string().min(1, 'O roteiro é obrigatório.'),
});

type FormData = z.infer<typeof formSchema>;

export function MediaPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateMediaPromptsOutput | null>(null);
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generatedImageData, setGeneratedImageData] = useState<{ url: string; prompt: string } | null>(null);
  const [generatedImageData2, setGeneratedImageData2] = useState<{ url: string; prompt: string } | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const [isSeoDialogOpen, setIsSeoDialogOpen] = useState(false);
  const [seoData, setSeoData] = useState<GenerateSeoMetadataOutput | null>(null);
  const isMobile = useIsMobile();

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
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `analise_roteiro.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: "Análise exportada como JSON!" });
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

  const handleActionClick = (featureName: string) => {
    toast({
        title: "Funcionalidade em desenvolvimento",
        description: `A funcionalidade de "${featureName}" será implementada em breve!`,
    });
  };

  return (
    <>
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
              <CardDescription>
                Cole um roteiro pronto para que a IA extraia prompts de imagem e vídeo para cada cena, além de gerar SEO e ideias de thumbnail.
              </CardDescription>
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
                  <FormLabel>Roteiro</FormLabel>
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
                            <Button variant="ghost" size={isMobile ? "icon" : "sm"} onClick={() => handleCopy(scene.imagePrompt, 'Prompt de Imagem')}>
                              <Copy className="h-4 w-4" />
                              {!isMobile && <span className="ml-2">Copiar</span>}
                            </Button>
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
                    {isGenerating === 'thumbnail' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4"/>}
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
      </Card>
    </>
  );
}
