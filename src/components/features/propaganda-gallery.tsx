// src/components/features/propaganda-gallery.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, Trash2, GalleryVertical } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Propaganda } from '@/lib/types';

export function PropagandaGallery() {
  const [propagandas, setPropagandas] = useState<Propaganda[]>([]);
  const { toast } = useToast();

  const loadPropagandas = () => {
    try {
      const banco = JSON.parse(localStorage.getItem('studioBanco') || '{}');
      setPropagandas(banco.propagandas || []);
    } catch (error) {
      console.error("Failed to load propagandas from localStorage", error);
      toast({ title: "Erro ao carregar propagandas", variant: "destructive" });
    }
  };

  useEffect(() => {
    loadPropagandas();
    
    const handleStorageChange = () => {
        loadPropagandas();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [toast]);

  const handleExport = (propaganda: Propaganda) => {
    try {
      const propagandaDataString = `
Nome do Produto: ${propaganda.productName || ''}
Público-Alvo: ${propaganda.targetAudience || ''}
Mensagem Principal: ${propaganda.mainMessage || ''}
Foco da Cena: ${propaganda.sceneFocus || ''}
Tom: ${propaganda.tone || ''}
Duração: ${propaganda.duration || ''}
Narração:
${propaganda.narration || ''}

--- ROTEIRO GERADO ---
${propaganda.generatedScript || ''}
      `.trim();

      const dataStr = "data:text/plain;charset=utf-8," + encodeURIComponent(propagandaDataString);
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `${propaganda.productName || 'propaganda'}.txt`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast({ title: `"${propaganda.productName}" exportado como TXT com sucesso!` });
    } catch (error) {
       console.error("Export failed:", error);
       toast({ title: 'Erro ao exportar', variant: 'destructive' });
    }
  };
  
  const handleDelete = (propId: string, propName: string) => {
     if (window.confirm(`Tem a certeza que quer eliminar a propaganda "${propName}"?`)) {
        try {
            const banco = JSON.parse(localStorage.getItem('studioBanco') || '{}');
            banco.propagandas = banco.propagandas.filter((p: Propaganda) => p.id !== propId);
            localStorage.setItem('studioBanco', JSON.stringify(banco));
            window.dispatchEvent(new Event('storage')); // Notify other components
            toast({ title: `"${propName}" foi eliminado(a).` });
        } catch(error) {
            console.error("Delete failed:", error);
            toast({ title: 'Erro ao eliminar', variant: 'destructive' });
        }
     }
  };

  const handleLoad = (propaganda: Propaganda) => {
    const event = new CustomEvent('loadPropaganda', { detail: propaganda });
    window.dispatchEvent(event);
    toast({
      title: `Propaganda "${propaganda.productName}" carregada!`,
      description: 'A propaganda está pronta no gerador para ser editada ou recriada.',
    });
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex justify-between items-start mb-2">
        <div className='flex items-center gap-3'>
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <GalleryVertical className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline">Galeria de Propagandas</h2>
            <p className="text-sm text-muted-foreground">
              Roteiros de propaganda que você criou. Carregue um para editar.
            </p>
          </div>
        </div>
      </div>
      
       {propagandas.length === 0 ? (
         <div className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground text-center py-8">A sua galeria de propagandas está vazia.</p>
         </div>
       ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {propagandas.map((prop) => (
            <Card key={prop.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{prop.productName || "Propaganda Sem Nome"}</CardTitle>
                <CardDescription>{prop.tone} - {prop.duration}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{prop.mainMessage}</p>
              </CardContent>
              <CardFooter className="flex flex-col items-stretch gap-2 mt-auto pt-4">
                <div className="flex flex-col sm:flex-row w-full gap-2">
                  <Button className="flex-1" onClick={() => handleLoad(prop)}><UploadCloud className="mr-2 h-4 w-4"/>Carregar</Button>
                  <Button variant="destructive" className="flex-1" onClick={() => handleDelete(prop.id, prop.productName)}><Trash2 className="mr-2 h-4 w-4"/>Excluir</Button>
                </div>
                <div className="w-full mt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleExport(prop)} className="w-full sm:w-auto"><FileText className="mr-2 h-4 w-4"/>EXPORTAR EM TXT</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
       )}
    </div>
  );
}
