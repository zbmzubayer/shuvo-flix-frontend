import { type NextFetchEvent, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import withAuth, { type NextRequestWithAuth } from "next-auth/middleware";

import { ENV_SERVER } from "@/config/env-server";

const AUTH_ROUTES = ["/"];

export default async function middleware(
  req: NextRequestWithAuth,
  event: NextFetchEvent
) {
  const { pathname } = req.nextUrl;

  if (AUTH_ROUTES.includes(pathname)) {
    const token = await getToken({ req, secret: ENV_SERVER.AUTH_SECRET });
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    // return NextResponse.next();
  }
  // } else if (ADMIN_ROUTES.includes(pathname)) {
  //   const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  //   if (token && token.role === USER_ROLE.SUB_ADMIN) {
  //     return NextResponse.redirect(new URL("/admin/advertisement", req.nextUrl));
  //   }
  // }
  // if (PUBLIC_ROUTES.includes(pathname)) return NextResponse.next();

  // // if pathname starts expect /admin and not in AUTH_ROUTES
  // if (!pathname.startsWith("/admin")) return NextResponse.next();

  // Continue with the NextAuth middleware
  return withAuth({
    secret: ENV_SERVER.AUTH_SECRET,
    pages: { signIn: "/", error: "/" },
  })(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
