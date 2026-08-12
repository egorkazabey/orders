import { createContext } from 'react'
import type { Order, OrderStatus } from '@/shared/api/orders'

export type OrdersContextValue = {
	orders: Order[]
	isLoading: boolean
	error: string | null
	setStatus: (id: string, status: OrderStatus) => Promise<void>
}

export const OrdersContext = createContext<OrdersContextValue | null>(null)
