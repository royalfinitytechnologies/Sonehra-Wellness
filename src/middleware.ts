import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Check if user is authenticated (simple cookie-based check)
  const isAuthenticated = request.cookies.get("authenticated")?.value === "true";

  // Protected routes logic
  const isProtectedPage =
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/receipt");

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup");

  if (isProtectedPage && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
