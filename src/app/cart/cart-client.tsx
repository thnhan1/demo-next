'use client'
import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { setCart, updateQuantity, removeItem } from '@/store/cartSlice'

interface Props {
  initialItems: { productId: string; quantity: number; price: number }[]
}

export default function CartClient({ initialItems }: Props) {
  const { data: session } = useSession()
  const dispatch = useAppDispatch()
  const items = useAppSelector(state => state.cart.items)

  useEffect(() => {
    if (session) {
      const merged = [...initialItems]
      items.forEach(g => {
        const existing = merged.find(m => m.productId === g.productId)
        if (existing) existing.quantity += g.quantity
        else merged.push(g)
      })
      dispatch(setCart(merged))
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: merged })
      })
      localStorage.removeItem('guest_cart')
    }
  }, [session])

  useEffect(() => {
    if (session) {
      fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
    }
  }, [items, session])

  const handleRemove = (id: string) => {
    dispatch(removeItem(id))
  }

  const handleQty = (id: string, qty: number) => {
    dispatch(updateQuantity({ productId: id, quantity: qty }))
  }

  return (
    <div className="p-4 space-y-2">
      {items.map(item => (
        <div key={item.productId} className="flex gap-2 items-center">
          <span className="flex-1">{item.productId}</span>
          <input
            type="number"
            value={item.quantity}
            min={1}
            onChange={e => handleQty(item.productId, parseInt(e.target.value))}
            className="w-16 border"
          />
          <button onClick={() => handleRemove(item.productId)}>Remove</button>
        </div>
      ))}
    </div>
  )
}
