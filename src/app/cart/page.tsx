import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import CartClient from './cart-client'

export default async function CartPage() {
  const session = await auth()
  let items: any[] = []
  if (session) {
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { items: true }
    })
    if (cart) {
      items = cart.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
        price: Number(i.price)
      }))
    }
  }
  return <CartClient initialItems={items} />
}
