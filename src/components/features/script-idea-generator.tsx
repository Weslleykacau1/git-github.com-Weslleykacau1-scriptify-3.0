'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { generateScriptIdeas } from '@/ai/flows/generate-script-ideas';
import { Label } from '../ui/label';

export function ScriptIdeaGenerator() {
  const [characterProfile, setCharacterProfile] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scriptIdea, setScriptIdea] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterProfile || !sceneDescription) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha o perfil do personagem e a descrição da cena.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setScriptIdea('');

    try {
      const result = await generateScriptIdeas({ characterProfile, sceneDescription });
      setScriptIdea(result.scriptIdea);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao gerar ideia de roteiro',
        description: 'Ocorreu um erro ao gerar a ideia de roteiro.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 flex-grow">
          <div className='space-y-1'>
            <Label htmlFor="char-profile">Perfil do Personagem</Label>
            <Textarea
              id="char-profile"
              placeholder="Ex: Um vlogger carismático..."
              value={characterProfile}
              onChange={(e) => setCharacterProfile(e.target.value)}
              className="h-24"
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor="scene-desc">Descrição da Cena</Label>
            <Textarea
              id="scene-desc"
              placeholder="Ex: Um vídeo de unboxing..."
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              className="h-24"
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading} className="mt-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gerar Ideia
        </Button>
      </form>
      {scriptIdea && (
        <div className="mt-4 space-y-2">
            <Label>Ideia Gerada</Label>
          <Textarea readOnly value={scriptIdea} className="h-32 text-sm" />
        </div>
      )}
    </div>
  );
}
