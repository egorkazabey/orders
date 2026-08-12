import { FiPlus } from 'react-icons/fi'
import { formatPriceRange } from '@/entities/business'
import type { Product } from '@/entities/business'
import { API_URL } from '@/shared/api/client'
import { useStorefrontData } from '../model/context'

type ProductsTabProps = {
	onOrder: (product: Product) => void
}

export function ProductsTab({ onOrder }: ProductsTabProps) {
	const business = useStorefrontData()

	if (business.products.length === 0) {
		return (
			<p className="py-10 text-center text-sm text-stone-500 dark:text-stone-400">
				Zatím zde nejsou žádné produkty.
			</p>
		)
	}

	return (
		<div className="flex flex-col gap-9">
			{business.categories.map((category) => {
				const categoryProducts = business.products.filter((p) => p.categoryId === category.id)
				if (categoryProducts.length === 0) return null

				return (
					<div key={category.id}>
						<h2 className="mb-4 border-l-4 border-[var(--accent)] pl-3 text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
							{category.name}
						</h2>
						<div className="flex flex-col gap-3">
							{categoryProducts.map((product) => (
								<button
									key={product.id}
									type="button"
									disabled={product.soldOut}
									onClick={() => onOrder(product)}
									className={[
										'group flex w-full items-center gap-4 rounded-2xl bg-white p-3 text-left shadow-sm shadow-stone-900/5 transition dark:bg-stone-800 dark:shadow-none',
										product.soldOut ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:shadow-md',
									].join(' ')}
								>
									{product.photoUrl ? (
										<img
											src={`${API_URL}${product.photoUrl}`}
											alt=""
											className="size-14 shrink-0 rounded-xl object-cover"
										/>
									) : (
										<span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-2xl">
											{product.icon}
										</span>
									)}
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2">
											<p className="font-semibold text-stone-900 dark:text-stone-50">{product.name}</p>
											{product.soldOut && (
												<span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500 dark:bg-stone-700 dark:text-stone-400">
													Vyprodáno
												</span>
											)}
										</div>
										{product.description && (
											<p className="truncate text-sm text-stone-500 dark:text-stone-400">{product.description}</p>
										)}
										<p className="mt-1 text-sm font-bold text-stone-900 dark:text-stone-50">
											{formatPriceRange(product.variants)}
										</p>
									</div>
									{!product.soldOut && (
										<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white transition group-hover:bg-[var(--accent)] dark:bg-stone-700">
											<FiPlus size={16} />
										</span>
									)}
								</button>
							))}
						</div>
					</div>
				)
			})}
		</div>
	)
}
