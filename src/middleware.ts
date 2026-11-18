import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bỏ qua các file tĩnh, ảnh, favicon và endpoint Webhook ngân hàng
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/webhooks') ||
    pathname === '/access' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Kiểm tra cookie đã nhập mã PIN chưa
  const isPinVerified = request.cookies.get('app_pin_verified')?.value;

  if (isPinVerified !== 'true') {
    const accessUrl = new URL('/access', request.url);
    accessUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(accessUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
