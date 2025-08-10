// src/components/features/propaganda-generator.tsx
'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Pencil, Image as ImageIcon, Rocket, Wand2, Megaphone, Sparkles, Copy, Info, Save, Library } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FileUploader } from '../ui/file-uploader';
import { generatePropagandaScript } from '@/ai/flows/script-generation/generate-propaganda-script';
import { generatePropagandaJsonScript } from '@/ai/flows/script-generation/generate-propaganda-json-script';
import { analyzeProductImage } from '@/ai/flows/analysis/analyze-product-image';
import { generateNarrationForPropaganda } from '@/ai/flows/script-generation/generate-narration-for-propaganda';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { generateSuperPrompt } from '@/ai/flows/script-generation/generate-super-prompt';
import type { Propaganda } from '@/lib/types';


const veo3ExampleJson = `{
  "metadata": {
    "project_name": "Comercial_Veo3_Exemplo",
    "duration_seconds": 32,
    "target_formats": ["9:16","16:9"],
    "notes": "Blocos ~8s. Ajuste duração de cada cena conforme necessário."
  },
  "scenes": [
    {
      "id": 1,
      "duration": 8,
      "frame": "close_up",
      "camera": {
        "type": "mirrorless_compact",
        "lens": "50mm_equiv",
        "movement": "slow_push_in_gimbal",
        "notes": "POV feel; leve handheld shake"
      },
      "talent": {
        "character": "Comediante",
        "expression": "surpreso/encantado",
        "action": "pega o produto e sorri para a câmera"
      },
      "dialogue": "Você não vai acreditar no que isso faz!",
      "effects": [
        "color_grade:high_saturation",
        "film_grain:light",
        "lens_flare:subtle"
      ],
      "sound": {
        "sfx": "whoosh_subtle",
        "music": "upbeat_intro",
        "vo_level": "clear"
      },
      "post_notes": "Adicionar kinetic_typography entrando pelo canto direito ao final (palavra: 'Incrível')."
    },
    {
      "id": 2,
      "duration": 8,
      "frame": "medium",
      "camera": {
        "type": "drone_or_gimbal_wide",
        "lens": "24mm_equiv",
        "movement": "arc_around_subject",
        "notes": "usar movimento leve de arco para revelar produto"
      },
      "talent": {
        "character": "Amigo",
        "expression": "confiante",
        "action": "aponta para o produto e faz gesto de 'você precisa disso'"
      },
      "dialogue": "Funciona em segundos — sério.",
      "effects": [
        "seamless_transition_in_from_previous",
        "color_pop:accent_orange"
      ],
      "sound": {
        "sfx": "impact_punch",
        "music": "build_beat"
      },
      "post_notes": "Inserir 3D_particle sparkles no produto (subtle)."
    },
    {
      "id": 3,
      "duration": 8,
      "frame": "product_close",
      "camera": {
        "type": "macro_lens",
        "lens": "85mm_macro_equiv",
        "movement": "rack_focus_from_product_to_hand",
        "notes": "foco racked para guiar atenção"
      },
      "talent": {
        "character": "Comediante",
        "expression": "satisfeito",
        "action": "mostra como usar o produto com close nas mãos"
      },
      "dialogue": "Viu? Fácil assim.",
      "effects": [
        "micro_vfx:3d_label_popout",
        "depth_of_field:shallow"
      ],
      "sound": {
        "sfx": "tap_and_swipe",
        "music": "main_loop"
      },
      "post_notes": "Adicionar kinetic_typography explicando '1 passo'."
    },
    {
      "id": 4,
      "duration": 8,
      "frame": "wide_scene",
      "camera": {
        "type": "cinema_camera",
        "lens": "35mm_equiv",
        "movement": "push_out_then_crane_up",
        "notes": "final reveal, sensação épica e engraçada"
      },
      "talent": {
        "character": "Todos",
        "expression": "riso coletivo",
        "action": "celebram, olhando para a câmera"
      },
      "dialogue": "Agora é sua vez — aproveite!",
      "effects": [
        "bold_color_grade",
        "final_glow",
        "vintage_texture_overlay:very_subtle"
      ],
      "sound": {
        "sfx": "crowd_cheer",
        "music": "outro_hook",
        "vo": "call_to_action_line"
      },
      "post_notes": "Corte para tela final com CTA, botão animado (kinetic), e versão curta do jingle."
    }
  ]
}`;

const superPromptExample = `{
  "description": "Cinematic close-up opens on a glowing horizontal red energy wave pulsing against a black void. The wave ripples with soft fizzing textures and microscopic bubbles. As the camera gently pulls back, the red wave curves and stretches, gradually revealing the shape of a classic Coca-Cola bottle formed entirely from glowing condensation lines and fizz trails. The silhouette is suspended mid-air, hyper-stylized but instantly recognizable. Suddenly, a stream of rich amber Coca-Cola pours from above, seamlessly filling the outline from bottom to top. The glowing fizz dissipates, revealing a fully rendered glass Coca-Cola bottle, cold and glistening with condensation. Subtle mist gathers at the base. No text.",
  "style": "cinematic, minimalist surrealism with crave realism",
  "camera": "close macro start, smooth dolly pullback to centered bottle reveal",
  "lighting": "black void with glowing red energy, internal light from bottle fizz, soft rim lights and condensation glow",
  "environment": "pure black stage with subtle reflective ground plane and ambient mist",
  "elements": [
    "glowing red horizontal fizz wave",
    "microbubbles and energy ripple texture",
    "Coca-Cola bottle outline forming from wave",
    "amber Coke stream pouring into fizz form",
    "bottle taking solid form from top-down",
    "realistic condensation and chill fog",
    "classic Coca-Cola bottle (glass, embossed logo, proper shape)"
  ],
  "motion": "energy wave pulses and curves into outline; Coke pours in; fizz dissolves into physical bottle; condensation builds",
  "ending": "fully formed Coca-Cola bottle centered on screen, glowing softly and fogged with chill, perfectly craveable",
  "audio": {
    "music": "subtle ambient pulse with rising fizz tones",
    "sfx": "micro fizz crackle, wave hum, Coke pour splash, chill hiss"
  },
  "text_overlay": "none",
  "format": "16:9",
  "keywords": [
    "Coca-Cola",
    "bottle reveal",
    "energy silhouette",
    "fizz-driven animation",
    "crave aesthetic",
    "macro realism",
    "minimalist surreal",
    "cold drink focus",
    "photoreal cinematic",
    "no text"
  ]
}`;

const productModelJson = `{
  "metadata": {
    "project_name": "Comercial_Produto_Modelo",
    "duration_seconds": 30,
    "aspect_ratio": "9:16",
    "notes": "Troque os valores conforme necessário"
  },
  "product": {
    "name": "NOME_DO_PRODUTO",
    "category": "CATEGORIA",
    "features": ["CARACTERÍSTICA_1", "CARACTERÍSTICA_2", "CARACTERÍSTICA_3"],
    "color_palette": ["#HEX1", "#HEX2", "#HEX3"]
  },
  "style": {
    "mood": ["divertido", "inspirador", "luxuoso"],
    "color_grade": ["high_saturation", "cinematic", "warm"],
    "music_style": ["upbeat_pop", "energetic_electronic", "soft_acoustic"]
  },
  "scenes": [
    {
      "id": 1,
      "duration": 8,
      "frame": ["close_up", "medium", "wide"],
      "camera": {
        "type": ["mirrorless", "cinema_camera", "smartphone_pro_mode"],
        "lens": ["50mm", "35mm", "24mm_wide"],
        "movement": ["slow_push_in", "arc_around_subject", "handheld_follow"],
        "notes": "Descreva o foco principal da cena"
      },
      "talent": {
        "character": "ATOR/ATRIZ/NARRADOR",
        "expression": ["feliz", "surpreso", "confiante"],
        "action": "AÇÃO_DA_PESSOA"
      },
      "dialogue": "TEXTO_FALADO",
      "effects": [
        "film_grain_light",
        "lens_flare_subtle",
        "depth_of_field_shallow",
        "seamless_transition"
      ],
      "sound": {
        "sfx": ["whoosh", "impact_punch", "sparkle"],
        "music": "OPÇÃO_ESCOLHIDA",
        "vo_level": "clear"
      },
      "post_notes": "Instruções extras para pós-produção"
    }
  ],
  "cta": {
    "text": "CHAMADA_PARA_AÇÃO_AQUI",
    "effects": ["kinetic_typography", "button_bounce"],
    "position": "bottom_center"
  }
}`;

interface PropagandaGeneratorProps {
    initialPropaganda?: Propaganda | null;
}

export function PropagandaGenerator({ initialPropaganda }: PropagandaGeneratorProps) {
  const [id, setId] = useState(initialPropaganda?.id || `prop_${Date.now()}`);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingNarration, setIsLoadingNarration] = useState(false);
  const [image, setImage] = useState(initialPropaganda?.image || null);
  const [productName, setProductName] = useState(initialPropaganda?.productName || '');
  const [targetAudience, setTargetAudience] = useState(initialPropaganda?.targetAudience || '');
  const [mainMessage, setMainMessage] = useState(initialPropaganda?.mainMessage || '');
  const [sceneFocus, setSceneFocus] = useState(initialPropaganda?.sceneFocus || '');
  const [talent, setTalent] = useState(initialPropaganda?.talent || 'none');
  const [narration, setNarration] = useState(initialPropaganda?.narration || '');
  const [tone, setTone] = useState(initialPropaganda?.tone ||'Criativo');
  const [voiceStyle, setVoiceStyle] = useState(initialPropaganda?.voiceStyle || 'Voz Masculina (Jovem)');
  const [duration, setDuration] = useState<'5s' | '8s'>(initialPropaganda?.duration || '8s');
  const [generatedScript, setGeneratedScript] = useState(initialPropaganda?.generatedScript || '');

  const { toast } = useToast();

  useEffect(() => {
    if (initialPropaganda) {
      setId(initialPropaganda.id || `prop_${Date.now()}`);
      setImage(initialPropaganda.image || null);
      setProductName(initialPropaganda.productName || '');
      setTargetAudience(initialPropaganda.targetAudience || '');
      setMainMessage(initialPropaganda.mainMessage || '');
      setSceneFocus(initialPropaganda.sceneFocus || '');
      setTalent(initialPropaganda.talent || 'none');
      setNarration(initialPropaganda.narration || '');
      setTone(initialPropaganda.tone || 'Criativo');
      setVoiceStyle(initialPropaganda.voiceStyle || 'Voz Masculina (Jovem)');
      setDuration(initialPropaganda.duration || '8s');
      setGeneratedScript(initialPropaganda.generatedScript || '');
    }
  }, [initialPropaganda]);

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  }

  const handleAnalyzeImage = async () => {
    if (!image) {
      toast({ title: 'Erro', description: 'Por favor, carregue uma imagem para analisar.', variant: 'destructive' });
      return;
    }
    setIsLoadingAnalysis(true);
    toast({ title: 'Analisando imagem...' });
    try {
      const result = await analyzeProductImage({ photoDataUri: image });
      setProductName(result.productName);
      setMainMessage(result.description);
      toast({ title: 'Análise concluída!', description: 'Os campos foram preenchidos com base na imagem.' });
    } catch (error) {
      console.error("Failed to analyze product image", error);
      toast({ title: 'Erro na análise', description: 'Não foi possível analisar a imagem.', variant: 'destructive' });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleGenerateNarration = async () => {
    if (!productName || !mainMessage || !tone) {
      toast({ title: 'Erro', description: 'Preencha o nome, mensagem e tom para gerar a narração.', variant: 'destructive' });
      return;
    }
    setIsLoadingNarration(true);
    toast({ title: 'Gerando narração...' });
    try {
      const result = await generateNarrationForPropaganda({
        productName: productName,
        mainMessage: mainMessage,
        tone: `${tone} (${voiceStyle})`,
      });
      setNarration(result.narration);
      toast({ title: 'Narração gerada com sucesso!' });
    } catch (error) {
      console.error("Failed to generate narration", error);
      toast({ title: 'Erro ao gerar narração', variant: 'destructive' });
    } finally {
      setIsLoadingNarration(false);
    }
  };

  const handleGenerate = async (format: 'markdown' | 'json' | 'super_prompt') => {
    if (!productName || (!targetAudience && format !== 'super_prompt') || !mainMessage) {
      toast({ title: 'Erro', description: 'Por favor, preencha todos os campos obrigatórios.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setGeneratedScript('');
    toast({ title: `Gerando propaganda em ${format}...` });
    
    try {
      let script;
      if (format === 'super_prompt') {
        const result = await generateSuperPrompt({
          productName,
          mainMessage,
          tone,
          narration: narration || undefined,
        });
        script = JSON.stringify(result, null, 2);
      } else if (format === 'json') {
          const result = await generatePropagandaJsonScript({
              productName,
              targetAudience,
              mainMessage,
              sceneFocus,
              tone: tone as any,
              duration,
              imagePrompt: image || undefined,
              narration: narration || undefined,
          });
          script = JSON.stringify(result, null, 2);
      } else {
           const result = await generatePropagandaScript({
              productName,
              targetAudience,
              mainMessage,
              sceneFocus,
              tone: tone as any,
              duration,
              imagePrompt: image || undefined,
              narration: narration || undefined,
          });
          script = result.script;
      }
      setGeneratedScript(script);
      toast({ title: 'Propaganda gerada com sucesso!' });
    } catch (error) {
      console.error(`Failed to generate propaganda script in ${format}`, error);
      toast({ title: 'Erro ao gerar roteiro', description: 'Ocorreu um erro ao comunicar com a IA.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

   const handleCopyJson = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: 'JSON copiado para a área de transferência!' });
  };
  
  const navigateToGallery = () => {
    const event = new CustomEvent('navigateToGallery', { detail: 'propaganda_gallery' });
    window.dispatchEvent(event);
  };

  const saveToGallery = () => {
    if (!productName || !generatedScript) {
        toast({ title: 'Faltam dados', description: 'É necessário um nome de produto e um roteiro gerado para guardar.', variant: 'destructive' });
        return;
    }

    const propagandaData: Propaganda = {
        id,
        productName,
        targetAudience,
        mainMessage,
        sceneFocus,
        talent,
        narration,
        tone,
        voiceStyle,
        duration,
        image,
        generatedScript,
    };

    try {
        const banco = JSON.parse(localStorage.getItem('studioBanco') || '{}');
        const propagandas = banco.propagandas || [];
        const existingIndex = propagandas.findIndex((p: Propaganda) => p.id === id);

        if (existingIndex > -1) {
            propagandas[existingIndex] = propagandaData;
        } else {
            propagandas.push(propagandaData);
        }

        banco.propagandas = propagandas;
        localStorage.setItem('studioBanco', JSON.stringify(banco));
        window.dispatchEvent(new Event('storage'));
        toast({ title: 'Propaganda guardada!', description: `"${productName}" foi guardado(a) na sua galeria.` });
    } catch (error) {
        console.error("Failed to save propaganda", error);
        toast({ title: 'Erro ao guardar propaganda', variant: 'destructive' });
    }
  };

  return (
    <div className="flex flex-col h-full w-full space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Megaphone className="h-6 w-6 text-primary" />
        </div>
        <div>
            <h2 className="text-xl font-bold font-headline">Gerador de Propaganda</h2>
            <p className="text-sm text-muted-foreground">
                Crie roteiros para anúncios de rádio, TV ou internet.
            </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="flex items-center gap-2"><ImageIcon className="h-4 w-4" /> Imagem do Produto (Opcional)</Label>
        <FileUploader onFileChange={setImage} file={image} />
         {image && (
            <Button onClick={handleAnalyzeImage} disabled={isLoadingAnalysis} className="mt-2 w-full">
                {isLoadingAnalysis ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analisar Imagem
            </Button>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="product-name">Nome do Produto/Serviço</Label>
        <Input id="product-name" placeholder="Ex: Copo Térmico Stanley" value={productName} onChange={(e) => setProductName(e.target.value)} />
      </div>

       <div className="space-y-1">
        <Label htmlFor="target-audience">Público-Alvo</Label>
        <Input id="target-audience" placeholder="Ex: Jovens de 18 a 25 anos, que gostam de aventura" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} />
      </div>

       <div className="space-y-1">
        <Label htmlFor="main-message">Mensagem Principal</Label>
        <Textarea id="main-message" placeholder="Ex: Mantém a sua bebida gelada por 24 horas" value={mainMessage} onChange={(e) => setMainMessage(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label htmlFor="scene-focus">Foco Principal da Cena</Label>
        <Textarea id="scene-focus" placeholder="Ex: Mostrar a resistência do produto em uma situação extrema." value={sceneFocus} onChange={(e) => setSceneFocus(e.target.value)} />
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="talent">Ator/Atriz/Narrador</Label>
        <Select value={talent} onValueChange={setTalent}>
            <SelectTrigger id="talent">
                <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="Ator">Ator</SelectItem>
                <SelectItem value="Atriz">Atriz</SelectItem>
                <SelectItem value="Narrador">Narrador</SelectItem>
                <SelectItem value="none">Nenhum/Não especificado</SelectItem>
            </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label htmlFor="tone">Tom</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Sério">Sério</SelectItem>
              <SelectItem value="Emocional">Emocional</SelectItem>
              <SelectItem value="Divertido">Divertido</SelectItem>
              <SelectItem value="Criativo">Criativo</SelectItem>
              <SelectItem value="Didático">Didático</SelectItem>
              <SelectItem value="Motivacional">Motivacional</SelectItem>
              <SelectItem value="Luxuoso">Luxuoso</SelectItem>
              <SelectItem value="Tecnológico">Tecnológico</SelectItem>
              <SelectItem value="Confiável">Confiável</SelectItem>
              <SelectItem value="Natural">Natural</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
              <SelectItem value="Calmo">Calmo</SelectItem>
              <SelectItem value="Jovem / Cool">Jovem / Cool</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="voice-style">Estilo de Voz</Label>
          <Select value={voiceStyle} onValueChange={setVoiceStyle}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="Voz Masculina (Jovem)">Voz Masculina (Jovem)</SelectItem>
                <SelectItem value="Voz Masculina (Madura)">Voz Masculina (Madura)</SelectItem>
                <SelectItem value="Voz Masculina (Grave/Séria)">Voz Masculina (Grave/Séria)</SelectItem>
                <SelectItem value="Voz Feminina (Jovem)">Voz Feminina (Jovem)</SelectItem>
                <SelectItem value="Voz Feminina (Madura)">Voz Feminina (Madura)</SelectItem>
                <SelectItem value="Voz Feminina (Suave/Calma)">Voz Feminina (Suave/Calma)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="duration">Duração</Label>
          <Select value={duration} onValueChange={(v) => setDuration(v as any)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5s">5 seg</SelectItem>
              <SelectItem value="8s">8 seg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
       <div className="space-y-1">
        <div className="flex justify-between items-center">
          <Label htmlFor="narration">Narração (Opcional)</Label>
           <Button variant="ghost" size="sm" onClick={handleGenerateNarration} disabled={isLoadingNarration}>
                {isLoadingNarration ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Gerar com IA
            </Button>
        </div>
        <Textarea id="narration" placeholder="Escreva a narração que você quer que a IA use como base..." value={narration} onChange={(e) => setNarration(e.target.value)} />
      </div>
      <div className="flex flex-col md:flex-row gap-2">
        <Button onClick={() => handleGenerate('markdown')} disabled={isLoading} size="lg" className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Rocket className="mr-2 h-4 w-4" />}
            Gerar Propaganda
        </Button>
         <Button onClick={() => handleGenerate('json')} disabled={isLoading} variant="outline" className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <span className="font-mono mr-2">{'{ }'}</span>
          )}
          Gerar em JSON (Veo 3)
        </Button>
        <Button onClick={() => handleGenerate('super_prompt')} disabled={isLoading} variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
             <Wand2 className="mr-2 h-4 w-4" />
          )}
          Gerar Super Prompt
        </Button>
      </div>

      {generatedScript && (
          <div className='space-y-4'>
              <Label>Roteiro Gerado</Label>
              <Textarea readOnly value={generatedScript} className='min-h-[250px] bg-muted' />
              <div className="flex flex-col sm:flex-row gap-2">
                  <Button onClick={saveToGallery} className="w-full sm:w-auto"><Save className="mr-2 h-4 w-4" /> Guardar na Galeria</Button>
                  <Button onClick={navigateToGallery} variant="outline" className="w-full sm:w-auto"><Library className="mr-2 h-4 w-4" /> Ver Galeria</Button>
              </div>
          </div>
      )}

       <Accordion type="single" collapsible className="w-full pt-4">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Tendências Rápidas para Comerciais</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm dark:prose-invert text-muted-foreground space-y-2">
                <p><strong className="text-foreground">Movimentos Dinâmicos e POV:</strong> Use gimbals, sliders e braços robóticos para criar imersão sem custos elevados. O Ponto de Vista (POV) é muito eficaz.</p>
                <p><strong className="text-foreground">Cores e Estilo Visual:</strong> Cores saturadas, grades ousadas e um look "analógico" (com grão e lens flare) chamam a atenção nos feeds.</p>
                <p><strong className="text-foreground">Transições Fluidas:</strong> "Morph cuts" e "seamless transitions" são ideais para anúncios curtos e motion design, criando um fluxo contínuo.</p>
                <p><strong className="text-foreground">Híbrido 3D e Live-Action:</strong> Integre motion graphics, como tipografia cinética e elementos 3D, para fazer o produto "saltar" da tela.</p>
                <p><strong className="text-foreground">Uso de IA:</strong> Acelere testes A/B com assistência de IA para edição, correção de cor e geração de variações de formato (vertical/horizontal).</p>
                <p><strong className="text-foreground">Dica de Formato:</strong> Para redes sociais, prefira o formato vertical (9:16) com cortes rápidos. Para TV/streaming, use 16:9 com planos mais abertos e cinematográficos.</p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Exemplo JSON (VEO 3)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
             <Alert>
                <AlertDescription>
                   Use este template como base. Cada cena tem duração, câmera, movimento, expressão, fala, efeitos e instruções para pós-produção. Copie e ajuste conforme necessário.
                </AlertDescription>
            </Alert>
            <div className="relative mt-2">
                 <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => handleCopyJson(veo3ExampleJson)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    <code>
                        {veo3ExampleJson}
                    </code>
                </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Exemplo Super Prompt (Coca-Cola)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
             <Alert>
                <AlertDescription>
                   Use este exemplo como inspiração para criar os seus próprios conceitos visuais de alto nível.
                </AlertDescription>
            </Alert>
            <div className="relative mt-2">
                 <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => handleCopyJson(superPromptExample)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    <code>
                        {superPromptExample}
                    </code>
                </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
         <AccordionItem value="item-4">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>Modelo Avançado de Produto (JSON)</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
             <Alert>
                <AlertDescription>
                    Este é um modelo estruturado para obter melhores resultados de consistência com a IA. Substitua os valores em maiúsculas (ex: NOME_DO_PRODUTO) pelos seus próprios dados.
                </AlertDescription>
            </Alert>
            <div className="relative mt-2">
                 <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => handleCopyJson(productModelJson)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-xs">
                    <code>
                        {productModelJson}
                    </code>
                </pre>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
