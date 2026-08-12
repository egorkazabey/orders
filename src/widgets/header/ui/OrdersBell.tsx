import { Link } from 'react-router-dom'
import { FiBell } from 'react-icons/fi'
import { useOrdersOptional } from '@/entities/orders'

/** Renders nothing outside an authenticated OrdersProvider (e.g. public pages). */
export function OrdersBell() {
	const orders = useOrdersOptional()
	if (!orders) return null

	const newCount = orders.orders.filter((o) => o.status === 'NEW').length

	return (
		<Link
			to="/online-orders"
			aria-label="Nové objednávky"
			className="relative text-lg text-gray-700 transition hover:text-blue-700"
		>
			<FiBell />
			{newCount > 0 && (
				<span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
					{newCount}
				</span>
			)}
		</Link>
	)
}
