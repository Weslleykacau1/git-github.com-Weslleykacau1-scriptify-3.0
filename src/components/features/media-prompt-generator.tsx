'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { generateMediaPrompts, GenerateMediaPromptsOutput } from '@/ai/flows/generate-media-prompts';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  sceneTitle: z.string().min(1, 'O título da cena é obrigatório.'),
  sceneSetting: z.string().min(1, 'O cenário da cena é obrigatório.'),
  sceneAction: z.string().min(1, 'A ação da cena é obrigatória.'),
  cameraAngle: z.string().min(1, 'O ângulo da câmera é obrigatório.'),
  videoDuration: z.string().min(1, 'A duração do vídeo é obrigatória.'),
  productDetails: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function MediaPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompts, setPrompts] = useState<GenerateMediaPromptsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sceneTitle: '',
      sceneSetting: '',
      sceneAction: '',
      cameraAngle: '',
      videoDuration: '',
      productDetails: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setPrompts(null);
    try {
      const result = await generateMediaPrompts(values);
      setPrompts(result);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao gerar prompts de mídia',
        description: 'Ocorreu um erro ao gerar os prompts de mídia.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado para a área de transferência!' });
  };

  return (
    <div className="flex flex-col h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <FormField control={form.control} name="sceneTitle" render={({ field }) => (
                <FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="Meu Novo Setup" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="sceneSetting" render={({ field }) => (
                <FormItem><FormLabel>Cenário</FormLabel><FormControl><Input placeholder="Mesa minimalista" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="sceneAction" render={({ field }) => (
                <FormItem><FormLabel>Ação</FormLabel><FormControl><Input placeholder="Montando teclado" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
             <FormField control={form.control} name="cameraAngle" render={({ field }) => (
                <FormItem><FormLabel>Ângulo da Câmera</FormLabel><FormControl><Input placeholder="De cima para baixo" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="videoDuration" render={({ field }) => (
                <FormItem><FormLabel>Duração</FormLabel><FormControl><Input placeholder="30 segundos" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="productDetails" render={({ field }) => (
                <FormItem><FormLabel>Produto (Opcional)</FormLabel><FormControl><Input placeholder="Keychron Q1" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="mt-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Gerar Prompts
          </Button>
        </form>
      </Form>
      {prompts && (
        <div className="mt-4 space-y-2 overflow-y-auto">
          {Object.entries(prompts).map(([key, value]) => (
            <div key={key} className="space-y-1 relative">
              <Label htmlFor={key} className="capitalize text-xs text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</Label>
              <Textarea id={key} readOnly value={value} className="h-20 pr-10" />
              <Button variant="ghost" size="icon" className="absolute right-1 top-6 h-7 w-7" onClick={() => handleCopy(value)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
