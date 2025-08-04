
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Tag, Hash, FileText, Type } from 'lucide-react';
import type { GenerateSeoMetadataOutput } from '@/ai/flows/content-assistance/generate-seo-metadata';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface SeoPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  seoData: GenerateSeoMetadataOutput | null;
}

export function SeoPreviewDialog({ isOpen, onOpenChange, seoData }: SeoPreviewDialogProps) {
  const { toast } = useToast();

  const handleCopy = (text: string | undefined, fieldName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: `${fieldName} copiado para a área de transferência!` });
  };

  if (!seoData) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Metadados de SEO Gerados</DialogTitle>
          <DialogDescription>
            Use estes metadados para otimizar o seu vídeo no YouTube. Clique para copiar.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-title" className="flex items-center gap-2">
              <Type className="h-4 w-4" /> Título do Vídeo
            </Label>
            <div className="flex items-center gap-2">
              <Input id="youtube-title" readOnly value={seoData.youtubeTitle} className="bg-muted" />
              <Button variant="ghost" size="icon" onClick={() => handleCopy(seoData.youtubeTitle, 'Título')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube-description" className="flex items-center gap-2">
              <FileText className="h-4 w-4" /> Descrição
            </Label>
            <div className="flex items-start gap-2">
              <Textarea id="youtube-description" readOnly value={seoData.youtubeDescription} className="h-32 bg-muted" />
              <Button variant="ghost" size="icon" onClick={() => handleCopy(seoData.youtubeDescription, 'Descrição')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube-hashtags" className="flex items-center gap-2">
              <Hash className="h-4 w-4" /> Hashtags
            </Label>
            <div className="flex items-center gap-2">
              <Input id="youtube-hashtags" readOnly value={seoData.hashtags} className="bg-muted" />
              <Button variant="ghost" size="icon" onClick={() => handleCopy(seoData.hashtags, 'Hashtags')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="youtube-tags" className="flex items-center gap-2">
              <Tag className="h-4 w-4" /> Tags
            </Label>
            <div className="flex items-start gap-2">
              <Textarea id="youtube-tags" readOnly value={seoData.tags} className="h-24 bg-muted" />
              <Button variant="ghost" size="icon" onClick={() => handleCopy(seoData.tags, 'Tags')}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
