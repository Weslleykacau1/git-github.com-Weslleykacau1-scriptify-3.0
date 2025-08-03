// src/components/features/scene-gallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, Trash2, Download, Clapperboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Scene } from '@/lib/types';
import { convertJsonToCsv } from '@/lib/utils';


export function SceneGallery() {
  const [scenes, setScenes] = useState<Scene[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const loadScenes = () => {
      try {
        const storedScenes = localStorage.getItem('fg-scenes');
        if (storedScenes) {
          setScenes(JSON.parse(storedScenes));
        }
      } catch (error) {
        console.error("Failed to load scenes from localStorage", error);
        toast({ title: "Erro ao carregar cenas", variant: "destructive" });
      }
    };
    loadScenes();
    
    const handleStorageChange = () => loadScenes();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [toast]);

  const handleExport = (scene: Scene) => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scene, null, 2));
      const fileName = `${scene.title || 'scene'}.json`;

      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", fileName);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast({ title: `"${scene.title}" exportado como JSON!` });
    } catch(error) {
        console.error("Export failed:", error);
        toast({ title: 'Erro ao exportar', variant: 'destructive' });
    }
  };
  
  const handleExportAll = (format: 'json' | 'csv') => {
     if (scenes.length === 0) {
       toast({ title: 'Nada para exportar', description: 'A sua galeria de cenas está vazia.', variant: 'destructive' });
       return;
     }

    try {
        let dataStr: string;
        let fileName: string;

        if (format === 'json') {
          dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scenes, null, 2));
          fileName = `scenes_backup.json`;
        } else {
          dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(convertJsonToCsv(scenes));
          fileName = `scenes_backup.csv`;
        }
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        toast({ title: `Todas as cenas foram exportadas como ${format.toUpperCase()}!` });
    } catch(error) {
        console.error("Export all failed:", error);
        toast({ title: 'Erro ao exportar tudo', variant: 'destructive' });
    }
  }

  const handleDelete = (sceneId: string, sceneTitle?: string) => {
    if (window.confirm(`Tem a certeza que quer eliminar a cena "${sceneTitle || 'esta cena'}"?`)) {
      try {
        const updatedScenes = scenes.filter(scene => scene.id !== sceneId);
        localStorage.setItem('fg-scenes', JSON.stringify(updatedScenes));
        setScenes(updatedScenes);
        window.dispatchEvent(new Event('storage'));
        toast({ title: `"${sceneTitle}" foi eliminada.` });
      } catch (error) {
        console.error("Delete failed:", error);
        toast({ title: 'Erro ao eliminar', variant: 'destructive' });
      }
    }
  };

  const handleLoad = (scene: Scene) => {
    const event = new CustomEvent('loadScene', { detail: scene });
    window.dispatchEvent(event);
    toast({
      title: `"${scene.title}" carregada!`,
      description: 'Volte à tela inicial e clique em "Criador de Personagens e Cenas" para editar.',
    });
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Clapperboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Galeria de Cenas</h2>
            <p className="text-sm text-muted-foreground">
              Cenas que você salvou. Carregue uma para editar ou use-a com um influenciador para gerar um roteiro.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExportAll('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
            </Button>
            <Button variant="outline" onClick={() => handleExportAll('json')}>
                <Download className="mr-2 h-4 w-4" />
                Exportar JSON
            </Button>
        </div>
      </div>
      
      {scenes.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">A sua galeria de cenas está vazia.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenes.map((scene) => (
            <Card key={scene.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{scene.title || "Cena Sem Título"}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{scene.setting}</p>
                {scene.duration && <p className="text-xs text-muted-foreground mt-2">{scene.duration} seg</p>}
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2">
                <div className="flex w-full gap-2">
                  <Button className="flex-1" onClick={() => handleLoad(scene)}><UploadCloud className="mr-2 h-4 w-4"/>Carregar</Button>
                </div>
                <div className="flex w-full justify-between items-center mt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleExport(scene)}><FileText className="mr-2 h-4 w-4"/>Exportar</Button>
                  <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive" onClick={() => handleDelete(scene.id, scene.title)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
