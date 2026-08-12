import { apiRequest } from './client'
import type { StorefrontData } from '@/entities/business'

export function getStorefront(slug: string) {
	return apiRequest<{ business: StorefrontData }>(`/public/${slug}`)
}

export type PlaceOrderInput = {
	customerName: string
	customerPhone: string
	deliveryMethod: 'pickup' | 'delivery'
	address?: string
	note?: string
	items: {
		productId: string
		variantId: string
		addonIds: string[]
		quantity: number
	}[]
	promoCode?: string
}

export type PlacedOrder = {
	id: string
	orderNumber: number
	totalPrice: number
}

export function placeOrder(slug: string, payload: PlaceOrderInput) {
	return apiRequest<{ order: PlacedOrder }>(`/public/${slug}/orders`, { method: 'POST', body: payload })
}

export type PublicOrderStatus = {
	id: string
	orderNumber: number
	deliveryMethod: 'pickup' | 'delivery'
	status: 'NEW' | 'ACCEPTED' | 'COOKING' | 'DELIVERING' | 'DONE' | 'CANCELLED'
	acceptedAt: string | null
	totalPrice: number
}

export function getPublicOrderStatus(slug: string, orderId: string) {
	return apiRequest<{ order: PublicOrderStatus }>(`/public/${slug}/orders/${orderId}`)
}

export type PromoValidation = {
	valid: true
	code: string
	type: 'percent' | 'fixed'
	value: number
	discountAmount: number
}

export function validatePromoCode(slug: string, code: string, subtotal: number) {
	return apiRequest<PromoValidation>(`/public/${slug}/validate-promo`, {
		method: 'POST',
		body: { code, subtotal },
	})
}
