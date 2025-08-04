// src/components/features/video-transcriber.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, Youtube, Video, Image as ImageIcon, FileText, Bot } from 'lucide-react';

// A simplified file uploader for this component
const FileUploadArea = ({ 
  title, 
  description, 
  formats, 
  onFileChange, 
  icon 
}: { 
  title: string; 
  description: string; 
  formats: string; 
  onFileChange: (file: File | null) => void;
  icon: React.ReactNode;
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileChange(file);
  };

  return (
    <div className="flex-1">
      <Label className="flex items-center gap-2 mb-2">{icon} {title}</Label>
      <div className="relative flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-6 text-center transition-colors">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          {title === 'Anexar ficheiro de vídeo' ? <Video className="h-10 w-10" /> : <ImageIcon className="h-10 w-10" />}
          <p className="text-xs mt-2">{formats}</p>
          <Button variant="outline" asChild className="mt-2">
            <label>
              <input type="file" className="sr-only" onChange={handleFileChange} />
              {title === 'Anexar ficheiro de vídeo' ? 'Escolher Vídeo' : 'Escolher Imagem'}
            </label>
          </Button>
          {fileName && <p className="text-xs mt-2 text-foreground">{fileName}</p>}
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

export function VideoTranscriber() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

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
              <Button variant="ghost" size="icon">
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
        <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <FileUploadArea
                    icon={<Video className="h-4 w-4"/>}
                    title="Anexar ficheiro de vídeo"
                    description="Formatos suportados: MP4, MOV, WEBM, etc."
                    formats=""
                    onFileChange={setVideoFile}
                />
                <FileUploadArea
                    icon={<ImageIcon className="h-4 w-4"/>}
                    title="Anexar imagem de cena (Opcional)"
                    description="Isto irá definir o cenário visual do roteiro gerado."
                    formats=""
                    onFileChange={setImageFile}
                />
            </div>
            <Button className="w-full mb-4">
                Transcrever Vídeo Anexado
            </Button>
            <div className="flex flex-col md:flex-row gap-4">
                <Button variant="primary" className="flex-1 bg-green-600 hover:bg-green-700">
                    <FileText className="mr-2" />
                    Gerar Roteiro da Transcrição
                </Button>
                <Button variant="secondary" className="flex-1">
                    <Bot className="mr-2" />
                    Gerar com Outras Palavras
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
