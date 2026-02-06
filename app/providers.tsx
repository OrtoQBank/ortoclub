'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactNode } from 'react';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider afterSignInUrl="/admin" signInFallbackRedirectUrl="/admin">
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <NuqsAdapter>
          {children}
        </NuqsAdapter>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
