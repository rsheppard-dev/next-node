import { NextRequest, NextResponse } from 'next/server';
import {
	deleteSession,
	getSession,
	updateSession,
} from './actions/session.actions';

const authPaths = [
	/^\/login$/,
	/^\/register(\/.*)?$/,
	/^\/forgot-password(\/.*)?$/,
];

const publicPaths = ['/'];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isAuthPath = authPaths.some(pattern => pattern.test(path));
	const isPublicPath = publicPaths.includes(path);

	const next = NextResponse.next();

	const session = await getSession();

	const now = new Date();
	const expiresIn = new Date(session.tokenExpiry);
	const isExpired = expiresIn < now;

	try {
		if (session.isLoggedIn && isExpired) {
			const newSession = await updateSession(session);

			if (newSession) {
				next.cookies.set({
					name: 'sg.session',
					value: newSession,
				});
			} else {
				await deleteSession(session.id);
				next.cookies.delete('sg.session');
				NextResponse.redirect(new URL('/login', req.nextUrl));
			}
		}
	} catch (error) {
		console.log(error);
	}

	// user is trying to access a public path
	if (isPublicPath) return next;

	// user is already authenticated but trying to access a auth path
	if (isAuthPath && session.isLoggedIn) {
		return NextResponse.redirect(new URL('/', req.nextUrl));
	}

	// user is not authenticated and trying to access a protected path
	if (!isAuthPath && !session.isLoggedIn) {
		return NextResponse.redirect(
			new URL(`/login?from=${encodeURIComponent(path)}`, req.nextUrl)
		);
	}

	return next;
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
