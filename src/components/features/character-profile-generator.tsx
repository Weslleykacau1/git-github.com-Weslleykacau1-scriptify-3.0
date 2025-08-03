'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { generateCharacterProfile, GenerateCharacterProfileOutput } from '@/ai/flows/generate-character-profile';
import { FileUploader } from '@/components/ui/file-uploader';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '../ui/textarea';

export function CharacterProfileGenerator() {
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [textDescription, setTextDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<GenerateCharacterProfileOutput | null>(null);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('image');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'image' && !photoDataUri) {
      toast({
        title: 'Erro',
        description: 'Por favor, envie uma imagem.',
        variant: 'destructive',
      });
      return;
    }

    if (activeTab === 'text' && !textDescription) {
        toast({
          title: 'Erro',
          description: 'Por favor, insira uma descrição de texto.',
          variant: 'destructive',
        });
        return;
      }

    setIsLoading(true);
    setProfile(null);

    try {
      const input = activeTab === 'image' 
        ? { photoDataUri: photoDataUri! }
        : { textDescription };
      const result = await generateCharacterProfile(input);
      setProfile(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao gerar perfil',
        description: 'Ocorreu um erro ao gerar o perfil do personagem.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado para a área de transferência!' });
  }

  const isSubmitDisabled = 
    (activeTab === 'image' && !photoDataUri) || 
    (activeTab === 'text' && !textDescription) || 
    isLoading;


  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="image">Imagem</TabsTrigger>
            <TabsTrigger value="text">Texto</TabsTrigger>
        </TabsList>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            <TabsContent value="image" className="m-0">
                <FileUploader onFileChange={setPhotoDataUri} file={photoDataUri} />
            </TabsContent>
            <TabsContent value="text" className="m-0">
                <Textarea
                    placeholder="Cole a descrição do personagem aqui..."
                    value={textDescription}
                    onChange={(e) => setTextDescription(e.target.value)}
                    className="h-[214px]"
                />
            </TabsContent>
            <Button type="submit" disabled={isSubmitDisabled} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Perfil
            </Button>
        </form>
      </Tabs>


      {profile && (
        <div className="mt-4 overflow-y-auto space-y-4">
            {Object.entries(profile).map(([key, value]) => (
                 <div key={key} className="space-y-1 relative">
                    <Label htmlFor={key} className="capitalize text-xs text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</Label>
                    <Input id={key} readOnly value={value} className="pr-10"/>
                    <Button variant="ghost" size="icon" className="absolute right-1 top-5 h-7 w-7" onClick={() => handleCopy(value)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </Button>
                 </div>
            ))}
        </div>
      )}
    </div>
  );
}
