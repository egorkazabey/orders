import { Navigate, Outlet } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { BusinessProvider } from '@/entities/business'
import { OrdersProvider } from '@/entities/orders'

export function RequireAuth() {
	const { status } = useSession()

	if (status === 'loading') {
		return <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">Načítání…</div>
	}

	if (status === 'guest') {
		return <Navigate to="/login" replace />
	}

	return (
		<BusinessProvider>
			<OrdersProvider>
				<Outlet />
			</OrdersProvider>
		</BusinessProvider>
	)
}
