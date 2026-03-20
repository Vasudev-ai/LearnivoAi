import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/signup/teacher",
  "/signup/student",
  "/onboarding",
  "/privacy",
  "/terms",
];

const PROTECTED_PATHS_PREFIXES = [
  "/dashboard",
  "/quiz-generator",
  "/lesson-planner",
  "/story-generator",
  "/visual-aids",
  "/math-helper",
  "/rubric-generator",
  "/debate-topic-generator",
  "/hyper-local-content",
  "/parent-communication",
  "/paper-digitizer",
  "/knowledge-base",
  "/library",
  "/workspace",
  "/profile",
  "/settings",
  "/support",
  "/backend",
];

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  const isProtectedPath = PROTECTED_PATHS_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  const isApiPath = pathname.startsWith("/api/");
  const isStaticPath = pathname.startsWith("/_next/") || 
                      pathname.startsWith("/favicon") ||
                      pathname.includes(".");

  if (isApiPath || isStaticPath) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get("session")?.value;

  if (isProtectedPath && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isPublicPath && sessionCookie && pathname !== "/") {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
};
