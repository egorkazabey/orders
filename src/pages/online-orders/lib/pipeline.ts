import type { Order, OrderStatus } from '@/shared/api/orders'

const PIPELINE_ORDER: OrderStatus[] = ['NEW', 'ACCEPTED', 'COOKING', 'DELIVERING', 'DONE']

export function nextStatus(current: OrderStatus): OrderStatus | null {
	const index = PIPELINE_ORDER.indexOf(current)
	if (index === -1 || index === PIPELINE_ORDER.length - 1) return null
	return PIPELINE_ORDER[index + 1]
}

export function nextActionLabel(current: OrderStatus, deliveryMethod: Order['deliveryMethod']) {
	switch (current) {
		case 'NEW':
			return 'Přijmout'
		case 'ACCEPTED':
			return 'Začít vařit'
		case 'COOKING':
			return deliveryMethod === 'pickup' ? 'Připraveno k vyzvednutí' : 'Předat k doručení'
		case 'DELIVERING':
			return 'Dokončit'
		default:
			return null
	}
}
