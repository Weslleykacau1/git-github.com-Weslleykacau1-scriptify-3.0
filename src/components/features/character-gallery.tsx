
// src/components/features/character-gallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, Trash2, Palette } from 'lucide-react';
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
    const handleStorageChange = () => loadCharacters();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [toast]);
  
  const handleExport = (character: Character) => {
    try {
      // Format character data into a readable string
      const characterDataString = `
Nome: ${character.name || ''}
Nicho: ${character.niche || ''}
Personalidade: ${character.personality || ''}
Aparência Física: ${character.physicalAppearance || ''}
Estilo de Roupa: ${character.clothingStyle || ''}
Biografia: ${character.biography || ''}
Traços Únicos: ${character.uniqueTraits || ''}
Sotaque: ${character.accent || ''}
Idade: ${character.age || ''}
Gênero: ${character.gender || ''}
Seed de Geração: ${character.generationSeed || ''}
Prompt Negativo: ${character.negativePrompt || ''}
      `.trim();

      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(characterDataString);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${character.name || 'character'}.txt`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast({ title: `"${character.name}" exportado com sucesso!` });
    } catch (error) {
       console.error("Export failed:", error);
       toast({ title: 'Erro ao exportar', variant: 'destructive' });
    }
  };
  
  const handleDelete = (charId?: string, charName?: string) => {
     if (!charId) return;
     if (window.confirm(`Tem a certeza que quer eliminar "${charName || 'este personagem'}"?`)) {
        try {
            const updatedCharacters = characters.filter(char => char.id !== charId);
            localStorage.setItem('fg-characters', JSON.stringify(updatedCharacters));
            setCharacters(updatedCharacters); // Optimistic update
            window.dispatchEvent(new Event('storage')); // Notify other components
            toast({ title: `"${charName}" foi eliminado.` });
        } catch(error) {
            console.error("Delete failed:", error);
            toast({ title: 'Erro ao eliminar', variant: 'destructive' });
        }
     }
  };

  const handleLoad = (character: Character) => {
    // This uses a custom event to notify the main page component to load the character and switch views.
    const event = new CustomEvent('loadCharacter', { detail: character });
    window.dispatchEvent(event);
    toast({
      title: `"${character.name}" carregado!`,
      description: 'O influenciador está pronto no criador de personagens para ser editado.',
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
                <CardTitle>{char.name || "Personagem Sem Nome"}</CardTitle>
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
                  <Button variant="ghost" size="sm" onClick={() => handleExport(char)}><FileText className="mr-2 h-4 w-4"/>EXPORTA EM TXT</Button>
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
