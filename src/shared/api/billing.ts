import { apiRequest } from './client'
import type { Subscription } from '@/entities/business'

export type Plan = {
	id: 'start' | 'pro' | 'business'
	name: string
	priceCzk: number
}

export function getPlans() {
	return apiRequest<{ plans: Plan[] }>('/billing/plans')
}

export type CheckoutResult = { url: string; switched?: undefined } | { url?: undefined; switched: true }

export function createCheckoutSession(token: string, plan: Plan['id']) {
	return apiRequest<CheckoutResult>('/billing/checkout', { method: 'POST', body: { plan }, token })
}

export function createPortalSession(token: string) {
	return apiRequest<{ url: string }>('/billing/portal', { method: 'POST', token })
}

export function getSubscription(token: string) {
	return apiRequest<{ subscription: Subscription | null }>('/billing/subscription', { token })
}
