'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileInput, Image as ImageIcon, Video, Copy, Download, Search, Film } from 'lucide-react';
import { generateMediaPrompts, GenerateMediaPromptsOutput } from '@/ai/flows/generate-media-prompts';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';

const formSchema = z.object({
  script: z.string().min(1, 'O roteiro é obrigatório.'),
});

type FormData = z.infer<typeof formSchema>;

export function MediaPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateMediaPromptsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setResult(null);
    try {
      const generatedResult = await generateMediaPrompts(values);
      setResult(generatedResult);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro ao analisar roteiro',
        description: 'Ocorreu um erro ao gerar os prompts e ideias.',
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
    <Card className="bg-transparent border-none shadow-none">
        <CardHeader className="px-0">
            <div className="flex items-center gap-3">
                <FileInput className="h-6 w-6 text-primary" />
                <CardTitle className="m-0 text-xl font-bold font-headline">Analisador de Roteiro Existente</CardTitle>
            </div>
            <CardDescription>
                Cole um roteiro pronto para que a IA extraia prompts de imagem e vídeo para cada cena, além de gerar SEO e ideias de thumbnail.
            </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
                control={form.control}
                name="script"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Roteiro</FormLabel>
                    <FormControl>
                    <Textarea
                        placeholder="Cole o seu roteiro aqui..."
                        className="min-h-[150px]"
                        {...field}
                    />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Analisar Roteiro e Gerar
            </Button>
            </form>
        </Form>
        {isLoading && (
            <div className="mt-6 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}
        {result && (
            <div className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className='text-lg'>Prompts Gerados por Cena</CardTitle>
                        <div className="flex gap-2">
                           <Button variant="outline" size="sm"><Search className="mr-2"/>Gerar SEO</Button>
                           <Button variant="outline" size="sm"><Film className="mr-2"/>Gerar Thumbnail</Button>
                           <Button variant="outline" size="sm"><Download className="mr-2"/>Exportar</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {result.scenes.map((scene, index) => (
                            <div key={index} className="border bg-card p-4 rounded-lg space-y-4">
                                <h4 className="font-semibold">{scene.sceneTitle}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <ImageIcon className="h-4 w-4 text-primary" />
                                            <span>Prompt de Imagem (EN)</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{scene.imagePrompt}</p>
                                        <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.imagePrompt)}>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copiar
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm font-medium">
                                            <Video className="h-4 w-4 text-primary" />
                                            <span>Prompt de Vídeo (EN)</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{scene.videoPrompt}</p>
                                        <Button variant="ghost" size="sm" onClick={() => handleCopy(scene.videoPrompt)}>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copiar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Ideias para Thumbnail</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{result.thumbnailIdeas}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className='text-lg'>Palavras-chave de SEO</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{result.seoKeywords}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}
    </Card>
  );
}
