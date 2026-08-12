import { apiRequest } from './client'

export type PromoCode = {
	id: string
	code: string
	type: 'percent' | 'fixed'
	value: number
	active: boolean
	usageCount: number
	maxUses: number | null
	createdAt: string
}

export function getPromoCodes(token: string) {
	return apiRequest<{ promoCodes: PromoCode[] }>('/promo-codes', { token })
}

export type PromoCodeDraft = {
	code: string
	type: 'percent' | 'fixed'
	value: number
	maxUses?: number | null
}

export function createPromoCode(token: string, draft: PromoCodeDraft) {
	return apiRequest<{ promoCode: PromoCode }>('/promo-codes', { method: 'POST', body: draft, token })
}

export function setPromoCodeActive(token: string, id: string, active: boolean) {
	return apiRequest<{ promoCode: PromoCode }>(`/promo-codes/${id}`, { method: 'PATCH', body: { active }, token })
}

export function deletePromoCode(token: string, id: string) {
	return apiRequest<void>(`/promo-codes/${id}`, { method: 'DELETE', token })
}
