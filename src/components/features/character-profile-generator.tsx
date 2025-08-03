// src/components/features/character-profile-generator.tsx
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, User, UploadCloud, ClipboardPaste, Sparkles } from 'lucide-react';
import { generateCharacterProfile, GenerateCharacterProfileOutput } from '@/ai/flows/generate-character-profile';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CharacterProfileGenerator() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<GenerateCharacterProfileOutput>>({});
  const { toast } = useToast();

  const handleProfileChange = (field: keyof GenerateCharacterProfileOutput, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const analyzeImage = async () => {
    if (!photoDataUri) {
      toast({
        title: 'Erro',
        description: 'Por favor, envie uma imagem.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    try {
      const result = await generateCharacterProfile({ photoDataUri });
      setProfile(result);
      toast({ title: 'Perfil preenchido com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao analisar imagem',
        description: 'Ocorreu um erro ao gerar o perfil a partir da imagem.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeText = async () => {
    if (!textDescription) {
        toast({
          title: 'Erro',
          description: 'Por favor, insira uma descrição de texto.',
          variant: 'destructive',
        });
        return;
      }
    setIsLoading(true);
    try {
      const result = await generateCharacterProfile({ textDescription });
      setProfile(result);
      toast({ title: 'Perfil preenchido com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao analisar texto',
        description: 'Ocorreu um erro ao gerar o perfil a partir do texto.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold font-headline">1. Defina o seu Influenciador</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Analysis Section */}
        <div className="bg-card border rounded-xl p-6 space-y-4 flex flex-col">
            <div className="flex items-center gap-3">
                <UploadCloud className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Carregar Foto de Referência</h3>
            </div>
            <FileUploader onFileChange={setPhotoDataUri} file={photoDataUri} />
            <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription className="text-xs">
                A análise será detalhada, incluindo características faciais, cabelo, estilo e personalidade.
                </AlertDescription>
            </Alert>
            <Button onClick={analyzeImage} disabled={isLoading || !photoDataUri}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analisar Imagem
            </Button>
        </div>

        {/* Text Analysis Section */}
        <div className="bg-card border rounded-xl p-6 space-y-4 flex flex-col">
            <div className="flex items-center gap-3">
                <ClipboardPaste className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Cole as Características</h3>
            </div>
            <Textarea
                placeholder="Cole aqui um texto com as características do influenciador..."
                value={textDescription}
                onChange={(e) => setTextDescription(e.target.value)}
                className="flex-grow min-h-[150px]"
            />
             <Button onClick={analyzeText} disabled={isLoading || !textDescription}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analisar Texto e Preencher
            </Button>
        </div>
      </div>

        {/* Profile Details Section */}
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" placeholder="Ex: Luna Silva" value={profile.name || ''} onChange={e => handleProfileChange('name', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="niche">Nicho</Label>
                    <Input id="niche" placeholder="Ex: Moda, Jogos" value={profile.niche || ''} onChange={e => handleProfileChange('niche', e.target.value)} />
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="personality">Traços de Personalidade</Label>
                <Textarea id="personality" placeholder="Carismática, engraçada, expert em seu nicho..." value={profile.personality || ''} onChange={e => handleProfileChange('personality', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="physicalAppearance">Detalhes de Aparência</Label>
                <Textarea id="physicalAppearance" placeholder="Descreva a aparência física em detalhe extremo..." value={profile.physicalAppearance || ''} onChange={e => handleProfileChange('physicalAppearance', e.target.value)} />
                <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                    Seja detalhado - formato do rosto, cor dos olhos, textura do cabelo, etc. para melhor geração de vídeo.
                    </AlertDescription>
                </Alert>
            </div>
            <div className="space-y-1">
                <Label htmlFor="clothingStyle">Vestuário</Label>
                <Textarea id="clothingStyle" placeholder="Descreva as roupas, sapatos e acessórios que o personagem está a usar..." value={profile.clothingStyle || ''} onChange={e => handleProfileChange('clothingStyle', e.target.value)} />
            </div>
            {/* Adicione outros campos como biografia, traços únicos, sotaque se necessário */}
        </div>
    </div>
  );
}
