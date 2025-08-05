
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Key } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const VALID_KEYS = [
    '2T4Y-6U8I-9O1P-3A5S',
    '7D9F-1G2H-3J4K-5L6M',
    '8N0B-2V3C-4X5Z-7M6N',
    '1Q2W-3E4R-5T6Y-7U8I'
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
                    <Button onClick={checkKey} className="w-full">
                        <Key className="mr-2 h-4 w-4" />
                        Ativar
                    </Button>
                    {error && <p className="text-sm text-destructive text-center">{error}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
