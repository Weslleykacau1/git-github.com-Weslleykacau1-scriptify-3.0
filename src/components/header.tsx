import { BrainCircuit } from "lucide-react";

export function Header({children}: {children?: React.ReactNode}) {
  return (
    <header className="p-4 sm:p-6 lg:p-8 border-b border-white/[0.1]">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-white">Scriptify Studio AI</h1>
        </div>
        <div>
            {children}
        </div>
      </div>
    </header>
  );
}
