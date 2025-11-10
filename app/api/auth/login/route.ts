import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    const VALID_PASSWORD = process.env.AUTH_PASSWORD;

    if (!VALID_PASSWORD) {
      console.error('AUTH_PASSWORD environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (password === VALID_PASSWORD) {
      // Create response with authentication cookie
      const response = NextResponse.json({ success: true });

      // Set cookie that can be read by client-side JavaScript
      response.cookies.set('auth', 'authenticated', {
        httpOnly: false, // Allow client-side reading
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      return response;
    }

    return NextResponse.json(
      { error: 'Invalid password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
