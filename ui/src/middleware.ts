import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './services/session.services';

const publicPaths = [
	/^\/login$/,
	/^\/register(\/.*)?$/,
	/^\/forgot-password(\/.*)?$/,
];
const protectedPaths = [/^\/users(\/.*)?$/, /^\/groups(\/.*)?$/];

export async function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublicPath = publicPaths.some(pattern => pattern.test(path));
	const isProtectedPath = protectedPaths.some(pattern => pattern.test(path));

	const newToken = await updateSession();

	const response = NextResponse.next();

	if (newToken) {
		response.cookies.set({
			name: 'accessToken',
			value: newToken,
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 1000 * 60 * 15,
		});
	}

	const isLoggedIn = !!request.cookies.get('accessToken')?.value;

	// user is already authenticated but trying to access a public path
	if (isPublicPath && isLoggedIn) {
		return NextResponse.redirect(new URL('/users', request.nextUrl));
	}

	// user is not authenticated and trying to access a protected path
	if (isProtectedPath && !isLoggedIn) {
		return NextResponse.redirect(
			new URL(`/login?from=${encodeURIComponent(path)}`, request.nextUrl)
		);
	}

	return response;
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
