
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Key, LifeBuoy, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const VALID_KEYS = [
    'ABCD-1234-EFGH-5678',
    'WXYZ-9876-LMNQ-4321',
    'VIP-2025-ACESSO-LIB'
];

export default function ActivationPage() {
    const [activationKey, setActivationKey] = useState('');
    const [error, setError] = useState('');
    const { toast } = useToast();
    const router = useRouter();

    const checkKey = () => {
        if (VALID_KEYS.includes(activationKey.trim().toUpperCase())) {
            localStorage.setItem('studioActivationKey', activationKey.trim().toUpperCase());
            toast({
                title: 'Ativação bem-sucedida!',
                description: 'Bem-vindo ao Scriptify Studio AI.',
            });
            router.push('/');
        } else {
            setError('Chave de ativação inválida. Por favor, tente novamente.');
        }
    };

    return (
        <div className="min-h-screen w-full bg-background flex items-center justify-center p-4">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-48 bg-primary/30 blur-[150px] pointer-events-none -z-10" />
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
                      <BrainCircuit className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold font-headline">Scriptify Studio AI</CardTitle>
                    <CardDescription>
                        Por favor, insira a sua chave de ativação para continuar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Input 
                            type="text" 
                            id="activationKey" 
                            placeholder="Ex: ABCD-1234-EFGH-5678" 
                            value={activationKey}
                            onChange={(e) => {
                                setActivationKey(e.target.value);
                                if (error) setError('');
                            }}
                        />
                    </div>
                    <div className="space-y-2">
                        <Button onClick={checkKey} className="w-full">
                            <Key className="mr-2 h-4 w-4" />
                            Ativar
                        </Button>
                        <Button variant="secondary" className="w-full" asChild>
                           <a href="https://pay.kiwify.com.br/yQ6y5GZ" target="_blank" rel="noopener noreferrer">
                             <ShoppingCart className="mr-2 h-4 w-4" />
                             Adquirir Chave
                           </a>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <a href="https://wa.me/5541998136317" target="_blank" rel="noopener noreferrer">
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                Suporte via WhatsApp
                            </a>
                        </Button>
                    </div>
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
