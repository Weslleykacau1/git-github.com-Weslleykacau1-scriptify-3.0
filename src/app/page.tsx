import { Header } from '@/components/header';
import { BentoGrid, BentoGridItem } from '@/components/bento-grid';
import { Bot, Clapperboard, FileText, ImageIcon, Rocket, Users, Video, GalleryVertical, MicVocal } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <BentoGrid>
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              className={item.className}
              icon={item.icon}
            >
              <div className="flex-grow flex items-center justify-center text-muted-foreground">
                {/* Componente será adicionado aqui */}
              </div>
            </BentoGridItem>
          ))}
        </BentoGrid>
      </main>
    </div>
  );
}

const items = [
  {
    title: 'Criador de Personagens e Cenas',
    description: 'A ferramenta principal para dar vida às suas ideias. Crie influenciadores e defina as cenas para os seus vídeos.',
    className: 'md:col-span-2 md:row-span-2',
    icon: <Bot className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Gerador de Roteiro Viral',
    description: 'Use a fórmula viral para criar roteiros curtos e de alto impacto para Shorts e TikTok.',
    className: 'md:col-span-1',
    icon: <Rocket className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Transcrever Vídeo',
    description: 'Transforme áudio de vídeos em texto para criar novos roteiros e conteúdos.',
    className: 'md:col-span-1',
    icon: <MicVocal className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Galeria de Cenas',
    description: 'Acesse e gerencie todas as suas cenas criadas.',
    className: 'md:col-span-1',
    icon: <Clapperboard className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Galeria de Personagens',
    description: 'Acesse e gerencie todos os seus personagens criados.',
    className: 'md:col-span-1',
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Gerador de Thumbnail',
    description: 'Crie thumbnails de alta qualidade para seus vídeos.',
    className: 'md:col-span-1',
    icon: <ImageIcon className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Gerador de Roteiro Detalhado',
    description: 'Crie roteiros completos, segundo a segundo, para seus vídeos.',
    className: 'md:col-span-2',
    icon: <FileText className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Analisador de Roteiro',
    description: 'Cole um roteiro para extrair prompts de mídia, SEO e ideias de thumbnail.',
    className: 'md:col-span-1',
    icon: <GalleryVertical className="h-6 w-6 text-primary" />,
  },
];
