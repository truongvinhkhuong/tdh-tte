import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n, isValidLocale } from '@/i18n/config';

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if pathname is missing locale
    const pathnameIsMissingLocale = i18n.locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Skip for static files and API routes
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // files with extensions
    ) {
        return NextResponse.next();
    }

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        const locale = i18n.defaultLocale;

        return NextResponse.redirect(
            new URL(
                `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
                request.url
            )
        );
    }

    // Check if the locale in pathname is valid
    const segments = pathname.split('/');
    const localeInPath = segments[1];

    if (localeInPath && !isValidLocale(localeInPath)) {
        return NextResponse.redirect(
            new URL(`/${i18n.defaultLocale}${pathname}`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
