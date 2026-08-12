import { useEffect, useState } from 'react'
import { getPublicOrderStatus } from '@/shared/api/storefront'
import type { PublicOrderStatus } from '@/shared/api/storefront'

type Stage = {
	status: PublicOrderStatus['status']
	icon: string
	title: string
	subtitle: string
}

const STAGES: Stage[] = [
	{ status: 'NEW', icon: '⏳', title: 'Čekáme na potvrzení', subtitle: 'Podnik brzy vaši objednávku potvrdí.' },
	{ status: 'ACCEPTED', icon: '✅', title: 'Objednávka přijata!', subtitle: 'Za chvíli se do ní pustíme.' },
	{ status: 'COOKING', icon: '🍳', title: 'Připravujeme objednávku', subtitle: 'Vaříme to nejlepší pro vás.' },
	{ status: 'DELIVERING', icon: '🛵', title: 'Na cestě k vám', subtitle: 'Objednávka je na cestě.' },
	{ status: 'DONE', icon: '🎉', title: 'Objednávka dokončena', subtitle: 'Děkujeme za objednávku!' },
]

type OrderTrackingProps = {
	slug: string
	orderId: string
	orderNumber: number
	onClose: () => void
}

export function OrderTracking({ slug, orderId, orderNumber, onClose }: OrderTrackingProps) {
	const [status, setStatus] = useState<PublicOrderStatus['status']>('NEW')
	const [deliveryMethod, setDeliveryMethod] = useState<PublicOrderStatus['deliveryMethod']>('pickup')

	useEffect(() => {
		let cancelled = false

		async function poll() {
			try {
				const res = await getPublicOrderStatus(slug, orderId)
				if (cancelled) return
				setStatus(res.order.status)
				setDeliveryMethod(res.order.deliveryMethod)
			} catch {
				// transient network hiccup — keep polling, don't disrupt the UI
			}
		}

		poll()
		const interval = setInterval(poll, 3000)
		return () => {
			cancelled = true
			clearInterval(interval)
		}
	}, [slug, orderId])

	if (status === 'CANCELLED') {
		return (
			<div className="flex flex-col items-center gap-3 py-6 text-center">
				<span className="text-4xl">😔</span>
				<p className="text-lg font-bold text-stone-900 dark:text-stone-50">Objednávka byla zrušena</p>
				<p className="text-sm text-stone-500 dark:text-stone-400">
					Omlouváme se. Pro více informací kontaktujte podnik.
				</p>
				<button
					type="button"
					onClick={onClose}
					className="mt-2 cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
				>
					Zavřít
				</button>
			</div>
		)
	}

	const stages = STAGES.map((stage) =>
		stage.status === 'DELIVERING' && deliveryMethod === 'pickup'
			? { ...stage, icon: '📦', title: 'Připraveno k vyzvednutí', subtitle: 'Můžete si pro objednávku přijít.' }
			: stage,
	)
	const currentIndex = stages.findIndex((stage) => stage.status === status)
	const current = stages[currentIndex] ?? stages[0]
	const isFinal = status === 'DONE'

	return (
		<div className="flex flex-col items-center gap-4 py-4 text-center">
			<span
				className={`flex size-20 items-center justify-center rounded-full bg-(--accent-soft) text-4xl ${
					isFinal ? '' : 'animate-pulse'
				}`}
			>
				{current.icon}
			</span>

			<div>
				<p className="text-lg font-bold text-stone-900 dark:text-stone-50">{current.title}</p>
				<p className="text-sm text-stone-500 dark:text-stone-400">{current.subtitle}</p>
			</div>

			<div className="flex w-full gap-1">
				{stages.map((stage, index) => (
					<div
						key={stage.status}
						className={`h-1.5 flex-1 rounded-full transition-colors ${
							index <= currentIndex ? 'bg-(--accent)' : 'bg-stone-200 dark:bg-stone-700'
						}`}
					/>
				))}
			</div>

			<p className="text-xs text-stone-400 dark:text-stone-500">Objednávka č. {orderNumber}</p>

			{isFinal && (
				<button
					type="button"
					onClick={onClose}
					className="mt-2 cursor-pointer rounded-full bg-stone-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
				>
					Zavřít
				</button>
			)}
		</div>
	)
}
