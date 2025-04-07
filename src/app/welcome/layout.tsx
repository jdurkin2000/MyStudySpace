// src/app/splash/layout.tsx
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Welcome!',
};

export default function SplashLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
