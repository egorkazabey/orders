import { FiPrinter } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import type { Order } from '@/shared/api/orders'
import { nextActionLabel, nextStatus } from '../lib/pipeline'
import { printOrderTicket } from '../lib/printTicket'
import { OrderStepper } from './OrderStepper'
import { CountdownTimer } from './CountdownTimer'

type OrderCardProps = {
	order: Order
	prepTimeMinutes: number
	canPrint?: boolean
	onAdvance?: () => void
	onCancel?: () => void
}

export function OrderCard({ order, prepTimeMinutes, canPrint = false, onAdvance, onCancel }: OrderCardProps) {
	const { business } = useSession()
	const isNew = order.status === 'NEW'
	const isActive = order.status === 'ACCEPTED' || order.status === 'COOKING' || order.status === 'DELIVERING'
	const advanceLabel = nextActionLabel(order.status, order.deliveryMethod)
	const canAdvance = Boolean(advanceLabel && nextStatus(order.status) && onAdvance)

	return (
		<div className={`rounded-xl border p-4 ${isNew ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'}`}>
			<div className="flex items-center justify-between">
				<span className="flex items-center gap-1.5 font-semibold text-gray-900">
					{isNew && <span className="size-2 animate-ping rounded-full bg-red-500" />}#{order.orderNumber}
				</span>
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-400">
						{new Date(order.createdAt).toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}
					</span>
					{canPrint && (
						<button
							type="button"
							aria-label="Vytisknout účtenku"
							onClick={() => printOrderTicket(order, business?.name ?? '')}
							className="cursor-pointer text-gray-400 transition hover:text-gray-700"
						>
							<FiPrinter size={15} />
						</button>
					)}
				</div>
			</div>

			<p className="mt-1 text-sm font-medium text-gray-900">{order.customerName}</p>
			<p className="text-sm text-gray-500">{order.customerPhone}</p>
			<p className="text-sm text-gray-500">
				{order.deliveryMethod === 'delivery' ? `Doručení: ${order.address}` : 'Osobní odběr'}
			</p>

			<ul className="mt-2 flex flex-col gap-0.5 text-sm text-gray-700">
				{order.items.map((item) => (
					<li key={item.id}>
						{item.quantity}× {item.productName} ({item.variantName}
						{item.addonNames ? `, ${item.addonNames}` : ''})
					</li>
				))}
			</ul>

			{order.note && <p className="mt-1 text-sm text-gray-500 italic">Poznámka: {order.note}</p>}

			<p className="mt-2 text-sm font-bold text-gray-900">{order.totalPrice} Kč</p>

			{isActive && <OrderStepper currentStatus={order.status} deliveryMethod={order.deliveryMethod} />}

			{isActive && order.acceptedAt && (
				<div className="mt-2">
					<CountdownTimer confirmedAt={order.acceptedAt} prepTimeMinutes={prepTimeMinutes} />
				</div>
			)}

			<div className="mt-3 flex gap-2">
				{canAdvance && (
					<button
						type="button"
						onClick={() => onAdvance?.()}
						className="cursor-pointer rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
					>
						{advanceLabel}
					</button>
				)}
				{onCancel && (
					<button
						type="button"
						onClick={onCancel}
						className="cursor-pointer rounded-lg px-4 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
					>
						Zrušit
					</button>
				)}
			</div>
		</div>
	)
}
