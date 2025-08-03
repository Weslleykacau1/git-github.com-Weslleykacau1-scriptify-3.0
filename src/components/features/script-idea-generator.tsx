'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { generateScriptIdeas } from '@/ai/flows/generate-script-ideas';
import { Label } from '../ui/label';

export function ScriptIdeaGenerator() {
  const [characterProfile, setCharacterProfile] = useState('');
  const [sceneDescription, setSceneDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scriptIdea, setScriptIdea] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterProfile || !sceneDescription) {
      toast({
        title: 'Error',
        description: 'Please fill in both character profile and scene description.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setScriptIdea('');

    try {
      const result = await generateScriptIdeas({ characterProfile, sceneDescription });
      setScriptIdea(result.scriptIdea);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error generating script idea',
        description: 'An error occurred while generating the script idea.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 flex-grow">
          <div className='space-y-1'>
            <Label htmlFor="char-profile">Character Profile</Label>
            <Textarea
              id="char-profile"
              placeholder="e.g., A charismatic vlogger..."
              value={characterProfile}
              onChange={(e) => setCharacterProfile(e.target.value)}
              className="h-24"
            />
          </div>
          <div className='space-y-1'>
            <Label htmlFor="scene-desc">Scene Description</Label>
            <Textarea
              id="scene-desc"
              placeholder="e.g., An unboxing video..."
              value={sceneDescription}
              onChange={(e) => setSceneDescription(e.target.value)}
              className="h-24"
            />
          </div>
        </div>
        <Button type="submit" disabled={isLoading} className="mt-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Idea
        </Button>
      </form>
      {scriptIdea && (
        <div className="mt-4 space-y-2">
            <Label>Generated Idea</Label>
          <Textarea readOnly value={scriptIdea} className="h-32 text-sm" />
        </div>
      )}
    </div>
  );
}
