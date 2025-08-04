
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageData: { url: string; prompt: string } | null;
  imageData2?: { url: string; prompt: string } | null;
}

export function ImagePreviewDialog({ isOpen, onOpenChange, imageData, imageData2 }: ImagePreviewDialogProps) {
  const handleDownload = (url: string, prompt: string) => {
    if (!url) return;
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${prompt.substring(0, 30).replace(/\s/g, '_')}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={imageData2 ? "max-w-4xl" : "max-w-2xl"}>
        <DialogHeader>
          <DialogTitle>{imageData2 ? "Thumbnails Geradas" : "Imagem Gerada"}</DialogTitle>
        </DialogHeader>
        <div className={`my-4 grid ${imageData2 ? 'grid-cols-2 gap-4' : 'grid-cols-1'} items-center justify-center`}>
          {imageData && (
             <div className="flex flex-col items-center gap-2">
                <Image
                src={imageData.url}
                alt={imageData.prompt}
                width={512}
                height={512}
                className="rounded-lg object-contain"
                />
                 <Button type="button" size="sm" onClick={() => handleDownload(imageData.url, imageData.prompt)} disabled={!imageData}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Variação 1
                </Button>
            </div>
          )}
           {imageData2 && (
             <div className="flex flex-col items-center gap-2">
                <Image
                src={imageData2.url}
                alt={imageData2.prompt}
                width={512}
                height={512}
                className="rounded-lg object-contain"
                />
                 <Button type="button" size="sm" onClick={() => handleDownload(imageData2.url, imageData2.prompt)} disabled={!imageData2}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Variação 2
                </Button>
            </div>
          )}
        </div>
         <DialogFooter className="sm:justify-end mt-[-1rem]">
            {!imageData2 && (
              <Button type="button" onClick={() => handleDownload(imageData!.url, imageData!.prompt)} disabled={!imageData}>
                  <Download className="mr-2 h-4 w-4" />
                  Baixar Imagem
              </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
