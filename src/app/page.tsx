import { Header } from '@/components/header';
import { BentoGrid, BentoGridItem } from '@/components/bento-grid';
import { CharacterProfileGenerator } from '@/components/features/character-profile-generator';
import { ScriptIdeaGenerator } from '@/components/features/script-idea-generator';
import { ContentSuggester } from '@/components/features/content-suggester';
import { MediaPromptGenerator } from '@/components/features/media-prompt-generator';
import { Bot, Clapperboard, FileText, ImageIcon } from 'lucide-react';

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
              {item.component}
            </BentoGridItem>
          ))}
        </BentoGrid>
      </main>
    </div>
  );
}

const items = [
  {
    title: 'Personagem a Partir de Imagem',
    description: 'Gere um perfil de personagem a partir de uma imagem.',
    component: <CharacterProfileGenerator />,
    className: 'md:col-span-2',
    icon: <Bot className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Gerador de Ideias de Roteiro',
    description: 'Brainstorm de novas ideias para roteiros.',
    component: <ScriptIdeaGenerator />,
    className: 'md:col-span-1',
    icon: <FileText className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Gerador de Prompts de Mídia',
    description: 'Gere prompts para imagens e vídeos.',
    component: <MediaPromptGenerator />,
    className: 'md:col-span-1',
    icon: <ImageIcon className="h-6 w-6 text-primary" />,
  },
  {
    title: 'Sugestão de Conteúdo',
    description: 'Obtenha sugestões de IA para títulos e diálogos.',
    component: <ContentSuggester />,
    className: 'md:col-span-2',
    icon: <Clapperboard className="h-6 w-6 text-primary" />,
  },
];
