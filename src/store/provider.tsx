'use client'
import { PropsWithChildren, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { setCart } from './cartSlice'

export default function ReduxProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const saved = localStorage.getItem('guest_cart')
    if (saved) {
      try {
        store.dispatch(setCart(JSON.parse(saved)))
      } catch {}
    }
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      localStorage.setItem('guest_cart', JSON.stringify(state.cart.items))
    })
    return unsubscribe
  }, [])
  return <Provider store={store}>{children}</Provider>
}
