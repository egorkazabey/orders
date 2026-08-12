import { apiRequest } from './client'
import type { Business } from '@/entities/business'

export type Role = 'OWNER' | 'STAFF'
export type AuthResponse = { token: string; business: Business }

export function signup(payload: { email: string; password: string; businessName: string; slug: string }) {
	return apiRequest<AuthResponse>('/auth/signup', { method: 'POST', body: payload })
}

export function login(payload: { email: string; password: string }) {
	return apiRequest<AuthResponse>('/auth/login', { method: 'POST', body: payload })
}

export function me(token: string) {
	return apiRequest<{ business: Business; role: Role }>('/auth/me', { token })
}

export type Membership = {
	businessId: string
	businessName: string
	slug: string
	role: Role
	isCurrent: boolean
}

export function getMemberships(token: string) {
	return apiRequest<{ memberships: Membership[] }>('/auth/memberships', { token })
}

export function switchBusiness(token: string, businessId: string) {
	return apiRequest<AuthResponse>('/auth/switch-business', { method: 'POST', body: { businessId }, token })
}
