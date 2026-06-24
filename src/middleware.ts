import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all admin routes except login
  const isAdminRoute = pathname.includes('/admin') && !pathname.includes('/admin/login');

  if (isAdminRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      const matches = pathname.match(/^\/(en|ar)\//);
      const locale = matches ? matches[1] : 'en';
      
      const loginUrl = new URL(`/${locale}/admin/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
