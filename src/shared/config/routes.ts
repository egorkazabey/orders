export const ROUTES = {
	onboarding: '/',
	sales: '/sales',
	clients: '/clients',
	onlineOrders: '/online-orders',
	settings: '/settings',
	login: '/login',
	signup: '/signup',
	storefront: '/s/:slug',
} as const

export function storefrontPath(slug: string) {
	return `/s/${slug}`
}
