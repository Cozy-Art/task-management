import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';
import { TimerProvider } from '@/components/providers/timer-provider';

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
        <QueryProvider>
          <TimerProvider>{children}</TimerProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
