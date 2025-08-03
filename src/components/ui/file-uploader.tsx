'use client';

import { UploadCloud, X } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FileUploaderProps {
  onFileChange: (fileData: string | null) => void;
  file: string | null;
}

export function FileUploader({ onFileChange, file }: FileUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          onFileChange(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [onFileChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileChange(null);
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card p-8 text-center transition-colors',
        isDragActive && 'border-primary bg-primary/10'
      )}
    >
      <input {...getInputProps()} />
      {file ? (
        <>
            <Image src={file} alt="Preview" width={192} height={192} className="max-h-48 w-auto rounded-md object-contain" />
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 rounded-full bg-destructive/50 hover:bg-destructive text-destructive-foreground h-6 w-6" onClick={removeFile}>
                <X className="h-4 w-4" />
            </Button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <UploadCloud className="h-10 w-10" />
          <p className="font-medium">
            {isDragActive ? 'Solte a imagem aqui...' : 'Arraste e solte uma imagem ou clique para selecionar'}
          </p>
          <p className="text-xs">PNG, JPG, WEBP, etc.</p>
        </div>
      )}
    </div>
  );
}
