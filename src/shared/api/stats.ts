import { apiRequest } from './client'

export type RevenuePoint = { date: string; revenue: number }
export type TopProduct = { name: string; quantity: number; revenue: number }

export type StatsOverview = {
	revenueByDay: RevenuePoint[]
	topProducts: TopProduct[]
	totalOrders: number
	totalRevenue: number
	avgOrderValue: number
}

export function getStatsOverview(token: string) {
	return apiRequest<StatsOverview>('/stats/overview', { token })
}

export type Customer = {
	name: string
	phone: string
	orderCount: number
	totalSpent: number
	lastOrderAt: string
}

export function getCustomers(token: string) {
	return apiRequest<{ customers: Customer[] }>('/stats/customers', { token })
}
