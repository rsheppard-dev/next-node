import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/login', '/register', '/forgot-password'];
const privatePaths = ['/profile'];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
	const path = request.nextUrl.pathname;
	const isPublicPath = publicPaths.includes(path);
	const isPrivatePath = privatePaths.includes(path);
	const refreshToken = request.cookies.get('refreshToken')?.value;

	// user is already authenticated but trying to access a public path
	if (isPublicPath && refreshToken) {
		return NextResponse.redirect(new URL('/profile', request.nextUrl));
	}

	// user is not authenticated and trying to access a private path
	if (isPrivatePath && !refreshToken) {
		return NextResponse.redirect(new URL('/login', request.nextUrl));
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
