// src/middleware.ts
import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
    const session = await auth()
    const url = req.nextUrl
    const pathname = url.pathname

    // Nếu đã login và đang cố vào /login => redirect về /admin
    if (session && pathname === "/login") {
        return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Nếu chưa login mà cố vào /admin => redirect về /login
    if (!session && pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // Nếu đã login nhưng không đủ quyền => có thể cho ra trang 403 (tùy)
    console.log(session?.user.role)
    if (
        session &&
        pathname.startsWith("/admin") &&
        session.user.role !== "ADMIN"
    ) {
        return NextResponse.redirect(new URL("/403", req.url)) // hoặc /not-authorized
    }

    return NextResponse.next()
}
