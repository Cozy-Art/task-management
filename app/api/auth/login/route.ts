import { NextRequest, NextResponse } from 'next/server';

const VALID_PASSWORD = 'tothemoon';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (password === VALID_PASSWORD) {
      // Create response with authentication cookie
      const response = NextResponse.json({ success: true });

      // Set HTTP-only cookie that expires in 7 days
      response.cookies.set('auth', 'authenticated', {
        httpOnly: true,
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
