import { createContext } from 'react'
import type { Business } from '@/entities/business'
import type { Role } from '@/shared/api/auth'

export type SessionStatus = 'loading' | 'authenticated' | 'guest'

export type SignupPayload = {
	email: string
	password: string
	businessName: string
	slug: string
}

export type SessionContextValue = {
	token: string | null
	business: Business | null
	role: Role | null
	status: SessionStatus
	login: (email: string, password: string) => Promise<void>
	signup: (payload: SignupPayload) => Promise<void>
	logout: () => void
	setBusiness: (business: Business) => void
	switchBusiness: (businessId: string) => Promise<void>
}

export const SessionContext = createContext<SessionContextValue | null>(null)
