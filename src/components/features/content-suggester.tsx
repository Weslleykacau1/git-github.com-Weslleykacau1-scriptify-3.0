'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { suggestContent, SuggestContentOutput } from '@/ai/flows/suggest-content';
import { Label } from '../ui/label';

export function ContentSuggester() {
  const [characterProfile, setCharacterProfile] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestContentOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterProfile || !sceneDescription) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha ambos os campos.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setSuggestions(null);

    try {
      const result = await suggestContent({ characterProfile, sceneDescription });
      setSuggestions(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao obter sugestões',
        description: 'Ocorreu um erro ao obter as sugestões.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado para a área de transferência!' });
  }

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4">
            <div className='space-y-1'>
              <Label htmlFor="char-profile-suggester">Perfil do Personagem</Label>
              <Textarea
                id="char-profile-suggester"
                placeholder="Ex: Um crítico de comida espirituoso..."
                value={characterProfile}
                onChange={(e) => setCharacterProfile(e.target.value)}
                className="h-24"
              />
            </div>
            <div className='space-y-1'>
              <Label htmlFor="scene-desc-suggester">Descrição da Cena</Label>
              <Textarea
                id="scene-desc-suggester"
                placeholder="Ex: Analisando um novo desafio de ramen picante..."
                value={sceneDescription}
                onChange={(e) => setSceneDescription(e.target.value)}
                className="h-24"
              />
            </div>
        </div>
        <Button type="submit" disabled={isLoading} className="mt-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Obter Sugestões
        </Button>
      </form>

      {suggestions && (
        <div className="mt-4 grid md:grid-cols-2 gap-4 overflow-y-auto">
          <div className="space-y-2">
            <h4 className="font-semibold">Títulos de Vídeo</h4>
            <div className="space-y-2">
              {suggestions.videoTitles.map((title, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-md bg-secondary/50 text-sm">
                  <span>{title}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(title)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Diálogos</h4>
            <div className="space-y-2">
              {suggestions.dialogues.map((dialogue, i) => (
                 <div key={i} className="flex items-center justify-between p-2 rounded-md bg-secondary/50 text-sm">
                  <span className='italic'>"{dialogue}"</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(dialogue)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
