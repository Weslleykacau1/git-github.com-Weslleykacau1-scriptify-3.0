"use client";

import { cn } from "@/lib/utils";

const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoGridItem = ({
  className,
  title,
  description,
  icon,
  children,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-6 bg-card border border-transparent justify-between flex flex-col space-y-4 cursor-pointer",
        className
      )}
    >
      <div className="flex flex-col space-y-4 h-full">
        <div className="space-y-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {icon}
              </div>
              <h3 className="font-headline text-xl font-bold text-white">
                {title}
              </h3>
            </div>
            <p className="font-sans font-normal text-sm text-neutral-400">
              {description}
            </p>
        </div>
        <div className="flex-grow flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};

export { BentoGrid, BentoGridItem };
