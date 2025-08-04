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
}

export function ImagePreviewDialog({ isOpen, onOpenChange, imageData }: ImagePreviewDialogProps) {
  const handleDownload = () => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = imageData.url;
    // Generate a filename from the prompt
    const fileName = `${imageData.prompt.substring(0, 30).replace(/\s/g, '_')}.png`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Imagem Gerada</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center my-4">
          {imageData && (
            <Image
              src={imageData.url}
              alt={imageData.prompt}
              width={512}
              height={512}
              className="rounded-lg object-contain"
            />
          )}
        </div>
        <DialogFooter className="sm:justify-end">
           <Button type="button" onClick={handleDownload} disabled={!imageData}>
            <Download className="mr-2 h-4 w-4" />
            Baixar Imagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
