import { Link } from 'react-router-dom'
import { FiClipboard, FiClock, FiTrendingUp } from 'react-icons/fi'
import { Header } from '@/widgets/header'
import { useSession } from '@/entities/session'
import { useOrders } from '@/entities/orders'
import { ROUTES } from '@/shared/config/routes'

function formatCzk(amount: number) {
	return `${amount.toLocaleString('cs-CZ')} Kč`
}

function isToday(dateStr: string) {
	const d = new Date(dateStr)
	const now = new Date()
	return d.toDateString() === now.toDateString()
}

export function SalesPage() {
	const { business } = useSession()
	const { orders, isLoading } = useOrders()

	const todayOrders = orders.filter((o) => isToday(o.createdAt) && o.status !== 'CANCELLED')
	const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalPrice, 0)
	const inProgress = orders.filter((o) => ['NEW', 'ACCEPTED', 'COOKING', 'DELIVERING'].includes(o.status))
	const newOrders = orders.filter((o) => o.status === 'NEW')

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 overflow-auto p-4 sm:p-6">
				<h1 className="mb-1 text-2xl font-semibold text-gray-900">
					Vítejte zpět{business ? `, ${business.name}` : ''}
				</h1>
				<p className="mb-6 text-sm text-gray-500">Přehled dnešního dne.</p>

				{isLoading ? (
					<p className="text-sm text-gray-500">Načítání…</p>
				) : (
					<>
						<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
							<div className="rounded-xl border border-gray-200 bg-white p-5">
								<div className="flex items-center gap-2 text-sm text-gray-500">
									<FiTrendingUp size={16} />
									Dnešní tržby
								</div>
								<p className="mt-2 text-2xl font-semibold text-gray-900">{formatCzk(todayRevenue)}</p>
								<p className="mt-1 text-xs text-gray-400">{todayOrders.length} objednávek dnes</p>
							</div>

							<Link
								to={ROUTES.onlineOrders}
								className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
							>
								<div className="flex items-center gap-2 text-sm text-gray-500">
									<FiClock size={16} />
									Právě se zpracovává
								</div>
								<p className="mt-2 text-2xl font-semibold text-gray-900">{inProgress.length}</p>
								<p className="mt-1 text-xs text-gray-400">
									{newOrders.length > 0 ? `${newOrders.length} čeká na potvrzení` : 'Vše potvrzeno'}
								</p>
							</Link>

							<Link
								to={`${ROUTES.settings}?tab=statistics`}
								className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm"
							>
								<div className="flex items-center gap-2 text-sm text-gray-500">
									<FiClipboard size={16} />
									Statistiky
								</div>
								<p className="mt-2 text-sm font-medium text-blue-600">Zobrazit detailní přehled →</p>
							</Link>
						</div>

						{newOrders.length > 0 && (
							<div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
								Máte {newOrders.length} novou objednávku čekající na potvrzení.{' '}
								<Link to={ROUTES.onlineOrders} className="font-medium underline">
									Přejít na objednávky
								</Link>
							</div>
						)}
					</>
				)}
			</main>
		</div>
	)
}
