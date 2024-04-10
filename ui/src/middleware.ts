import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = [
	/^\/login$/,
	/^\/register(\/.*)?$/,
	/^\/forgot-password(\/.*)?$/,
];
const protectedPaths = [/^\/user(\/.*)?$/];

export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublicPath = publicPaths.some(pattern => pattern.test(path));
	const isProtectedPath = protectedPaths.some(pattern => pattern.test(path));
	const refreshToken = request.cookies.get('refreshToken')?.value;

	// user is already authenticated but trying to access a public path
	if (isPublicPath && refreshToken) {
		return NextResponse.redirect(new URL('/user', request.nextUrl));
	}

	// user is not authenticated and trying to access a protected path
	if (isProtectedPath && !refreshToken) {
		return NextResponse.redirect(
			new URL(`/login?from=${encodeURIComponent(path)}`, request.nextUrl)
		);
	}
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
