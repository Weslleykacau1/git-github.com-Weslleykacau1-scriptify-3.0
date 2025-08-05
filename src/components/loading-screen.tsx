
'use client';

import { Logo } from "./logo";

export function LoadingScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 w-full h-full bg-primary/20 blur-[150px] z-0" />
        <div className="animate-pulse z-10">
            <Logo className="w-48 h-48 text-white" />
        </div>
    </div>
  );
}
