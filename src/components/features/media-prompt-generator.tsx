'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, FileInput } from 'lucide-react';
import { generateMediaPrompts, GenerateMediaPromptsOutput } from '@/ai/flows/generate-media-prompts';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';

const formSchema = z.object({
  script: z.string().min(1, 'O roteiro é obrigatório.'),
});

type FormData = z.infer<typeof formSchema>;

export function MediaPromptGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompts, setPrompts] = useState<GenerateMediaPromptsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      script: '',
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    setPrompts(null);
    try {
        // This is a placeholder for the actual AI call which is not yet implemented.
        // We will replace this with a call to a new Genkit flow in the future.
      const result: GenerateMediaPromptsOutput = await new Promise(resolve => setTimeout(() => resolve({
        imagePrompt: `An image prompt based on: ${values.script.substring(0, 50)}...`,
        videoPrompt: `A video prompt based on: ${values.script.substring(0, 50)}...`,
        seoKeywords: "keyword1, keyword2, keyword3",
        thumbnailIdeas: `A thumbnail idea based on the script.`
      }), 1000));
      setPrompts(result);
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
        {prompts && (
            <div className="mt-6 space-y-4">
            {Object.entries(prompts).map(([key, value]) => (
                <div key={key} className="space-y-1 relative">
                <Label htmlFor={key} className="capitalize text-xs text-muted-foreground">{key.replace(/([A-Z])/g, ' $1')}</Label>
                <Textarea id={key} readOnly value={value} className="h-24 pr-10" />
                <Button variant="ghost" size="icon" className="absolute right-1 top-6 h-7 w-7" onClick={() => handleCopy(value)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </Button>
                </div>
            ))}
            </div>
        )}
    </Card>
  );
}