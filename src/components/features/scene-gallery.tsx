// src/components/features/scene-gallery.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, UploadCloud, FileText, Trash2, Download } from 'lucide-react';

const scenes = [
  {
    title: 'Cena Sem Título',
    description: 'A cena se passa em um ambiente interno, possivelmente um estúdio ou escritório, com iluminação...',
    duration: '8 seg',
  },
];

export function SceneGallery() {
  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 className="text-xl font-bold font-headline">Galeria de Cenas</h2>
          <p className="text-sm text-muted-foreground">
            Cenas que você salvou. Carregue uma para editar ou use-a com um influenciador para gerar um roteiro.
          </p>
        </div>
        <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Cena
            </Button>
            <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Exportar para CSV
            </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenes.map((scene, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle>{scene.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{scene.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{scene.duration}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2">
              <div className="flex w-full gap-2">
                <Button className="flex-1"><UploadCloud className="mr-2"/>Carregar</Button>
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
