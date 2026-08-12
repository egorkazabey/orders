import { createContext, useContext } from 'react'
import type { StorefrontData } from '@/entities/business'

export const StorefrontDataContext = createContext<StorefrontData | null>(null)

export function useStorefrontData() {
	const context = useContext(StorefrontDataContext)
	if (!context) throw new Error('useStorefrontData must be used within StorefrontDataContext.Provider')
	return context
}
