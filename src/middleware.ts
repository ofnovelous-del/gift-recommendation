import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/config';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export default function middleware(request: NextRequest) {
  // In mock mode, only apply i18n middleware (no auth checks)
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
