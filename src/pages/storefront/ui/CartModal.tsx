import { useState } from 'react'
import type { FormEvent } from 'react'
import { FiMinus, FiPlus, FiTag, FiTrash2, FiX } from 'react-icons/fi'
import { Modal } from '@/shared/ui'
import { placeOrder, validatePromoCode } from '@/shared/api/storefront'
import type { PlacedOrder, PromoValidation } from '@/shared/api/storefront'
import { ApiError } from '@/shared/api/client'
import { cartItemTotal, cartTotal, type CartItem } from '../model/cart'
import { OrderTracking } from './OrderTracking'

type Step = 'cart' | 'checkout' | 'confirmed'

type CartModalProps = {
	slug: string
	items: CartItem[]
	onClose: () => void
	onUpdateQuantity: (id: string, quantity: number) => void
	onRemove: (id: string) => void
	onOrderPlaced: () => void
}

const FIELD_CLASSES =
	'w-full rounded-2xl border border-stone-200 px-4 py-2.5 text-sm text-stone-900 focus:border-(--accent) focus:outline-none dark:border-stone-600 dark:bg-stone-900 dark:text-stone-50 dark:placeholder:text-stone-500'

export function CartModal({ slug, items, onClose, onUpdateQuantity, onRemove, onOrderPlaced }: CartModalProps) {
	const [step, setStep] = useState<Step>('cart')
	const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')
	const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [promoInput, setPromoInput] = useState('')
	const [promo, setPromo] = useState<PromoValidation | null>(null)
	const [promoError, setPromoError] = useState<string | null>(null)
	const [isValidatingPromo, setIsValidatingPromo] = useState(false)

	const subtotal = cartTotal(items)
	const discount = promo?.discountAmount ?? 0
	const total = Math.max(0, subtotal - discount)

	async function handleApplyPromo() {
		if (!promoInput.trim()) return
		setIsValidatingPromo(true)
		setPromoError(null)
		try {
			const res = await validatePromoCode(slug, promoInput.trim(), subtotal)
			setPromo(res)
		} catch (err) {
			setPromo(null)
			setPromoError(err instanceof ApiError ? err.message : 'Neplatný promo kód')
		} finally {
			setIsValidatingPromo(false)
		}
	}

	function handleRemovePromo() {
		setPromo(null)
		setPromoInput('')
		setPromoError(null)
	}

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()
		setError(null)
		setIsSubmitting(true)

		const form = new FormData(e.currentTarget)
		try {
			const res = await placeOrder(slug, {
				customerName: String(form.get('name') ?? ''),
				customerPhone: String(form.get('phone') ?? ''),
				deliveryMethod,
				address: deliveryMethod === 'delivery' ? String(form.get('address') ?? '') : undefined,
				note: String(form.get('note') ?? '') || undefined,
				items: items.map((item) => ({
					productId: item.productId,
					variantId: item.variantId,
					addonIds: item.addonIds,
					quantity: item.quantity,
				})),
				promoCode: promo?.code,
			})
			setPlacedOrder(res.order)
			setStep('confirmed')
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Objednávku se nepodařilo odeslat')
		} finally {
			setIsSubmitting(false)
		}
	}

	function handleClose() {
		if (step === 'confirmed') onOrderPlaced()
		onClose()
	}

	const titles: Record<Step, string> = {
		cart: 'Košík',
		checkout: 'Dokončit objednávku',
		confirmed: 'Vaše objednávka',
	}

	return (
		<Modal open title={titles[step]} onClose={handleClose}>
			{step === 'cart' && (
				<div className="flex flex-col gap-4">
					{items.length === 0 ? (
						<p className="py-6 text-center text-sm text-stone-500 dark:text-stone-400">Váš košík je prázdný.</p>
					) : (
						<>
							<ul className="flex flex-col gap-3">
								{items.map((item) => (
									<li
										key={item.id}
										className="flex items-start gap-3 rounded-2xl bg-stone-50 p-3 dark:bg-stone-900"
									>
										<span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-lg dark:bg-stone-700">
											{item.productIcon}
										</span>
										<div className="min-w-0 flex-1">
											<p className="font-semibold text-stone-900 dark:text-stone-50">{item.productName}</p>
											<p className="text-sm text-stone-500 dark:text-stone-400">
												{item.variantName}
												{item.addonNames.length > 0 ? ` · ${item.addonNames.join(', ')}` : ''}
											</p>
											<div className="mt-2 flex items-center gap-2">
												<button
													type="button"
													aria-label="Snížit množství"
													onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
													className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-white text-stone-600 shadow-sm hover:bg-stone-100 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
												>
													<FiMinus size={12} />
												</button>
												<span className="w-5 text-center text-sm font-medium dark:text-stone-100">{item.quantity}</span>
												<button
													type="button"
													aria-label="Zvýšit množství"
													onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
													className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-white text-stone-600 shadow-sm hover:bg-stone-100 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
												>
													<FiPlus size={12} />
												</button>
											</div>
										</div>
										<div className="flex shrink-0 flex-col items-end gap-2">
											<span className="text-sm font-bold text-stone-900 dark:text-stone-50">
												{cartItemTotal(item)} Kč
											</span>
											<button
												type="button"
												aria-label="Odebrat z košíku"
												onClick={() => onRemove(item.id)}
												className="cursor-pointer text-stone-400 hover:text-red-600"
											>
												<FiTrash2 size={16} />
											</button>
										</div>
									</li>
								))}
							</ul>
							<div>
								{promo ? (
									<div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-2.5 text-sm dark:bg-emerald-500/10">
										<span className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
											<FiTag size={14} />
											{promo.code} · −{discount} Kč
										</span>
										<button
											type="button"
											aria-label="Odebrat promo kód"
											onClick={handleRemovePromo}
											className="cursor-pointer text-emerald-600 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
										>
											<FiX size={16} />
										</button>
									</div>
								) : (
									<div className="flex gap-2">
										<input
											value={promoInput}
											onChange={(e) => setPromoInput(e.target.value)}
											placeholder="Promo kód"
											className={FIELD_CLASSES}
										/>
										<button
											type="button"
											onClick={handleApplyPromo}
											disabled={isValidatingPromo || !promoInput.trim()}
											className="shrink-0 cursor-pointer rounded-2xl border border-stone-200 px-4 text-sm font-semibold text-stone-700 transition hover:border-stone-400 disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500"
										>
											{isValidatingPromo ? '…' : 'Použít'}
										</button>
									</div>
								)}
								{promoError && <p className="mt-1.5 text-sm text-red-600">{promoError}</p>}
							</div>

							<button
								type="button"
								onClick={() => setStep('checkout')}
								className="flex cursor-pointer items-center justify-between rounded-full bg-stone-900 px-6 py-3.5 text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
							>
								<span className="text-sm font-semibold">Pokračovat k objednávce</span>
								<span className="text-sm font-bold">{total} Kč</span>
							</button>
						</>
					)}
				</div>
			)}

			{step === 'checkout' && (
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					{error && <p className="text-sm text-red-600">{error}</p>}

					<div>
						<label className="mb-1 block text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
							Jméno a příjmení
						</label>
						<input name="name" required placeholder="Jan Novák" className={FIELD_CLASSES} />
					</div>
					<div>
						<label className="mb-1 block text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
							Telefon
						</label>
						<input name="phone" required type="tel" placeholder="+420 700 000 000" className={FIELD_CLASSES} />
					</div>

					<div>
						<span className="mb-2 block text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
							Způsob vyzvednutí
						</span>
						<div className="flex gap-2">
							{(
								[
									['pickup', 'Osobní odběr'],
									['delivery', 'Doručení'],
								] as const
							).map(([value, label]) => (
								<button
									key={value}
									type="button"
									onClick={() => setDeliveryMethod(value)}
									className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
										deliveryMethod === value
											? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
											: 'border-stone-200 text-stone-700 hover:border-stone-400 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500'
									}`}
								>
									{label}
								</button>
							))}
						</div>
					</div>

					{deliveryMethod === 'delivery' && (
						<div>
							<label className="mb-1 block text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
								Adresa doručení
							</label>
							<input name="address" required placeholder="Ulice 123, Praha" className={FIELD_CLASSES} />
						</div>
					)}

					<div>
						<label className="mb-1 block text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
							Poznámka (nepovinné)
						</label>
						<textarea name="note" rows={2} placeholder="např. bez cibule" className={FIELD_CLASSES} />
					</div>

					<div className="flex gap-2 pt-1">
						<button
							type="button"
							onClick={() => setStep('cart')}
							className="cursor-pointer rounded-full border border-stone-200 px-5 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-400 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500"
						>
							Zpět
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex flex-1 cursor-pointer items-center justify-between rounded-full bg-(--accent) px-6 py-3.5 text-white transition hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50"
						>
							<span className="text-sm font-semibold">{isSubmitting ? 'Odesílání…' : 'Odeslat objednávku'}</span>
							<span className="text-sm font-bold">{total} Kč</span>
						</button>
					</div>
				</form>
			)}

			{step === 'confirmed' && placedOrder && (
				<OrderTracking
					slug={slug}
					orderId={placedOrder.id}
					orderNumber={placedOrder.orderNumber}
					onClose={handleClose}
				/>
			)}
		</Modal>
	)
}
