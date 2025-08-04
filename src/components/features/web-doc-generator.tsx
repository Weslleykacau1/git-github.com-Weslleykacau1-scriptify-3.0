'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Pencil, List, Clock, Info, Loader2, Copy, Video, Image as ImageIcon, FileInput, Download, Search, Film } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateWebDocScript, GenerateWebDocScriptOutput } from '@/ai/flows/script-generation/generate-web-doc-script';
import { generateImage } from '@/ai/flows/media-generation/generate-image';
import { ImagePreviewDialog } from './image-preview-dialog';


export function WebDocGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [topicsToCover, setTopicsToCover] = useState('');
  const [duration, setDuration] = useState(5);
  const [result, setResult] = useState<GenerateWebDocScriptOutput | null>(null);
  const { toast } = useToast();

  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);
  const [generatedImageData, setGeneratedImageData] = useState<{ url: string; prompt: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
        toast({ title: 'O tema é obrigatório', variant: 'destructive'});
        return;
    }
    setIsLoading(true);
    setResult(null);
    toast({ title: 'Gerando roteiro de Web Doc...' });
    try {
      const result = await generateWebDocScript({
        topic,
        topicsToCover: topicsToCover || undefined,
        duration,
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
    setIsGeneratingImage(String(index));
    try {
      const { imageDataUri } = await generateImage({ prompt });
      setGeneratedImageData({ url: imageDataUri, prompt });
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Image generation failed', error);
      toast({ title: 'Erro ao gerar imagem', variant: 'destructive' });
    } finally {
      setIsGeneratingImage(null);
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
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        imageData={generatedImageData}
      />
      <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="px-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
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
              placeholder="Ex: A ascensão dos impérios digitais, Os segredos do oceano profundo..." 
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><List className="h-4 w-4" /> Tópicos a Cobrir (Opcional)</Label>
            <Input 
              placeholder="Ex: A origem da internet, As primeiras redes sociais, O futuro da conexão..." 
              value={topicsToCover}
              onChange={(e) => setTopicsToCover(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Separe os tópicos com vírgulas.</p>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Duração do Roteiro</Label>
            <Select value={String(duration)} onValueChange={(v) => setDuration(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 minutos</SelectItem>
                <SelectItem value="10">10 minutos</SelectItem>
                <SelectItem value="15">15 minutos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading} className="w-full pt-4">
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
                                                  <span>Narração (PT-BR)</span>
                                              </div>
                                              <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.narration, 'Narração')}>
                                                  <Copy className="mr-2 h-4 w-4" />
                                                  Copiar
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
                                                  <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.imagePrompt, 'Prompt de Imagem')}>
                                                      <Copy className="mr-2 h-4 w-4" />
                                                      Copiar
                                                  </Button>
                                              </div>
                                              <p className="text-sm text-muted-foreground">{scene.imagePrompt}</p>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                                disabled={isGeneratingImage === String(index)}
                                                onClick={() => handleGenerateImage(scene.imagePrompt, index)}
                                              >
                                                {isGeneratingImage === String(index) ? (
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
                                                      Copiar
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
                              <Button variant="outline" size="sm" className='mt-2' onClick={() => handleActionClick("Gerar de acordo com a sugestão")}><Film className="mr-2 h-4 w-4"/>Gerar de acordo com a sugestão</Button>
                          </CardContent>
                      </Card>
                      <Card>
                          <CardHeader>
                              <CardTitle className='text-lg'>Palavras-chave de SEO</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">{result.seoKeywords}</p>
                              <Button variant="outline" size="sm" className='mt-2' onClick={() => handleActionClick("Otimizar para SEO")}><Search className="mr-2 h-4 w-4"/>Otimizar para SEO</Button>
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
