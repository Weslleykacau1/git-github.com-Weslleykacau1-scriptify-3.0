'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { FileText, User, Clapperboard, Clock, BookOpen, Loader2, Copy, Image as ImageIcon, Video, Search, Film, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLongScript, GenerateLongScriptOutput } from '@/ai/flows/script-generation/generate-long-script';
import type { Character, Scene } from '@/lib/types';
import { generateImage } from '@/ai/flows/media-generation/generate-image';
import { ImagePreviewDialog } from './image-preview-dialog';


export function LongScriptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(5);
  const [result, setResult] = useState<GenerateLongScriptOutput | null>(null);
  const { toast } = useToast();

  // Image Generation State
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null); // scene index
  const [generatedImageData, setGeneratedImageData] = useState<{ url: string; prompt: string } | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
    setIsLoading(true);
    setResult(null);
    toast({title: 'Gerando roteiro longo...'});
    try {
        const result = await generateLongScript({
            characterProfile: selectedCharacter ? JSON.stringify(selectedCharacter) : undefined,
            sceneDescription: selectedScene ? JSON.stringify(selectedScene) : undefined,
            topic,
            duration,
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
            placeholder="Ex: A história da inteligência artificial, Um dia na vida de um programador..." 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
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
              <SelectItem value="20">20 minutos</SelectItem>
            </SelectContent>
          </Select>
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
                                                Copiar
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
