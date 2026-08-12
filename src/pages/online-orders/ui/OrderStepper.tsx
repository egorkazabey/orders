import type { Order, OrderStatus } from '@/shared/api/orders'

const STAGES: { status: OrderStatus; label: string }[] = [
	{ status: 'ACCEPTED', label: 'Přijato' },
	{ status: 'COOKING', label: 'Vaří se' },
	{ status: 'DELIVERING', label: 'Doručuje se' },
	{ status: 'DONE', label: 'Hotovo' },
]

type OrderStepperProps = {
	currentStatus: OrderStatus
	deliveryMethod: Order['deliveryMethod']
}

export function OrderStepper({ currentStatus, deliveryMethod }: OrderStepperProps) {
	const stages = STAGES.map((stage) =>
		stage.status === 'DELIVERING' && deliveryMethod === 'pickup' ? { ...stage, label: 'Připraveno' } : stage,
	)
	const currentIndex = stages.findIndex((stage) => stage.status === currentStatus)

	return (
		<div className="mt-2">
			<div className="flex gap-1">
				{stages.map((stage, index) => (
					<div
						key={stage.status}
						className={`h-1.5 flex-1 rounded-full ${index <= currentIndex ? 'bg-blue-600' : 'bg-gray-200'}`}
					/>
				))}
			</div>
			<p className="mt-1 text-xs font-medium text-gray-500">{stages[currentIndex]?.label}</p>
		</div>
	)
}
