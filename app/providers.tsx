'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NuqsAdapter>
      <ConvexProvider client={convex}>{children}</ConvexProvider>
    </NuqsAdapter>
  );
}
