// src/components/features/character-gallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UploadCloud, Clapperboard, FileText, Trash2, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Character } from '@/lib/types';

export function CharacterGallery() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadCharacters = () => {
      try {
        const storedCharacters = localStorage.getItem('fg-characters');
        if (storedCharacters) {
          setCharacters(JSON.parse(storedCharacters));
        }
      } catch (error) {
        console.error("Failed to load characters from localStorage", error);
        toast({ title: "Erro ao carregar personagens", variant: "destructive" });
      }
    };
    loadCharacters();
    
    // Listen for storage changes to update gallery
    window.addEventListener('storage', loadCharacters);
    return () => window.removeEventListener('storage', loadCharacters);
  }, [toast]);
  
  const handleExport = (character: Character) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(character, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${character.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: `"${character.name}" exportado com sucesso!` });
  };
  
  const handleDelete = (charId: string, charName?: string) => {
     if (window.confirm(`Tem a certeza que quer eliminar "${charName}"?`)) {
       const updatedCharacters = characters.filter(char => char.id !== charId);
       localStorage.setItem('fg-characters', JSON.stringify(updatedCharacters));
       setCharacters(updatedCharacters);
       toast({ title: `"${charName}" foi eliminado.` });
     }
  };

  const handleLoad = (character: Character) => {
    // This is a placeholder for loading the character into the creator view.
    // The actual implementation would likely involve a shared state (like Zustand or Context).
    // For now, we'll just show a toast.
    console.log("Loading character:", character);
    toast({
      title: "Funcionalidade de Carregamento",
      description: "Esta funcionalidade irá carregar o personagem no Criador de Personagens. A implementação completa requer gestão de estado global.",
    });
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex justify-between items-start mb-2">
        <div className='flex items-center gap-3'>
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Palette className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Galeria de Personagens</h2>
            <p className="text-sm text-muted-foreground">
              Personagens que você criou. Carregue um para editar ou gerar roteiros.
            </p>
          </div>
        </div>
      </div>
      
       {characters.length === 0 ? (
         <p className="text-muted-foreground text-center py-8">A sua galeria de personagens está vazia.</p>
       ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.map((char) => (
            <Card key={char.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{char.name}</CardTitle>
                <CardDescription>{char.niche}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{char.biography}</p>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex w-full gap-2">
                  <Button className="flex-1" onClick={() => handleLoad(char)}><UploadCloud className="mr-2 h-4 w-4"/>Carregar</Button>
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleExport(char)}><FileText className="mr-2 h-4 w-4"/>Exportar</Button>
                  <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive" onClick={() => handleDelete(char.id, char.name)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
       )}
    </div>
  );
}
