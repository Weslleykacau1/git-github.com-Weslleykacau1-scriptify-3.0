// src/components/features/character-profile-generator.tsx
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, User, UploadCloud, ClipboardPaste, Sparkles, Plus, Library, Save, RefreshCw, Clapperboard, Text, Box } from 'lucide-react';
import { analyzeCharacterImage } from '@/ai/flows/analysis/analyze-character-image';
import { analyzeTextProfile } from '@/ai/flows/analysis/analyze-text-profile';
import { analyzeSceneBackground } from '@/ai/flows/analysis/analyze-scene-background';
import { analyzeProductImage } from '@/ai/flows/analysis/analyze-product-image';
import { suggestAction } from '@/ai/flows/content-assistance/suggest-action';
import { suggestDialogue } from '@/ai/flows/content-assistance/suggest-dialogue';
import { suggestTitle } from '@/ai/flows/content-assistance/suggest-title';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ContentSuggester } from './content-suggester';
import type { Character, Scene } from '@/lib/types';


export function CharacterProfileGenerator() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [scenePhotoDataUri, setScenePhotoDataUri] = useState<string | null>(null);
  const [productPhotoDataUri, setProductPhotoDataUri] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingScene, setIsLoadingScene] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState<string | null>(null);
  
  // States for Character Profile
  const [profile, setProfile] = useState<Partial<Character>>({ id: `char_${Date.now()}` });
  
  // States for Scene
  const [scene, setScene] = useState<Partial<Scene>>({ id: `scene_${Date.now()}`});

  const { toast } = useToast();

  const handleProfileChange = (field: keyof Character, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSceneChange = (field: keyof Scene, value: any) => {
    setScene(prev => ({ ...prev, [field]: value }));
  };
  
  const generateRandomSeed = () => {
    const seed = Math.floor(100000 + Math.random() * 900000).toString();
    handleProfileChange('generationSeed', seed);
  };

  useEffect(() => {
    generateRandomSeed();
  }, []);
  
  const resetCharacter = () => {
    setProfile({ id: `char_${Date.now()}` });
    setPhotoDataUri(null);
    setTextDescription('');
    generateRandomSeed();
    toast({ title: "Novo Influenciador", description: "Campos do influenciador reiniciados." });
  };
  
  const resetScene = () => {
    setScene({ id: `scene_${Date.now()}`});
    setScenePhotoDataUri(null);
    setProductPhotoDataUri(null);
    toast({ title: "Nova Cena", description: "Campos da cena reiniciados." });
  }

  const loadFromGallery = (type: 'character' | 'scene') => {
    const key = type === 'character' ? 'fg-characters' : 'fg-scenes';
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    const name = prompt(`Qual ${type} quer carregar?\n\nDisponível:\n` + data.map((item: any) => item.name || item.title).join('\n'));
    if (name) {
      const item = data.find((item: any) => (item.name || item.title) === name);
      if (item) {
        if (type === 'character') {
          setProfile(item);
        } else {
          setScene(item);
        }
        toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} carregado(a)!`, description: `Os dados de "${name}" foram carregados.` });
      } else {
        toast({ title: 'Não encontrado', variant: 'destructive' });
      }
    }
  };
  
  const saveToGallery = (type: 'character' | 'scene') => {
    const key = type === 'character' ? 'fg-characters' : 'fg-scenes';
    const dataToSave = type === 'character' ? profile : scene;
    const itemName = type === 'character' ? profile.name : scene.title;

    if (!itemName) {
        toast({ title: `Por favor, defina um ${type === 'character' ? 'nome para o personagem' : 'título para a cena'}.`, variant: 'destructive'});
        return;
    }

    try {
        const existingData = JSON.parse(localStorage.getItem(key) || '[]');
        const existingIndex = existingData.findIndex((item: any) => item.id === dataToSave.id);

        if (existingIndex > -1) {
            existingData[existingIndex] = dataToSave; // Update existing
        } else {
            existingData.push(dataToSave); // Add new
        }

        localStorage.setItem(key, JSON.stringify(existingData));
        window.dispatchEvent(new Event('storage')); // Notify other components
        toast({
            title: `${type === 'character' ? 'Personagem' : 'Cena'} guardado(a)!`,
            description: `"${itemName}" foi guardado(a) na sua galeria.`,
        });
    } catch (error) {
        console.error("Failed to save to gallery:", error);
        toast({ title: 'Erro ao guardar na galeria.', variant: 'destructive' });
    }
  };


  const analyzeImage = async () => {
    if (!photoDataUri) {
      toast({ title: 'Erro', description: 'Por favor, envie uma imagem.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await analyzeCharacterImage({ photoDataUri });
      setProfile(prev => ({...prev, ...result}));
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

  const analyzeSceneImage = async () => {
    if (!scenePhotoDataUri) {
      toast({ title: 'Erro', description: 'Por favor, envie uma imagem de cenário.', variant: 'destructive' });
      return;
    }
    setIsLoadingScene(true);
    try {
      const result = await analyzeSceneBackground({ photoDataUri: scenePhotoDataUri });
      handleSceneChange('setting', result.sceneDescription);
      toast({ title: 'Cena preenchida com sucesso!' });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao analisar com IA',
        description: 'Ocorreu um erro ao gerar a descrição da cena.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingScene(false);
    }
  };

  const analyzeProduct = async () => {
    if (!productPhotoDataUri) {
        toast({ title: 'Erro', description: 'Por favor, envie uma imagem do produto.', variant: 'destructive' });
        return;
    }
    setIsLoadingProduct(true);
    try {
        const result = await analyzeProductImage({ photoDataUri: productPhotoDataUri });
        setScene(prev => ({
            ...prev,
            product: {
                name: result.productName,
                brand: result.brand,
                description: result.description,
            }
        }));
        toast({ title: 'Dados do produto preenchidos com sucesso!' });
    } catch (error) {
        console.error(error);
        toast({
            title: 'Erro ao analisar imagem do produto',
            description: 'Ocorreu um erro ao extrair os dados do produto.',
            variant: 'destructive',
        });
    } finally {
        setIsLoadingProduct(false);
    }
  };
  
  const analyzeText = async () => {
    if (!textDescription) {
      toast({ title: 'Erro', description: 'Por favor, insira uma descrição de texto.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      const result = await analyzeTextProfile({ textDescription });
      setProfile(prev => ({...prev, ...result}));
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
  
  const handleAIGeneration = async (type: 'title' | 'action' | 'dialogue') => {
    setIsLoadingAI(type);
    try {
      let result;
      switch (type) {
        case 'title':
          result = await suggestTitle({ sceneDescription: scene.setting || '', sceneAction: scene.mainAction || '' });
          handleSceneChange('title', result.title);
          break;
        case 'action':
          result = await suggestAction({ sceneDescription: scene.setting || '' });
          handleSceneChange('mainAction', result.action);
          break;
        case 'dialogue':
          result = await suggestDialogue({
            characterPersonality: profile.personality || '',
            sceneDescription: scene.setting || '',
            sceneAction: scene.mainAction || ''
          });
          handleSceneChange('dialogue', result.dialogue);
          break;
      }
      toast({ title: `${type.charAt(0).toUpperCase() + type.slice(1)} gerado com sucesso!` });
    } catch (error) {
      console.error(`Error generating ${type}:`, error);
      toast({ title: `Erro ao gerar ${type}`, variant: 'destructive' });
    } finally {
      setIsLoadingAI(null);
    }
  };

  const getCharacterProfileAsString = () => {
    return JSON.stringify(profile, null, 2);
  };
  
  const getSceneDescriptionAsString = () => {
    return JSON.stringify(scene, null, 2);
  }

  return (
    <div className="flex flex-col h-full w-full space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold font-headline">1. Defina o seu Influenciador</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6 space-y-4 flex flex-col">
            <div className="flex items-center gap-3">
                <UploadCloud className="h-6 w-6 text-primary" />
                <h3 className="font-semibold text-lg">Carregar Foto de Referência</h3>
            </div>
            <FileUploader onFileChange={setPhotoDataUri} file={photoDataUri}>
                {photoDataUri && (
                    <Button onClick={analyzeImage} disabled={isLoading} className="mt-4 w-full">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Analisar Imagem
                    </Button>
                )}
            </FileUploader>
            <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription className="text-xs">
                A análise será detalhada, incluindo características faciais, cabelo, estilo e personalidade.
                </AlertDescription>
            </Alert>
        </div>

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
            <Button variant="outline" onClick={resetCharacter}><Plus /> Novo Influenciador</Button>
            <Button variant="outline" onClick={() => loadFromGallery('character')}><Library /> Carregar da Galeria</Button>
            <Button onClick={() => saveToGallery('character')}><Save /> Adicionar à Galeria</Button>
        </div>

        <div className="flex items-center gap-3 pt-8">
            <Clapperboard className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold font-headline">2. Crie ou Edite uma Cena</h2>
        </div>
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="sceneTitle">Título da Cena</Label>
                <div className='flex items-center gap-2'>
                  <Input id="sceneTitle" placeholder="Ex: Unboxing do Produto X" value={scene.title || ''} onChange={(e) => handleSceneChange('title', e.target.value)} />
                  <Button variant="outline" size="icon" onClick={() => handleAIGeneration('title')} disabled={isLoadingAI === 'title' || !scene.setting || !scene.mainAction}>
                      {isLoadingAI === 'title' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  </Button>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Referência de Cenário (Opcional)</Label>
                <FileUploader onFileChange={setScenePhotoDataUri} file={scenePhotoDataUri}>
                    {scenePhotoDataUri && (
                        <Button onClick={analyzeSceneImage} disabled={isLoadingScene} className="mt-4 w-full">
                            {isLoadingScene ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Gerar Cena com IA
                        </Button>
                    )}
                </FileUploader>
            </div>
             <div className="space-y-2">
                <Label htmlFor="sceneSetting">Cenário</Label>
                <Textarea 
                    id="sceneSetting" 
                    placeholder="Descreva o ambiente em detalhes - iluminação, cores, objetos, atmosfera..."
                    value={scene.setting || ''}
                    onChange={(e) => handleSceneChange('setting', e.target.value)}
                />
                <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                        Dica: Seja específico sobre iluminação, cores dominantes, materiais, e atmosfera. Quanto mais detalhes, melhor o resultado.
                    </AlertDescription>
                </Alert>
            </div>
            <div className="space-y-2">
                <Label htmlFor="mainAction">Ação Principal</Label>
                <div className="flex items-center gap-2">
                  <Textarea id="mainAction" placeholder="O que o influenciador está a fazer..." value={scene.mainAction || ''} onChange={(e) => handleSceneChange('mainAction', e.target.value)} />
                  <Button variant="outline" size="icon" onClick={() => handleAIGeneration('action')} disabled={isLoadingAI === 'action' || !scene.setting}>
                      {isLoadingAI === 'action' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} 
                  </Button>
                </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="dialogue">Diálogo</Label>
                <div className="flex items-center gap-2">
                  <Textarea id="dialogue" placeholder="O que o influenciador diz (em Português do Brasil)..." value={scene.dialogue || ''} onChange={(e) => handleSceneChange('dialogue', e.target.value)} />
                  <Button variant="outline" size="icon" onClick={() => handleAIGeneration('dialogue')} disabled={isLoadingAI === 'dialogue' || !profile.personality || !scene.setting || !scene.mainAction}>
                      {isLoadingAI === 'dialogue' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} 
                  </Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <Label htmlFor="cameraAngle">Ângulo da Câmara</Label>
                    <Select value={scene.cameraAngle} onValueChange={(v) => handleSceneChange('cameraAngle', v)}>
                        <SelectTrigger><SelectValue placeholder="Câmera Dinâmica (Criatividade da IA)" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="dynamic">Câmera Dinâmica (Criatividade da IA)</SelectItem>
                            <SelectItem value="vlog">Vlog (Conversacional)</SelectItem>
                            <SelectItem value="selfie">Selfie</SelectItem>
                            <SelectItem value="pov">Ponto de Vista</SelectItem>
                            <SelectItem value="medium_shot">Médio</SelectItem>
                            <SelectItem value="wide_shot">Plano Geral</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="duration">Duração</Label>
                    <Select value={String(scene.duration || '8')} onValueChange={(v) => handleSceneChange('duration', parseInt(v))}>
                        <SelectTrigger><SelectValue placeholder="Selecione a duração..." /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="5">5 seg</SelectItem>
                            <SelectItem value="8">8 seg</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="videoFormat">Formato do Vídeo</Label>
                    <Select value={scene.videoFormat} onValueChange={(v) => handleSceneChange('videoFormat', v)}>
                        <SelectTrigger><SelectValue placeholder="9:16 (Vertical)" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4 border-red-500/30 bg-red-500/10">
                <div className="flex items-center gap-3">
                    <Text className="h-6 w-6 text-red-400" />
                    <h3 className="font-semibold text-lg text-red-400">Controlo de Texto no Ecrã</h3>
                </div>
                <div className="flex justify-between items-center">
                    <Label htmlFor="digitalText">Permite textos digitais na tela?</Label>
                    <RadioGroup value={scene.allowsDigitalText ? 'yes' : 'no'} onValueChange={(v) => handleSceneChange('allowsDigitalText', v === 'yes')} id="digitalText" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="digitalText-yes" />
                            <Label htmlFor="digitalText-yes">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="digitalText-no" />
                            <Label htmlFor="digitalText-no">Não</Label>
                        </div>
                    </RadioGroup>
                </div>
                <div className="flex justify-between items-center">
                    <Label htmlFor="physicalText">Apenas textos físicos como rótulos e placas reais?</Label>
                    <RadioGroup value={scene.onlyPhysicalText ? 'yes' : 'no'} onValueChange={(v) => handleSceneChange('onlyPhysicalText', v === 'yes')} id="physicalText" className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="physicalText-yes" />
                            <Label htmlFor="physicalText-yes">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="physicalText-no" />
                            <Label htmlFor="physicalText-no">Não</Label>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <div className="border rounded-lg p-4 space-y-4 border-green-500/30 bg-green-500/10">
                <div className="flex items-center gap-3">
                    <Box className="h-6 w-6 text-green-400" />
                    <h3 className="font-semibold text-lg text-green-400">Integração de Produto (Opcional)</h3>
                </div>
                <div className="space-y-2">
                    <Label>Carregue a imagem do produto</Label>
                    <FileUploader onFileChange={setProductPhotoDataUri} file={productPhotoDataUri}>
                        {productPhotoDataUri && (
                            <Button onClick={analyzeProduct} disabled={isLoadingProduct} className="mt-4 w-full">
                                {isLoadingProduct ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                                Analisar Imagem do Produto
                            </Button>
                        )}
                    </FileUploader>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor="productName">Nome do Produto</Label>
                        <Input id="productName" value={scene.product?.name || ''} onChange={(e) => setScene(p => ({...p, product: {...p?.product, name: e.target.value}}))} />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="partnerBrand">Marca Parceira</Label>
                        <Input id="partnerBrand" value={scene.product?.brand || ''} onChange={(e) => setScene(p => ({...p, product: {...p?.product, brand: e.target.value}}))} />
                    </div>
                </div>
                <div className="space-y-1">
                    <Label htmlFor="productDescription">Descrição do Produto</Label>
                    <Textarea id="productDescription" placeholder="Descrição detalhada do produto..." value={scene.product?.description || ''} onChange={(e) => setScene(p => ({...p, product: {...p?.product, description: e.target.value}}))} />
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroup defaultValue="no" id="sponsored" className="flex">
                        <div className="flex items-center space-x-2">
                             <RadioGroupItem value="yes" id="sponsored-yes" />
                        </div>
                    </RadioGroup>
                    <Label htmlFor="sponsored-yes">É uma parceria / conteúdo patrocinado.</Label>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 justify-start pt-4">
                <Button variant="outline" onClick={resetScene}><Plus className="mr-2"/> Nova Cena</Button>
                <Button variant="outline" onClick={() => loadFromGallery('scene')}><Library className="mr-2"/> Carregar da Galeria</Button>
                <Button onClick={() => saveToGallery('scene')}><Save className="mr-2"/> Guardar Cena</Button>
            </div>
        </div>
        
        <ContentSuggester
          characterProfile={getCharacterProfileAsString()}
          sceneDescription={getSceneDescriptionAsString()}
        />
    </div>
  );
}
