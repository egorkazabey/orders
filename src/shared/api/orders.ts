import { apiRequest, API_URL } from './client'

export type OrderStatus = 'NEW' | 'ACCEPTED' | 'COOKING' | 'DELIVERING' | 'DONE' | 'CANCELLED'

export type OrderItem = {
	id: string
	productName: string
	variantName: string
	addonNames: string
	quantity: number
	unitPrice: number
}

export type Order = {
	id: string
	orderNumber: number
	customerName: string
	customerPhone: string
	deliveryMethod: 'pickup' | 'delivery'
	address: string | null
	note: string | null
	status: OrderStatus
	totalPrice: number
	createdAt: string
	acceptedAt: string | null
	archived: boolean
	items: OrderItem[]
}

export function getOrders(token: string) {
	return apiRequest<{ orders: Order[] }>('/orders', { token })
}

export function updateOrderStatus(token: string, id: string, status: OrderStatus) {
	return apiRequest<{ order: Order }>(`/orders/${id}/status`, { method: 'PATCH', body: { status }, token })
}

export function ordersStreamUrl(token: string) {
	return `${API_URL}/orders/stream?token=${encodeURIComponent(token)}`
}

export async function downloadOrdersCsv(token: string) {
	const res = await fetch(`${API_URL}/orders/export.csv`, {
		headers: { Authorization: `Bearer ${token}` },
	})
	if (!res.ok) throw new Error('Export se nezdařil')
	const blob = await res.blob()
	const url = URL.createObjectURL(blob)
	const link = document.createElement('a')
	link.href = url
	link.download = 'objednavky.csv'
	document.body.appendChild(link)
	link.click()
	link.remove()
	URL.revokeObjectURL(url)
}
