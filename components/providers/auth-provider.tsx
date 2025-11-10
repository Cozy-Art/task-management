'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    const authCookie = getCookie('auth');
    const authenticated = authCookie === 'authenticated';
    setIsAuthenticated(authenticated);

    // Define public paths
    const isLoginPage = pathname === '/login';

    // Redirect logic
    if (!authenticated && !isLoginPage) {
      router.push('/login');
    } else if (authenticated && isLoginPage) {
      router.push('/');
    }
  }, [pathname, router]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
