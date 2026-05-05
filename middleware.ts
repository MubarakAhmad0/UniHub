import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

function isMobileDevice(userAgent: string): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent,
  );
}

export default async function authMiddleware(request: NextRequest) {
  // Bypass auth for public access testing
  if (process.env.ALLOW_PUBLIC_ACCESS === "true") {
    return NextResponse.next();
  }

  // Block mobile devices
  const userAgent = request.headers.get("user-agent") || "";
  if (
    isMobileDevice(userAgent) &&
    !request.nextUrl.pathname.startsWith("/desktop-only")
  ) {
    return NextResponse.redirect(new URL("/desktop-only", request.url));
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    if (request.nextUrl.pathname === "/florist") {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname === "/print") {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname === "/driver") {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname === "/driver/register") {
      return NextResponse.next();
    }

    if (request.nextUrl.pathname.startsWith("/florist")) {
      return NextResponse.redirect(new URL("/florist", request.url));
    } else if (request.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else if (request.nextUrl.pathname.startsWith("/driver")) {
      return NextResponse.redirect(new URL("/driver", request.url));
    } else if (request.nextUrl.pathname.startsWith("/print")) {
      return NextResponse.redirect(new URL("/print", request.url));
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/florist/:path*",
    "/admin/:path*",
    "/driver/:path*",
    "/print/:path*",
  ],
};
