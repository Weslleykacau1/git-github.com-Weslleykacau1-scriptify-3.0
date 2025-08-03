// src/components/features/long-script-generator.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { FileText, User, Clapperboard, Camera, Pencil, Clock, BookOpen } from 'lucide-react';

export function LongScriptGenerator() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="m-0 text-xl font-bold font-headline">Gerador de Roteiro de Vídeo Longo</CardTitle>
            <CardDescription>
              Crie roteiros completos para vídeos mais longos. Opcionalmente, carregue um influenciador e um cenário para dar contexto à IA.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><User className="h-4 w-4" /> Carregar Personagem (Opcional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um influenciador..." />
              </SelectTrigger>
              <SelectContent>
                {/* Options will be populated from the gallery */}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Clapperboard className="h-4 w-4" /> Carregar Cenário (Opcional)</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um cenário..." />
              </SelectTrigger>
              <SelectContent>
                {/* Options will be populated from the gallery */}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Camera className="h-4 w-4" /> Ângulo da Câmera</Label>
          <Select defaultValue="dynamic">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dynamic">Câmera Dinâmica (Criatividade da IA)</SelectItem>
              {/* Other camera angles can be added here */}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Pencil className="h-4 w-4" /> Tema do Roteiro</Label>
          <Input placeholder="Ex: A história da inteligência artificial, Um dia na vida de um programador..." />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2"><Clock className="h-4 w-4" /> Duração do Vídeo</Label>
          <Select defaultValue="5">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5 minutos</SelectItem>
              <SelectItem value="10">10 minutos</SelectItem>
              <SelectItem value="15">15 minutos</SelectItem>
              <SelectItem value="20">20 minutos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="px-0 mt-4">
        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Gerar Roteiro Longo
        </Button>
      </CardFooter>
    </Card>
  );
}
