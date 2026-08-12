import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useParams } from 'react-router-dom'
import { FiShare2, FiShoppingBag } from 'react-icons/fi'
import { isBusinessOpenNow } from '@/entities/business'
import type { Product, StorefrontData } from '@/entities/business'
import { getStorefront } from '@/shared/api/storefront'
import { ApiError } from '@/shared/api/client'
import { planFeaturesFor } from '@/shared/config/planFeatures'
import { accentCssVars } from '@/shared/config/storefrontTheme'
import { cartCount, cartTotal, type CartItem } from '../model/cart'
import { StorefrontDataContext } from '../model/context'
import { ProductsTab } from './ProductsTab'
import { AboutTab } from './AboutTab'
import { ProductOrderModal } from './ProductOrderModal'
import { CartModal } from './CartModal'
type Tab = 'products' | 'about'

export function StorefrontPage() {
	const { slug = '' } = useParams<{ slug: string }>()
	const [business, setBusiness] = useState<StorefrontData | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [loadedSlug, setLoadedSlug] = useState<string | null>(null)
	const [activeTab, setActiveTab] = useState<Tab>('products')
	const [cartItems, setCartItems] = useState<CartItem[]>([])
	const [orderingProduct, setOrderingProduct] = useState<Product | null>(null)
	const [isCartOpen, setCartOpen] = useState(false)
	const [shareCopied, setShareCopied] = useState(false)

	const isLoading = loadedSlug !== slug

	useEffect(() => {
		let cancelled = false

		getStorefront(slug)
			.then((res) => {
				if (cancelled) return
				setBusiness(res.business)
				setError(null)
				setLoadedSlug(slug)
			})
			.catch((err) => {
				if (cancelled) return
				setError(err instanceof ApiError ? err.message : 'Web se nepodařilo načíst')
				setLoadedSlug(slug)
			})

		return () => {
			cancelled = true
		}
	}, [slug])

	function addToCart(item: CartItem) {
		setCartItems((items) => [...items, item])
	}

	function updateQuantity(id: string, quantity: number) {
		setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
	}

	function removeFromCart(id: string) {
		setCartItems((items) => items.filter((item) => item.id !== id))
	}

	async function handleShare() {
		try {
			await navigator.clipboard.writeText(window.location.href)
			setShareCopied(true)
			setTimeout(() => setShareCopied(false), 2000)
		} catch {
			// clipboard unavailable — silently ignore
		}
	}

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
				<p className="text-sm text-stone-500">Načítání…</p>
			</div>
		)
	}

	if (error || !business) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
				<p className="text-sm text-stone-500">{error ?? 'Web se nepodařilo načíst'}</p>
			</div>
		)
	}

	const isOpen = isBusinessOpenNow(business.schedule)
	const isDark = business.storefrontTheme === 'dark'

	return (
		<StorefrontDataContext.Provider value={business}>
			<div
				className={isDark ? 'dark' : ''}
				style={accentCssVars(business.accentColor) as CSSProperties}
			>
			<div className="min-h-screen bg-stone-50 pb-28 dark:bg-stone-950">
				<div className="rounded-b-4xl bg-stone-900 px-6 pt-8 pb-12 text-white">
					<div className="mx-auto flex max-w-2xl items-start justify-between gap-4">
						<div className="flex items-center gap-3">
							<span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">
								{business.name.slice(0, 1).toUpperCase()}
							</span>
							<div>
								<h1 className="text-xl font-bold">{business.name}</h1>
								{business.tagline && <p className="mt-0.5 text-sm text-white/70">{business.tagline}</p>}
								<span
									className={`mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
										isOpen ? 'bg-emerald-400/15 text-emerald-300' : 'bg-red-400/15 text-red-300'
									}`}
								>
									<span className={`size-1.5 rounded-full ${isOpen ? 'bg-emerald-400' : 'bg-red-400'}`} />
									{isOpen ? 'Otevřeno' : 'Zavřeno'}
								</span>
							</div>
						</div>

						<button
							type="button"
							onClick={handleShare}
							aria-label="Sdílet"
							className="flex shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 p-2.5 text-white transition hover:bg-white/20"
						>
							<FiShare2 size={16} />
						</button>
					</div>
					{shareCopied && (
						<p className="mx-auto mt-2 max-w-2xl text-right text-xs font-medium text-emerald-300">
							Odkaz zkopírován
						</p>
					)}
				</div>

				<div className="mx-auto -mt-6 max-w-2xl px-6">
					<nav className="flex gap-1 rounded-full bg-white p-1 shadow-md shadow-stone-900/5 dark:bg-stone-800 dark:shadow-none">
						{(
							[
								['products', 'Produkty'],
								['about', 'O nás'],
							] as const
						).map(([id, label]) => (
							<button
								key={id}
								type="button"
								onClick={() => setActiveTab(id)}
								className={`flex-1 cursor-pointer rounded-full py-2.5 text-sm font-semibold transition ${
									activeTab === id
										? 'bg-[var(--accent)] text-white'
										: 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'
								}`}
							>
								{label}
							</button>
						))}
					</nav>

					<div className="py-8">
						{activeTab === 'products' && <ProductsTab onOrder={setOrderingProduct} />}
						{activeTab === 'about' && <AboutTab />}
					</div>

					{planFeaturesFor(business.subscription?.plan).branding && (
						<p className="pb-4 text-center text-xs text-stone-400 dark:text-stone-600">Vytvořeno s Orders</p>
					)}
				</div>

				{cartItems.length > 0 && (
					<div className="fixed inset-x-0 bottom-6 flex justify-center px-4">
						<button
							type="button"
							onClick={() => setCartOpen(true)}
							className="flex cursor-pointer items-center gap-4 rounded-full bg-[var(--accent)] px-6 py-3.5 text-white shadow-xl shadow-black/20 transition hover:bg-[var(--accent-hover)]"
						>
							<span className="flex items-center gap-2 text-sm font-semibold">
								<FiShoppingBag size={18} />
								Košík ({cartCount(cartItems)})
							</span>
							<span className="rounded-full bg-white/15 px-2.5 py-0.5 text-sm font-semibold">
								{cartTotal(cartItems)} Kč
							</span>
						</button>
					</div>
				)}

				{orderingProduct && (
					<ProductOrderModal
						product={orderingProduct}
						onClose={() => setOrderingProduct(null)}
						onAddToCart={addToCart}
					/>
				)}

				{isCartOpen && (
					<CartModal
						slug={slug}
						items={cartItems}
						onClose={() => setCartOpen(false)}
						onUpdateQuantity={updateQuantity}
						onRemove={removeFromCart}
						onOrderPlaced={() => setCartItems([])}
					/>
				)}
			</div>
			</div>
		</StorefrontDataContext.Provider>
	)
}
