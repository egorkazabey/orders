import { apiRequest } from './client'
import type { AccentColor, Business, StorefrontTheme } from '@/entities/business'

export type UpdateBusinessInput = {
	name?: string
	phone?: string
	description?: string
	prepTimeMinutes?: number
	orderCutoffMinutes?: number
	soundEnabled?: boolean
	ringTone?: 'classic' | 'chime' | 'alert'
	quietHoursStart?: string | null
	quietHoursEnd?: string | null
	storefrontTheme?: StorefrontTheme
	accentColor?: AccentColor
	tagline?: string
	address?: string
	instagramUrl?: string
	facebookUrl?: string
}

export function updateBusiness(token: string, payload: UpdateBusinessInput) {
	return apiRequest<{ business: Business }>('/business', { method: 'PATCH', body: payload, token })
}
