import { useContext } from 'react'
import { BusinessContext } from './context'

export function useBusiness() {
	const context = useContext(BusinessContext)
	if (!context) throw new Error('useBusiness must be used within a BusinessProvider')
	return context
}
