// src/components/features/character-gallery.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UploadCloud, Clapperboard, FileText, Trash2, Palette } from 'lucide-react';

const characters = [
  {
    name: 'Dr. Saúde',
    niche: 'Saúde e bem-estar',
    bio: 'O Dr. Saúde, seu guia confiável para uma vida mais longa e feliz!',
  },
  {
    name: 'Personagem Sem Nome',
    niche: 'A definir',
    bio: 'Descrição do personagem a ser preenchida.',
  },
];

export function CharacterGallery() {
  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex justify-between items-start mb-2">
        <div className='flex items-center gap-3'>
          <Palette className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold font-headline">Galeria de Personagens</h2>
            <p className="text-sm text-muted-foreground">
              Personagens que você criou. Carregue um para editar ou gerar roteiros.
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Personagem
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {characters.map((char, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{char.name}</CardTitle>
              <CardDescription>{char.niche}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{char.bio}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <div className="flex w-full gap-2">
                <Button className="flex-1"><UploadCloud className="mr-2"/>Carregar</Button>
                <Button variant="secondary" className="flex-1">Cena Rápida</Button>
              </div>
              <div className="flex w-full justify-between items-center mt-2">
                <Button variant="ghost" size="sm"><FileText className="mr-2"/>Exportar</Button>
                <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive"><Trash2 /></Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
