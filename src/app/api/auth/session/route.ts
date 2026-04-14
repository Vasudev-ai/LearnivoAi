import { NextResponse } from 'next/server';
import { getAdminApp } from '@/firebase/server-app';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: Request) {
  let idToken: string;
  try {
    const body = await request.json();
    idToken = body.idToken;
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!idToken) {
    return NextResponse.json({ error: 'Missing ID Token' }, { status: 400 });
  }

  try {
    const adminApp = getAdminApp();
    const adminAuth = getAuth(adminApp);
    
    // Set session expiration to 5 days
    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    // Verify token and create session cookie
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);
    
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    
    // Set cookie
    response.cookies.set('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    response.cookies.set('userId', decodedIdToken.uid, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',  
    });

    return response;
  } catch (error: any) {
    console.error('Session Cookie Error:', error.message || error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ status: 'success' }, { status: 200 });
  response.cookies.set('session', '', { maxAge: -1, path: '/' });
  response.cookies.set('userId', '', { maxAge: -1, path: '/' });
  return response;
}
