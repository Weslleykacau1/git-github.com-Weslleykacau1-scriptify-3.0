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
  sceneTitle: z.string().min(1, 'Scene title is required.'),
  sceneSetting: z.string().min(1, 'Scene setting is required.'),
  sceneAction: z.string().min(1, 'Scene action is required.'),
  cameraAngle: z.string().min(1, 'Camera angle is required.'),
  videoDuration: z.string().min(1, 'Video duration is required.'),
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
        title: 'Error generating media prompts',
        description: 'An error occurred while generating media prompts.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard!' });
  };

  return (
    <div className="flex flex-col h-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-grow flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
            <FormField control={form.control} name="sceneTitle" render={({ field }) => (
                <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="My New Setup" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="sceneSetting" render={({ field }) => (
                <FormItem><FormLabel>Setting</FormLabel><FormControl><Input placeholder="Minimalist desk" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="sceneAction" render={({ field }) => (
                <FormItem><FormLabel>Action</FormLabel><FormControl><Input placeholder="Assembling keyboard" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
             <FormField control={form.control} name="cameraAngle" render={({ field }) => (
                <FormItem><FormLabel>Camera Angle</FormLabel><FormControl><Input placeholder="Top-down" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="videoDuration" render={({ field }) => (
                <FormItem><FormLabel>Duration</FormLabel><FormControl><Input placeholder="30 seconds" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
            <FormField control={form.control} name="productDetails" render={({ field }) => (
                <FormItem><FormLabel>Product (Optional)</FormLabel><FormControl><Input placeholder="Keychron Q1" {...field} /></FormControl><FormMessage /></FormItem>
              )}
            />
          </div>
          <Button type="submit" disabled={isLoading} className="mt-auto">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Prompts
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
