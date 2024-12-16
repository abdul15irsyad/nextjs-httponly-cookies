import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { axiosBase } from './utils/axios';

export const middleware = async (request: NextRequest) => {
  const accessToken = request.cookies.get('accessToken')?.value;

  const protectedRoutes = ['/dashboard'];
  const unprotectedRoutes = ['/auth']; 

  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    try {
      await verifyAccessToken(accessToken)
    } catch {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  if (unprotectedRoutes.some((route) => pathname.startsWith(route))) {
    if (accessToken) {
      try {
        await verifyAccessToken(accessToken)
        return NextResponse.redirect(new URL('/dashboard', request.url));
      } catch {}
    }
  }

  return NextResponse.next();
}

const verifyAccessToken = async (accessToken: string) => {
  await axiosBase.get('/auth/user', { 
    headers: {
      Cookie: `accessToken=${accessToken}`
    },
    withCredentials: true 
  })
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*'],
};
