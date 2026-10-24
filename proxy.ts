import { NextResponse, NextRequest } from 'next/server';
import { SupportedLanguages, DEFAULT_LOCALE, Locale } from '@/locales/config';

const LOCALE_REGEX = new RegExp(`^/(${SupportedLanguages.join('|')})(/.*)?$`);

function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set('preferred-locale', locale, {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  });
}

function createRedirectResponse(url: URL, locale: Locale) {
  const response = NextResponse.redirect(url);
  setLocaleCookie(response, locale);
  return response;
}

function getPreferredLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('preferred-locale')?.value as Locale;
  if (cookieLocale && SupportedLanguages.includes(cookieLocale)) {
    return cookieLocale;
  }
  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const url = request.nextUrl.clone();

  // 解析当前路径中的语言信息
  const localeMatch = pathname.match(LOCALE_REGEX);
  const currentUrlLocale = localeMatch?.[1] as Locale | null;

  // 获取用户偏好语言
  const preferredLocale = getPreferredLocale(request);

  // 情况1：根路径或无语言前缀 -> 重定向到偏好语言
  if (pathname === '/' || !currentUrlLocale) {
    url.pathname = `/${preferredLocale}${pathname}`;
    return createRedirectResponse(url, preferredLocale);
  }

  // Only document visits should update the preference; route prefetches must not.
  if (
    request.headers.get('sec-fetch-dest') === 'document' &&
    request.cookies.get('preferred-locale')?.value !== currentUrlLocale
  ) {
    const response = NextResponse.next();
    setLocaleCookie(response, currentUrlLocale);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // 排除api路由、静态文件、带扩展名的文件、Next.js内部文件
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
