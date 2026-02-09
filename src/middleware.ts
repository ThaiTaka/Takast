import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Protect /studio routes - chỉ cho AUTHOR
  if (request.nextUrl.pathname.startsWith('/studio')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if ((token as any).role !== 'AUTHOR') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/studio/:path*'],
};
