
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { BentoGrid, BentoGridItem } from '@/components/bento-grid';
import { Bot, Clapperboard, FileText, ImageIcon, Rocket, Users, Zap, Box, ArrowLeft } from 'lucide-react';
import { CharacterProfileGenerator } from '@/components/features/character-profile-generator';
import { ScriptIdeaGenerator } from '@/components/features/script-idea-generator';
import { AdvancedScriptingTools } from '@/components/features/advanced-scripting-tools';
import { ThumbnailGenerator } from '@/components/features/thumbnail-generator';
import { CharacterGallery } from '@/components/features/character-gallery';
import { SceneGallery } from '@/components/features/scene-gallery';
import { Button } from '@/components/ui/button';
import { VideoTranscriber } from '@/components/features/video-transcriber';
import { ProductGallery } from '@/components/features/product-gallery';
import type { Character, Scene, Product } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { LoadingScreen } from '@/components/loading-screen';
import NoSsr from '@/components/no-ssr';


type ActiveView = 'home' | 'creator' | 'viral' | 'transcribe' | 'scene_gallery' | 'character_gallery' | 'product_gallery' | 'thumbnail' | 'advanced_script';

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [loadedCharacter, setLoadedCharacter] = useState<Character | null>(null);
  const [loadedScene, setLoadedScene] = useState<Scene | null>(null);
  const [loadedProduct, setLoadedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Inicializar banco se não existir
    if (!localStorage.getItem('studioBanco')) {
      const banco = {
        personagens: [],
        cenas: [],
        roteiros: [],
        produtos: [],
        thumbnails: [],
        configuracoes: {
          tema: 'escuro',
          idioma: 'pt-BR'
        }
      };
      localStorage.setItem('studioBanco', JSON.stringify(banco));
    }

    // Simulate initial app loading
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1500); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleLoadCharacter = (event: Event) => {
        const customEvent = event as CustomEvent<Character>;
        setLoadedCharacter(customEvent.detail);
        setActiveView('creator'); 
    };

    const handleLoadScene = (event: Event) => {
        const customEvent = event as CustomEvent<Scene>;
        setLoadedScene(customEvent.detail);
        setActiveView('creator');
    };

    const handleLoadProduct = (event: Event) => {
        const customEvent = event as CustomEvent<Product>;
        setLoadedProduct(customEvent.detail);
        setActiveView('creator'); 
    };

    const handleNavigateToGallery = (event: Event) => {
      const customEvent = event as CustomEvent<ActiveView>;
      setActiveView(customEvent.detail);
    };
    
    window.addEventListener('loadCharacter', handleLoadCharacter);
    window.addEventListener('loadScene', handleLoadScene);
    window.addEventListener('loadProduct', handleLoadProduct);
    window.addEventListener('navigateToGallery', handleNavigateToGallery);

    return () => {
        window.removeEventListener('loadCharacter', handleLoadCharacter);
        window.removeEventListener('loadScene', handleLoadScene);
        window.removeEventListener('loadProduct', handleLoadProduct);
        window.removeEventListener('navigateToGallery', handleNavigateToGallery);
    };
  }, []);


  const featureComponents: Record<Exclude<ActiveView, 'home'>, React.ReactNode> = {
    creator: <CharacterProfileGenerator key={`${loadedCharacter?.id}-${loadedScene?.id}-${loadedProduct?.id}`} initialCharacter={loadedCharacter} initialScene={loadedScene} initialProduct={loadedProduct} />,
    viral: <ScriptIdeaGenerator />,
    transcribe: <VideoTranscriber />,
    scene_gallery: <SceneGallery />,
    character_gallery: <CharacterGallery />,
    product_gallery: <ProductGallery />,
    thumbnail: <ThumbnailGenerator />,
    advanced_script: <AdvancedScriptingTools />,
  };

  const items = [
    {
      id: 'creator' as ActiveView,
      title: 'Criador de Personagens e Cenas',
      description: 'A ferramenta principal para dar vida às suas ideias. Crie influenciadores e defina as cenas para os seus vídeos.',
      mobileDescription: 'Crie personagens, influenciadores e cenas.',
      className: 'md:col-span-2 md:row-span-2',
      icon: <Bot className="h-6 w-6" />,
    },
    {
      id: 'viral' as ActiveView,
      title: 'Gerador de Roteiro Viral',
      description: 'Use a fórmula viral para criar roteiros curtos e de alto impacto para Shorts e TikTok.',
      mobileDescription: 'Crie roteiros curtos de alto impacto.',
      className: 'md:col-span-1',
      icon: <Rocket className="h-6 w-6" />,
    },
    {
      id: 'transcribe' as ActiveView,
      title: 'Transcrever Vídeo',
      description: 'Transforme áudio de vídeos em texto para criar novos roteiros e conteúdos.',
      mobileDescription: 'Transforme áudio de vídeos em texto.',
      className: 'md:col-span-1',
      icon: <FileText className="h-6 w-6" />,
    },
    {
      id: 'scene_gallery' as ActiveView,
      title: 'Galeria de Cenas',
      description: 'Acesse e gerencie todas as suas cenas criadas.',
      mobileDescription: 'Acesse e gerencie as suas cenas.',
      className: 'md:col-span-1',
      icon: <Clapperboard className="h-6 w-6" />,
    },
    {
      id: 'character_gallery' as ActiveView,
      title: 'Galeria de Personagens',
      description: 'Acesse e gerencie todos os seus personagens criados.',
      mobileDescription: 'Acesse e gerencie os seus personagens.',
      className: 'md:col-span-1',
      icon: <Users className="h-6 w-6" />,
    },
    {
      id: 'product_gallery' as ActiveView,
      title: 'Galeria de Produtos',
      description: 'Acesse e gerencie todos os seus produtos salvos.',
      mobileDescription: 'Acesse e gerencie os seus produtos.',
      className: 'md:col-span-1',
      icon: <Box className="h-6 w-6" />,
    },
    {
      id: 'thumbnail' as ActiveView,
      title: 'Gerador de Thumbnail',
      description: 'Crie thumbnails de alta qualidade para seus vídeos.',
      mobileDescription: 'Crie thumbnails de alta qualidade.',
      className: 'md:col-span-1',
      icon: <ImageIcon className="h-6 w-6" />,
    },
    {
      id: 'advanced_script' as ActiveView,
      title: 'Roteiros Avançados',
      description: 'Gere roteiros longos, para web docs, e transforme roteiros prontos em prompts de imagem e video.',
      mobileDescription: 'Gere roteiros longos e para web docs.',
      className: 'md:col-span-2',
      icon: <Zap className="h-6 w-6" />,
    },
  ];

  const handleNavigate = (view: ActiveView) => {
    // When navigating away from the creator, clear the loaded data
    if (activeView === 'creator') {
      setLoadedCharacter(null);
      setLoadedScene(null);
      setLoadedProduct(null);
    }
    setActiveView(view);
  };

  const renderContent = () => {
    if (!isClient) {
      return null;
    }

    if (activeView === 'home') {
      return (
        <div className="relative">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 bg-primary/30 blur-[100px] pointer-events-none -z-10" />
          <BentoGrid>
            {items.map((item) => (
               <div key={item.id} className={item.className} onClick={() => handleNavigate(item.id)}>
                  <BentoGridItem
                  title={isMobile && item.title.includes(' ') ? item.title.split(' ')[0] : item.title}
                  description={isMobile ? item.mobileDescription : item.description}
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
        </div>
      );
    }
    return (
        <div className="bg-card border rounded-xl p-4 md:p-8">
             {featureComponents[activeView]}
        </div>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NoSsr>
        <div className="min-h-screen w-full bg-background">
        <Header>
            {activeView !== 'home' && (
                <Button variant="ghost" onClick={() => handleNavigate('home')} size={isMobile ? "icon" : "default"}>
                    <ArrowLeft className={isMobile ? "h-5 w-5" : "mr-2 h-4 w-4"} />
                    {!isMobile && 'Voltar'}
                </Button>
            )}
        </Header>
        <main className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
        </main>
        </div>
    </NoSsr>
  );
}
