import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { TimerProvider } from '@/components/providers/timer-provider';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Priority & Time Management',
  description: 'A daily focus dashboard integrated with Todoist for managing time across projects',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <QueryProvider>
            <TimerProvider>{children}</TimerProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
