// src/components/features/character-profile-generator.tsx
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, User, UploadCloud, ClipboardPaste, Sparkles, Plus, Library, Save, RefreshCw, Clapperboard } from 'lucide-react';
import { generateCharacterProfile, GenerateCharacterProfileOutput } from '@/ai/flows/generate-character-profile';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function CharacterProfileGenerator() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<Partial<GenerateCharacterProfileOutput>>({});
  const { toast } = useToast();

  const handleProfileChange = (field: keyof GenerateCharacterProfileOutput, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };
  
  const generateRandomSeed = () => {
    const seed = Math.floor(100000 + Math.random() * 900000).toString();
    handleProfileChange('generationSeed', seed);
  };

  useEffect(() => {
    generateRandomSeed();
  }, []);

  const analyzeWithAI = async (input: { photoDataUri?: string; textDescription?: string }) => {
    setIsLoading(true);
    try {
      const result = await generateCharacterProfile(input);
      setProfile(result);
      toast({ title: 'Perfil preenchido com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao analisar com IA',
        description: 'Ocorreu um erro ao gerar o perfil.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const analyzeImage = () => {
    if (!photoDataUri) {
      toast({ title: 'Erro', description: 'Por favor, envie uma imagem.', variant: 'destructive' });
      return;
    }
    analyzeWithAI({ photoDataUri });
  };
  
  const analyzeText = () => {
    if (!textDescription) {
      toast({ title: 'Erro', description: 'Por favor, insira uma descrição de texto.', variant: 'destructive' });
      return;
    }
    analyzeWithAI({ textDescription });
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
            <div className="space-y-1">
                <Label htmlFor="biography">Biografia Curta</Label>
                <Textarea id="biography" placeholder="Uma breve história sobre o personagem..." value={profile.biography || ''} onChange={e => handleProfileChange('biography', e.target.value)} />
            </div>
            <div className="space-y-1">
                <Label htmlFor="uniqueTraits">Traço Único/Peculiar</Label>
                <Input id="uniqueTraits" placeholder="Ex: Tem uma tatuagem de dragão no braço" value={profile.uniqueTraits || ''} onChange={e => handleProfileChange('uniqueTraits', e.target.value)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="age">Idade</Label>
                    <Input id="age" placeholder="Ex: 25" value={profile.age || ''} onChange={e => handleProfileChange('age', e.target.value)} />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select value={profile.gender} onValueChange={value => handleProfileChange('gender', value)}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                            <SelectItem value="Não-binário">Não-binário</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="generationSeed">Seed de Geração</Label>
                    <div className="flex items-center gap-2">
                        <Input id="generationSeed" value={profile.generationSeed || ''} onChange={e => handleProfileChange('generationSeed', e.target.value)} />
                        <Button variant="outline" size="icon" onClick={generateRandomSeed}><RefreshCw className="h-4 w-4" /></Button>
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="accent">Sotaque (Português do Brasil)</Label>
                    <Select value={profile.accent} onValueChange={value => handleProfileChange('accent', value)}>
                        <SelectTrigger><SelectValue placeholder="Padrão" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Padrão">Padrão</SelectItem>
                            <SelectItem value="Carioca">Carioca</SelectItem>
                            <SelectItem value="Paulista">Paulista</SelectItem>
                            <SelectItem value="Mineiro">Mineiro</SelectItem>
                            <SelectItem value="Gaúcho">Gaúcho</SelectItem>
                            <SelectItem value="Baiano">Baiano</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-1">
                <Label htmlFor="negativePrompt">Prompt Negativo (o que evitar)</Label>
                <Textarea id="negativePrompt" placeholder="Ex: Evitar roupas escuras, não sorrir..." value={profile.negativePrompt || ''} onChange={e => handleProfileChange('negativePrompt', e.target.value)} />
            </div>
        </div>
        <div className="flex flex-wrap gap-2 justify-end pt-4">
            <Button variant="outline"><Plus /> Novo Influenciador</Button>
            <Button variant="outline"><Library /> Carregar da Galeria</Button>
            <Button><Save /> Adicionar à Galeria</Button>
        </div>

        <div className="flex items-center gap-3 pt-8">
            <Clapperboard className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold font-headline">2. Crie ou Edite uma Cena</h2>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="sceneTitle">Título da Cena</Label>
                <Input id="sceneTitle" placeholder="Ex: Unboxing do Produto X" />
                <Button variant="outline" size="sm" className="mt-2"><Sparkles className="mr-2 h-4 w-4" /> Gerar Título com IA</Button>
            </div>
            <div className="space-y-2">
                <Label>Referência de Cenário (Opcional)</Label>
                <FileUploader onFileChange={() => {}} file={null} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="sceneSetting">Cenário</Label>
                <Textarea id="sceneSetting" placeholder="Descreva o ambiente em detalhes - iluminação, cores, objetos, atmosfera..." />
                <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        Dica: Seja específico sobre iluminação, cores dominantes, materiais, e atmosfera. Quanto mais detalhes, melhor o resultado.
                    </AlertDescription>
                </Alert>
            </div>
            <div className="space-y-2">
                <Label htmlFor="mainAction">Ação Principal</Label>
                <Textarea id="mainAction" placeholder="O que o influenciador está a fazer..." />
                <Button variant="outline" size="sm" className="mt-2"><Sparkles className="mr-2 h-4 w-4" /> Gerar Ação com IA</Button>
            </div>
             <div className="space-y-2">
                <Label htmlFor="dialogue">Diálogo</Label>
                <Textarea id="dialogue" placeholder="O que o influenciador diz (em Português do Brasil)..." />
                <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm"><Sparkles className="mr-2 h-4 w-4" /> Gerar Diálogo</Button>
                    <Button variant="outline" size="sm"><Sparkles className="mr-2 h-4 w-4" /> Gerar SEO</Button>
                </div>
            </div>
        </div>
    </div>
  );
}
