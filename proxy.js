import { NextResponse } from "next/server";

export async function proxy(request) {
  const token = request.cookies.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  try {
    const response = await fetch("http://localhost:8080/api/me", {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
    });
    if (!response.ok) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    const user = await response.json();
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute && user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/auth", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
