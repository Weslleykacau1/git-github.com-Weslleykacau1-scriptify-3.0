// src/app/page.tsx
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { BentoGrid, BentoGridItem } from '@/components/bento-grid';
import { Bot, Clapperboard, FileText, ImageIcon, Rocket, Users, Video, GalleryVertical, MicVocal, ArrowLeft, Zap } from 'lucide-react';
import { CharacterProfileGenerator } from '@/components/features/character-profile-generator';
import { ScriptIdeaGenerator } from '@/components/features/script-idea-generator';
import { AdvancedScriptingTools } from '@/components/features/advanced-scripting-tools';
import { ThumbnailGenerator } from '@/components/features/thumbnail-generator';
import { CharacterGallery } from '@/components/features/character-gallery';
import { SceneGallery } from '@/components/features/scene-gallery';
import { Button } from '@/components/ui/button';
import { VideoTranscriber } from '@/components/features/video-transcriber';

type ActiveView = 'home' | 'creator' | 'viral' | 'transcribe' | 'scene_gallery' | 'character_gallery' | 'thumbnail' | 'advanced_script';

const featureComponents: Record<Exclude<ActiveView, 'home'>, React.ReactNode> = {
  creator: <CharacterProfileGenerator />,
  viral: <ScriptIdeaGenerator />,
  transcribe: <VideoTranscriber />,
  scene_gallery: <SceneGallery />,
  character_gallery: <CharacterGallery />,
  thumbnail: <ThumbnailGenerator />,
  advanced_script: <AdvancedScriptingTools />,
};

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('home');

  const items = [
    {
      id: 'creator' as ActiveView,
      title: 'Criador de Personagens e Cenas',
      description: 'A ferramenta principal para dar vida às suas ideias. Crie influenciadores e defina as cenas para os seus vídeos.',
      className: 'md:col-span-2 md:row-span-2',
      icon: <Bot className="h-6 w-6 text-primary" />,
      component: <CharacterProfileGenerator />,
    },
    {
      id: 'viral' as ActiveView,
      title: 'Gerador de Roteiro Viral',
      description: 'Use a fórmula viral para criar roteiros curtos e de alto impacto para Shorts e TikTok.',
      className: 'md:col-span-1',
      icon: <Rocket className="h-6 w-6 text-primary" />,
      component: <ScriptIdeaGenerator />,
    },
    {
      id: 'transcribe' as ActiveView,
      title: 'Transcrever Vídeo',
      description: 'Transforme áudio de vídeos em texto para criar novos roteiros e conteúdos.',
      className: 'md:col-span-1',
      icon: <FileText className="h-6 w-6 text-primary" />,
      component: <VideoTranscriber />,
    },
    {
      id: 'scene_gallery' as ActiveView,
      title: 'Galeria de Cenas',
      description: 'Acesse e gerencie todas as suas cenas criadas.',
      className: 'md:col-span-1',
      icon: <Clapperboard className="h-6 w-6 text-primary" />,
      component: <SceneGallery />,
    },
    {
      id: 'character_gallery' as ActiveView,
      title: 'Galeria de Personagens',
      description: 'Acesse e gerencie todos os seus personagens criados.',
      className: 'md:col-span-1',
      icon: <Users className="h-6 w-6 text-primary" />,
      component: <CharacterGallery />,
    },
    {
      id: 'thumbnail' as ActiveView,
      title: 'Gerador de Thumbnail',
      description: 'Crie thumbnails de alta qualidade para seus vídeos.',
      className: 'md:col-span-1',
      icon: <ImageIcon className="h-6 w-6 text-primary" />,
      component: <ThumbnailGenerator />,
    },
    {
      id: 'advanced_script' as ActiveView,
      title: 'Ferramentas de Roteiro Avançadas',
      description: 'Gere roteiros longos, para web docs, e transforme roteiros prontos em prompts de imagem e video.',
      className: 'md:col-span-2',
      icon: <Zap className="h-6 w-6 text-primary" />,
      component: <AdvancedScriptingTools />,
    },
  ];

  const handleNavigate = (view: ActiveView) => {
    setActiveView(view);
  };

  const renderContent = () => {
    if (activeView === 'home') {
      return (
        <BentoGrid>
          {items.map((item, i) => (
             <div key={i} className={item.className} onClick={() => handleNavigate(item.id)}>
                <BentoGridItem
                title={item.title}
                description={item.description}
                icon={item.icon}
                className="h-full"
                >
                <div className="flex-grow flex items-center justify-center text-muted-foreground opacity-0">
                    {/* Placeholder content to maintain layout */}
                    Placeholder
                </div>
                </BentoGridItem>
            </div>
          ))}
        </BentoGrid>
      );
    }
    return (
        <div className="bg-card border rounded-xl p-6 md:p-8">
             {featureComponents[activeView]}
        </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <Header>
        {activeView !== 'home' && (
            <Button variant="ghost" onClick={() => handleNavigate('home')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar à Tela Inicial
            </Button>
        )}
      </Header>
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
    </div>
  );
}
