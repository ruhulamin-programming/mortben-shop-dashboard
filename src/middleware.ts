import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

interface ExtendedJwtPayload {
  role?: string;
  userName?: string;
  email?: string;
}

export async function middleware(req: Request) {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("accessToken");
  const pathname = new URL(req.url).pathname;

  // ✅ If token exists and user is at `/`, redirect to `/admin/dashboard`
  if (tokenCookie?.value && pathname === "/") {
    return NextResponse.redirect(new URL("/admin/overview", req.url));
  }

  // ✅ Middleware for /admin routes
  if (pathname.startsWith("/admin")) {
    if (!tokenCookie?.value) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const token = tokenCookie.value;

    try {
      const decoded = jwtDecode<ExtendedJwtPayload>(token);

      if (decoded.role === "ADMIN") {
        return NextResponse.next(); // Allow all
      }

      if (decoded.role === "SHOP_OWNER") {
        if (
          pathname.startsWith("/admin/users") ||
          pathname.startsWith("/admin/reviews") ||
          pathname.startsWith("/admin/store")
        ) {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }

        return NextResponse.next(); // Allow other /admin routes
      }

      // Deny other roles
      return NextResponse.redirect(new URL("/", req.url));
    } catch (error) {
      console.error("JWT decode error:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Allow other public routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};
