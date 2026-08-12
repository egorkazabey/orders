import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Business } from '@/entities/business'
import * as authApi from '@/shared/api/auth'
import type { Role } from '@/shared/api/auth'
import { SessionContext } from './context'
import type { SessionContextValue, SignupPayload } from './context'

const TOKEN_KEY = 'orders:auth-token'

export function SessionProvider({ children }: { children: ReactNode }) {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
	const [business, setBusiness] = useState<Business | null>(null)
	const [role, setRole] = useState<Role | null>(null)
	const [isValidating, setIsValidating] = useState(() => Boolean(localStorage.getItem(TOKEN_KEY)))

	useEffect(() => {
		if (!token) return
		authApi
			.me(token)
			.then((res) => {
				setBusiness(res.business)
				setRole(res.role)
				setIsValidating(false)
			})
			.catch(() => {
				localStorage.removeItem(TOKEN_KEY)
				setToken(null)
				setBusiness(null)
				setRole(null)
				setIsValidating(false)
			})
	}, [token])

	function persistToken(next: string) {
		localStorage.setItem(TOKEN_KEY, next)
		setToken(next)
	}

	async function login(email: string, password: string) {
		const res = await authApi.login({ email, password })
		setBusiness(res.business)
		persistToken(res.token)
	}

	async function signup(payload: SignupPayload) {
		const res = await authApi.signup(payload)
		setBusiness(res.business)
		persistToken(res.token)
	}

	async function switchBusiness(businessId: string) {
		if (!token) return
		const res = await authApi.switchBusiness(token, businessId)
		setBusiness(res.business)
		persistToken(res.token)
	}

	function logout() {
		localStorage.removeItem(TOKEN_KEY)
		setToken(null)
		setBusiness(null)
		setRole(null)
	}

	const status: SessionContextValue['status'] = !token ? 'guest' : isValidating ? 'loading' : 'authenticated'
	const value: SessionContextValue = {
		token,
		business,
		role,
		status,
		login,
		signup,
		logout,
		setBusiness,
		switchBusiness,
	}

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
