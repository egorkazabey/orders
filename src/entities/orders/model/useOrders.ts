import { useContext } from 'react'
import { OrdersContext } from './context'

export function useOrders() {
	const context = useContext(OrdersContext)
	if (!context) throw new Error('useOrders must be used within an OrdersProvider')
	return context
}

/** Same as useOrders, but returns null outside an OrdersProvider instead of throwing. */
export function useOrdersOptional() {
	return useContext(OrdersContext)
}
