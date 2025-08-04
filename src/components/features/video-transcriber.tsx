// src/components/features/video-transcriber.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download, RefreshCw, Youtube, Video, Image as ImageIcon, FileText, Bot, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transcribeUploadedVideo } from '@/ai/flows/transcribe-uploaded-video';
import { generateScriptFromTranscription } from '@/ai/flows/content-assistance/generate-script-from-transcription';
import { paraphraseScript } from '@/ai/flows/content-assistance/paraphrase-script';
import { Textarea } from '../ui/textarea';


const FileUploadArea = ({ 
  title, 
  onFileChange,
  file,
  accept,
}: { 
  title: string; 
  onFileChange: (file: File | null) => void;
  file: File | null;
  accept: string;
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    onFileChange(selectedFile);
  };

  return (
    <div className="flex-1">
      <Label className="flex items-center gap-2 mb-2">{title === 'Anexar ficheiro de vídeo' ? <Video className="h-4 w-4"/> : <ImageIcon className="h-4 w-4"/>} {title}</Label>
      <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-6 text-center transition-colors">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {title === 'Anexar ficheiro de vídeo' ? <Video className="h-10 w-10" /> : <ImageIcon className="h-10 w-10" />}
          <Button variant="outline" asChild className="mt-2">
            <label>
              <input type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
              {title === 'Anexar ficheiro de vídeo' ? 'Escolher Vídeo' : 'Escolher Imagem'}
            </label>
          </Button>
          {file && <p className="text-xs mt-2 text-foreground">{file.name}</p>}
        </div>
      </div>
    </div>
  );
};


export function VideoTranscriber() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the scene image
  const [transcription, setTranscription] = useState('');
  const [finalScript, setFinalScript] = useState('');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUrlConversion = () => {
    if (!youtubeUrl) return;

    if (youtubeUrl.includes('/shorts/')) {
      const videoId = youtubeUrl.split('/shorts/')[1].split('?')[0];
      const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
      setYoutubeUrl(newUrl);
      toast({
        title: 'URL Convertido!',
        description: 'O link do YouTube Short foi convertido para o formato padrão.',
      });
    } else {
      toast({
        title: 'Nenhuma conversão necessária.',
        description: 'O URL já está no formato de vídeo padrão.',
      });
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleTranscribe = async () => {
    if (!videoFile) {
        toast({ title: "Nenhum ficheiro de vídeo selecionado", variant: "destructive" });
        return;
    }
    setIsLoading('transcribing');
    setTranscription('');
    setFinalScript('');
    toast({ title: "A transcrever vídeo...", description: "Isto pode demorar alguns minutos." });

    try {
        const videoDataUri = await fileToDataUri(videoFile);
        const { transcription: result } = await transcribeUploadedVideo({ videoDataUri });
        setTranscription(result);
        toast({ title: "Transcrição concluída com sucesso!" });
    } catch (error) {
        console.error("Transcription failed:", error);
        toast({ title: "Erro na transcrição", variant: "destructive" });
    } finally {
        setIsLoading(null);
    }
  }

  const handleGenerateScript = async () => {
     if (!transcription) return;
     setIsLoading('scripting');
     setFinalScript('');
     toast({ title: "Gerando roteiro da transcrição..." });
     try {
         const imagePrompt = imageFile ? await fileToDataUri(imageFile) : undefined;
         const { script } = await generateScriptFromTranscription({ transcription, imagePrompt });
         setFinalScript(script);
         toast({ title: "Roteiro gerado com sucesso!" });
     } catch (error) {
        console.error("Script generation failed:", error);
        toast({ title: "Erro ao gerar roteiro", variant: "destructive" });
     } finally {
        setIsLoading(null);
     }
  }

  const handleParaphrase = async () => {
    if (!transcription) return;
    setIsLoading('paraphrasing');
    setFinalScript('');
    toast({ title: "Gerando roteiro com outras palavras..." });
    try {
        const imagePrompt = imageFile ? await fileToDataUri(imageFile) : undefined;
        const { script } = await paraphraseScript({ transcription, imagePrompt });
        setFinalScript(script);
        toast({ title: "Roteiro reescrito com sucesso!" });
    } catch (error) {
       console.error("Paraphrasing failed:", error);
       toast({ title: "Erro ao reescrever roteiro", variant: "destructive" });
    } finally {
       setIsLoading(null);
    }
  }

  return (
    <div className="flex flex-col h-full w-full space-y-6">
       <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
              <h2 className="text-xl font-bold font-headline">Transcrever Vídeo</h2>
               <p className="text-sm text-muted-foreground">
                  Transforme áudio de vídeos em texto para criar novos roteiros e conteúdos.
              </p>
          </div>
        </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Youtube className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="m-0 text-xl font-bold font-headline">Utilitário de Vídeo do YouTube</CardTitle>
                 <p className="text-sm text-muted-foreground">
                    Cole um URL do YouTube para descarregar o vídeo e usá-lo na secção de transcrição abaixo.
                </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="youtube-url">URL do YouTube</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="youtube-url" 
                placeholder="https://www.youtube.com/watch?v=..." 
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={handleUrlConversion}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Button className="mt-4" asChild>
            <a href="https://savefrom.in.net/youtube-video-downloader" target="_blank" rel="noopener noreferrer">
                <Download className="mr-2" />
                Descarregar Vídeo
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Video className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <CardTitle className="m-0 text-xl font-bold font-headline">Transcrever Vídeo Anexado</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Anexe um ficheiro de vídeo do seu computador para obter a transcrição em português com timestamps.
                    </p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <FileUploadArea
                    title="Anexar ficheiro de vídeo"
                    onFileChange={setVideoFile}
                    file={videoFile}
                    accept="video/*"
                />
                <FileUploadArea
                    title="Anexar imagem de cena (Opcional)"
                    onFileChange={setImageFile}
                    file={imageFile}
                    accept="image/*"
                />
            </div>
            <Button className="w-full" onClick={handleTranscribe} disabled={!videoFile || !!isLoading}>
                {isLoading === 'transcribing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>}
                Transcrever Vídeo Anexado
            </Button>
            
            {transcription && (
                <div className="space-y-4 pt-4">
                    <Label>Transcrição Resultante</Label>
                    <Textarea value={transcription} readOnly className="min-h-[150px] bg-muted"/>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Button className="flex-1" onClick={handleGenerateScript} disabled={!!isLoading}>
                            {isLoading === 'scripting' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2" />}
                            Gerar Roteiro da Transcrição
                        </Button>
                        <Button variant="secondary" className="flex-1" onClick={handleParaphrase} disabled={!!isLoading}>
                            {isLoading === 'paraphrasing' ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Bot className="mr-2" />}
                            Gerar com Outras Palavras
                        </Button>
                    </div>
                </div>
            )}
            {finalScript && (
                 <div className="space-y-2 pt-4">
                    <Label>Roteiro Final Gerado</Label>
                    <Textarea value={finalScript} readOnly className="min-h-[200px] bg-muted font-mono"/>
                 </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
