import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { auth } from '@/auth'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ items: [] })
  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: true }
  })
  return NextResponse.json({ items: cart?.items ?? [] })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { items } = await req.json()
  let cart = await prisma.cart.findFirst({ where: { userId: session.user.id } })
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId: session.user.id } })
  }
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  if (items?.length) {
    await prisma.cartItem.createMany({
      data: items.map((i: any) => ({
        cartId: cart!.id,
        productId: i.productId,
        quantity: i.quantity,
        price: i.price
      }))
    })
  }
  return NextResponse.json({ ok: true })
}
