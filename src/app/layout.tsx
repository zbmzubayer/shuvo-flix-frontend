import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ThemeProvider } from '@/contexts/theme-provider';

import '@/styles/globals.css';

import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { TanstackQueryProvider } from '@/contexts/query-client-provider';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Shuvo Flix',
  description: 'Shuvo flix admin panel',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <TanstackQueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </TanstackQueryProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
