import { NextRequest, NextResponse } from "next/server";
import { authConfig } from "./app/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const session = await auth();
  const isAuthenticated = !!session?.user;
  console.log(isAuthenticated, pathname);

  // does anything else go in here??
  const publicPaths = ["/", "/api/widgets"];

  if (!isAuthenticated && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/add-widget/:path*", "/whiteboard/:path*"],
};

export default middleware;
