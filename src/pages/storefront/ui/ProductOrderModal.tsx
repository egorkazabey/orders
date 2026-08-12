import { useState } from 'react'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { Modal } from '@/shared/ui'
import type { Product } from '@/entities/business'
import { API_URL } from '@/shared/api/client'
import { createCartItem, type CartItem } from '../model/cart'

type ProductOrderModalProps = {
	product: Product
	onClose: () => void
	onAddToCart: (item: CartItem) => void
}

export function ProductOrderModal({ product, onClose, onAddToCart }: ProductOrderModalProps) {
	const [variantId, setVariantId] = useState(product.variants[0]?.id ?? '')
	const [addonIds, setAddonIds] = useState<string[]>([])
	const [quantity, setQuantity] = useState(1)

	const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]
	const selectedAddons = product.addons.filter((a) => addonIds.includes(a.id))
	const unitPrice = (variant?.price ?? 0) + selectedAddons.reduce((sum, a) => sum + a.price, 0)

	function toggleAddon(id: string) {
		setAddonIds((ids) => (ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]))
	}

	function handleAddToCart() {
		if (!variant) return
		onAddToCart(createCartItem(product, variant, selectedAddons, quantity))
		onClose()
	}

	return (
		<Modal open title={product.name} onClose={onClose}>
			<div className="flex flex-col gap-6">
				<div className="flex items-center gap-3">
					{product.photoUrl ? (
						<img src={`${API_URL}${product.photoUrl}`} alt="" className="size-14 shrink-0 rounded-xl object-cover" />
					) : (
						<span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-(--accent-soft) text-2xl">
							{product.icon}
						</span>
					)}
					{product.description && <p className="text-sm text-stone-500 dark:text-stone-400">{product.description}</p>}
				</div>

				{product.variants.length > 1 && (
					<div>
						<span className="mb-2 block text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
							Velikost
						</span>
						<div className="flex flex-wrap gap-2">
							{product.variants.map((v) => (
								<button
									key={v.id}
									type="button"
									onClick={() => setVariantId(v.id)}
									className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
										v.id === variantId
											? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
											: 'border-stone-200 text-stone-700 hover:border-stone-400 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500'
									}`}
								>
									{v.name} · {v.price} Kč
								</button>
							))}
						</div>
					</div>
				)}

				{product.addons.length > 0 && (
					<div>
						<span className="mb-2 block text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
							Příplatky
						</span>
						<div className="flex flex-wrap gap-2">
							{product.addons.map((addon) => (
								<button
									key={addon.id}
									type="button"
									onClick={() => toggleAddon(addon.id)}
									className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition ${
										addonIds.includes(addon.id)
											? 'border-(--accent) bg-(--accent-soft) text-(--accent-soft-text)'
											: 'border-stone-200 text-stone-700 hover:border-stone-400 dark:border-stone-600 dark:text-stone-300 dark:hover:border-stone-500'
									}`}
								>
									{addon.name} +{addon.price} Kč
								</button>
							))}
						</div>
					</div>
				)}

				<div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3 dark:bg-stone-900">
					<span className="text-sm font-semibold text-stone-700 dark:text-stone-300">Množství</span>
					<div className="flex items-center gap-4">
						<button
							type="button"
							aria-label="Snížit množství"
							onClick={() => setQuantity((q) => Math.max(1, q - 1))}
							className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600"
						>
							<FiMinus size={14} />
						</button>
						<span className="w-4 text-center text-sm font-bold text-stone-900 dark:text-stone-50">{quantity}</span>
						<button
							type="button"
							aria-label="Zvýšit množství"
							onClick={() => setQuantity((q) => q + 1)}
							className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-white text-stone-700 shadow-sm transition hover:bg-stone-100 dark:bg-stone-700 dark:text-stone-200 dark:hover:bg-stone-600"
						>
							<FiPlus size={14} />
						</button>
					</div>
				</div>

				<button
					type="button"
					onClick={handleAddToCart}
					disabled={!variant}
					className="flex cursor-pointer items-center justify-between rounded-full bg-(--accent) px-6 py-3.5 text-white transition hover:bg-(--accent-hover) disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span className="text-sm font-semibold">Přidat do košíku</span>
					<span className="text-sm font-bold">{unitPrice * quantity} Kč</span>
				</button>
			</div>
		</Modal>
	)
}
