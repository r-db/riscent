import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/behind-the-curtain",
  "/docs(.*)",
  "/case-study(.*)",
  "/documents(.*)",
  "/research(.*)",
  "/thoughts(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/api/visitor/(.*)",
  "/api/seq/chat",
  "/api/health",
  "/api/research/(.*)",
  "/api/webhooks/(.*)",
]);

// CMS routes require authentication (admin check happens in API/pages)
const isCMSRoute = createRouteMatcher([
  "/cms(.*)",
  "/api/cms/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const url = new URL(request.url);

  // Check for CMS subdomain
  const hostname = request.headers.get("host") || "";
  const isCMSSubdomain = hostname.startsWith("cms.");

  // If accessing CMS via subdomain and path doesn't start with /cms, rewrite
  if (isCMSSubdomain && !url.pathname.startsWith("/cms")) {
    // This is handled by Vercel rewrites, but as a fallback:
    const newUrl = new URL(request.url);
    newUrl.pathname = `/cms${url.pathname}`;
    return NextResponse.rewrite(newUrl);
  }

  // CMS routes require authentication
  if (isCMSRoute(request) || isCMSSubdomain) {
    await auth.protect();
    return;
  }

  // Allow public routes without authentication
  if (isPublicRoute(request)) {
    return;
  }

  // Protect all other routes
  await auth.protect();
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|txt|xml)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
