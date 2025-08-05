
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

export function PurchaseBanner() {
  return (
    <div className="bg-primary/10 text-primary-foreground p-4">
        <div className="container mx-auto">
            <Alert className="border-0 bg-transparent flex flex-col sm:flex-row items-center justify-between">
                <div className='flex items-center gap-4'>
                    <Rocket className="h-6 w-6 text-primary" />
                    <div>
                        <AlertTitle className="font-bold text-white">Desbloqueie todo o potencial!</AlertTitle>
                        <AlertDescription className="text-white/80">
                        O seu período de testes está a terminar. Continue a criar conteúdo incrível sem interrupções.
                        </AlertDescription>
                    </div>
                </div>
                <Button asChild className="mt-4 sm:mt-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a href="https://pay.cakto.com.br/6uv8krj_496356" target="_blank" rel="noopener noreferrer">
                        Comprar Agora
                    </a>
                </Button>
            </Alert>
        </div>
    </div>
  );
}
