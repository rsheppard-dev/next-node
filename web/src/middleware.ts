import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './actions/session.actions';

const authPaths = [
	/^\/login$/,
	/^\/register(\/.*)?$/,
	/^\/forgot-password(\/.*)?$/,
];

const publicPaths = ['/'];

export default function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isAuthPath = authPaths.some(pattern => pattern.test(path));
	const isPublicPath = publicPaths.includes(path);

	// user is trying to access a public path
	if (isPublicPath) return NextResponse.next();

	const isLoggedIn = req.cookies.has('auth_session');

	// user is already authenticated but trying to access an auth path
	if (isAuthPath && isLoggedIn) {
		return NextResponse.redirect(new URL('/', req.nextUrl));
	}

	// user is not authenticated and trying to access a protected path
	if (!isAuthPath && !isLoggedIn) {
		return NextResponse.redirect(
			new URL(`/login?from=${encodeURIComponent(path)}`, req.nextUrl)
		);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
