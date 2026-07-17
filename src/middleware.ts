import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    await auth.protect({ unauthenticatedUrl: new URL("/login", req.url).toString() });
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};