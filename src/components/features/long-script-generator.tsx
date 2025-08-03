// src/components/features/long-script-generator.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { FileText, User, Clapperboard, Clock, BookOpen, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateLongScript } from '@/ai/flows/script-generation/generate-long-script';
import type { Character, Scene } from '@/lib/types';


export function LongScriptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(5);
  const [generatedScript, setGeneratedScript] = useState('');
  const { toast } = useToast();

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
    setGeneratedScript('');
    toast({title: 'Gerando roteiro longo...'});
    try {
        const result = await generateLongScript({
            characterProfile: selectedCharacter ? JSON.stringify(selectedCharacter) : undefined,
            sceneDescription: selectedScene ? JSON.stringify(selectedScene) : undefined,
            topic,
            duration,
        });
        setGeneratedScript(result.script);
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

  return (
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
          <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Duração do Vídeo</Label>
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
        {generatedScript && (
            <div className="space-y-2">
                <Label>Roteiro Gerado</Label>
                <Textarea value={generatedScript} readOnly className="min-h-[250px] bg-muted"/>
            </div>
        )}
      </CardFooter>
    </Card>
  );
}
