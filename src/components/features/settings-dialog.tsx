
// src/components/features/settings-dialog.tsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sun, Moon, Monitor, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type Theme = 'light' | 'dark' | 'system';

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const [theme, setTheme] = useState<Theme>('dark');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
        try {
            const banco = JSON.parse(localStorage.getItem('studioBanco') || '{}');
            setTheme(banco.configuracoes?.tema || 'dark');
        } catch (error) {
            console.error("Failed to load settings from localStorage", error);
        }
    }
  }, [isOpen]);
  
  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);

    try {
        const banco = JSON.parse(localStorage.getItem('studioBanco') || '{}');
        if (!banco.configuracoes) {
            banco.configuracoes = {};
        }
        banco.configuracoes.tema = newTheme;
        localStorage.setItem('studioBanco', JSON.stringify(banco));

        if (newTheme === 'system') {
            const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.classList.toggle('dark', systemIsDark);
        } else {
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }

        toast({ title: "Aparência atualizada!" });
    } catch(error) {
        console.error("Failed to save theme", error);
        toast({ title: "Erro ao guardar o tema", variant: 'destructive'});
    }
  }

  const handleDeactivate = () => {
    localStorage.removeItem('studioActivationKey');
    toast({ title: "Chave de ativação removida.", description: "Você será redirecionado para a página de ativação." });
    onOpenChange(false); // Close dialog
    router.push('/ativacao');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground">Aparência</h4>
            <div className="grid grid-cols-3 gap-4">
                <button
                    onClick={() => handleThemeChange('light')}
                    className={cn(
                        'flex flex-col items-center justify-center gap-2 rounded-md border-2 p-4 transition-colors',
                        theme === 'light' ? 'border-primary' : 'border-border'
                    )}
                >
                    <div className="h-12 w-20 rounded-md bg-zinc-100 flex items-center justify-center shadow-inner">
                       <Sun className="h-6 w-6 text-zinc-600"/>
                    </div>
                    <span className="text-sm">Claro</span>
                </button>
                <button
                    onClick={() => handleThemeChange('dark')}
                    className={cn(
                        'flex flex-col items-center justify-center gap-2 rounded-md border-2 p-4 transition-colors',
                        theme === 'dark' ? 'border-primary' : 'border-border'
                    )}
                >
                    <div className="h-12 w-20 rounded-md bg-zinc-900 flex items-center justify-center shadow-inner">
                        <Moon className="h-6 w-6 text-zinc-400"/>
                    </div>
                    <span className="text-sm">Escuro</span>
                </button>
                 <button
                    onClick={() => handleThemeChange('system')}
                    className={cn(
                        'flex flex-col items-center justify-center gap-2 rounded-md border-2 p-4 transition-colors',
                        theme === 'system' ? 'border-primary' : 'border-border'
                    )}
                >
                    <div className="h-12 w-20 rounded-md bg-zinc-500 flex items-center justify-center shadow-inner">
                       <Monitor className="h-6 w-6 text-white"/>
                    </div>
                    <span className="text-sm">Sistema</span>
                </button>
            </div>
          </div>
           <div className="space-y-3">
             <h4 className="font-medium text-sm text-muted-foreground">Licença</h4>
             <Button variant="destructive" onClick={handleDeactivate} className="w-full">
                <Key className="mr-2 h-4 w-4" />
                Remover Chave de Ativação
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
