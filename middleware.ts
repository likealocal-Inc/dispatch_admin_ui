import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const needAuthPage = ["/sample/suspense"];

/**
 * https://nextjs.org/docs/advanced-features/middleware
 * 미들웨어
 * @param request
 */
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/sample")) {
    // return NextResponse.rewrite(new URL("/about-2", request.url));
  }
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.rewrite(new URL("/dashboard/user", request.url));
  }
}

// 미들웨어를 적용할 경로
export const config = {
  matcher: "/sample/:path*",
};
