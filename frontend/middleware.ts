import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect("https://github.com/destroyer22719/FoodFlation?");
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/:path*",
};
