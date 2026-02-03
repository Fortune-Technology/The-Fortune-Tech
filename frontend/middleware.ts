import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin')) {
        // Get token from cookies
        const token = request.cookies.get('accessToken')?.value;

        if (!token) {
            // No token, redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Decode token to check role (basic JWT decode without verification)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));

            // Check if user has admin role
            if (payload.role !== 'admin' && payload.role !== 'super_admin') {
                // Not an admin, redirect to home
                return NextResponse.redirect(new URL('/', request.url));
            }
        } catch (error) {
            // Invalid token, redirect to login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: ['/admin/:path*']
};
