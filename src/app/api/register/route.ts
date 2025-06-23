import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hash } from "bcryptjs"

export async function POST(req: Request) {
  const { name, email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "User exists" }, { status: 400 })
  }
  const hashed = await hash(password, 10)
  const user = await prisma.user.create({
    data: { name, email, password: hashed },
  })
  return NextResponse.json({ id: user.id })
}
