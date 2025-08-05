// src/components/no-ssr.tsx
'use client';

import React, { useState, useEffect } from 'react';

const NoSsr = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : null;
};

export default NoSsr;
