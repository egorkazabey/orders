import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useSession } from '@/entities/session'
import { getOrders, ordersStreamUrl, updateOrderStatus } from '@/shared/api/orders'
import type { Order, OrderStatus } from '@/shared/api/orders'
import { startRinging, stopRinging } from '../lib/ring'
import { isWithinQuietHours } from '../lib/quietHours'
import { OrdersContext } from './context'
import type { OrdersContextValue } from './context'

export function OrdersProvider({ children }: { children: ReactNode }) {
	const { token, business } = useSession()
	const [orders, setOrders] = useState<Order[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!token) return
		let cancelled = false

		getOrders(token)
			.then((res) => {
				if (!cancelled) setOrders(res.orders)
			})
			.catch((err) => {
				if (!cancelled) setError(err instanceof Error ? err.message : 'Nepodařilo se načíst objednávky')
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false)
			})

		return () => {
			cancelled = true
		}
	}, [token])

	useEffect(() => {
		if (!token) return
		const source = new EventSource(ordersStreamUrl(token))

		source.addEventListener('new-order', (event) => {
			const order = JSON.parse((event as MessageEvent).data) as Order
			setOrders((prev) => (prev.some((o) => o.id === order.id) ? prev : [order, ...prev]))
		})

		// Keeps every open tab in sync when any one of them (or another employee)
		// advances/cancels an order — otherwise a stale tab would keep ringing
		// for an order someone else already accepted.
		source.addEventListener('order-updated', (event) => {
			const order = JSON.parse((event as MessageEvent).data) as Order
			setOrders((prev) => prev.map((o) => (o.id === order.id ? order : o)))
		})

		return () => source.close()
	}, [token])

	const hasNewOrders = orders.some((o) => o.status === 'NEW')
	const soundEnabled = business?.soundEnabled ?? true
	const ringTone = business?.ringTone ?? 'classic'
	const quietHoursStart = business?.quietHoursStart ?? null
	const quietHoursEnd = business?.quietHoursEnd ?? null

	useEffect(() => {
		const shouldRing = hasNewOrders && soundEnabled && !isWithinQuietHours(quietHoursStart, quietHoursEnd)
		if (shouldRing) startRinging(ringTone)
		else stopRinging()
	}, [hasNewOrders, soundEnabled, ringTone, quietHoursStart, quietHoursEnd])

	useEffect(() => stopRinging, [])

	async function setStatus(id: string, status: OrderStatus) {
		if (!token) return
		const res = await updateOrderStatus(token, id, status)
		setOrders((prev) => prev.map((o) => (o.id === id ? res.order : o)))
	}

	const value: OrdersContextValue = { orders, isLoading, error, setStatus }

	return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
}
