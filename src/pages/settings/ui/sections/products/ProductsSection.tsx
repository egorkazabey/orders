import { useRef, useState } from 'react'
import { FiCopy, FiEdit2, FiMove, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi'
import { Button, Modal, UndoToast } from '@/shared/ui'
import { formatPriceRange, useBusiness } from '@/entities/business'
import type { Product, ProductCategory } from '@/entities/business'
import type { ProductDraft } from '@/shared/api/products'
import { API_URL } from '@/shared/api/client'
import { ProductForm } from './ProductForm'

const UNDO_DELAY_MS = 5000

function moveId(ids: string[], sourceId: string, targetId: string): string[] {
	if (sourceId === targetId) return ids
	const next = ids.filter((id) => id !== sourceId)
	const targetIndex = next.indexOf(targetId)
	next.splice(targetIndex, 0, sourceId)
	return next
}

export function ProductsSection() {
	const {
		categories,
		products,
		isLoading,
		error,
		addCategory,
		createProduct,
		updateProduct,
		deleteProduct,
		setProductSoldOut,
		duplicateProduct,
		reorderCategories,
		reorderProducts,
	} = useBusiness()
	const [draggedCategoryId, setDraggedCategoryId] = useState<string | null>(null)
	const [draggedProductId, setDraggedProductId] = useState<string | null>(null)
	const [isModalOpen, setModalOpen] = useState(false)
	const [editingProduct, setEditingProduct] = useState<Product | null>(null)
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const [pendingDelete, setPendingDelete] = useState<Product | null>(null)
	const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

	const query = search.trim().toLowerCase()
	const withoutPending = pendingDelete ? products.filter((p) => p.id !== pendingDelete.id) : products
	const visibleProducts = query ? withoutPending.filter((p) => p.name.toLowerCase().includes(query)) : withoutPending

	function openAddModal() {
		setEditingProduct(null)
		setModalOpen(true)
	}

	function openEditModal(product: Product) {
		setEditingProduct(product)
		setModalOpen(true)
	}

	function closeModal() {
		setModalOpen(false)
		setEditingProduct(null)
	}

	async function handleSubmit(draft: ProductDraft) {
		if (editingProduct) {
			await updateProduct(editingProduct.id, draft)
		} else {
			await createProduct(draft)
		}
		closeModal()
	}

	function handleDelete(product: Product) {
		setConfirmDeleteId(null)
		setPendingDelete(product)
		deleteTimerRef.current = setTimeout(() => {
			deleteProduct(product.id)
			setPendingDelete(null)
		}, UNDO_DELAY_MS)
	}

	function handleUndoDelete() {
		if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current)
		setPendingDelete(null)
	}

	function handleCategoryDrop(targetCategory: ProductCategory) {
		if (draggedCategoryId) {
			reorderCategories(moveId(categories.map((c) => c.id), draggedCategoryId, targetCategory.id))
		}
		setDraggedCategoryId(null)
	}

	function handleProductDrop(targetProduct: Product, categoryProductIds: string[]) {
		if (draggedProductId && categoryProductIds.includes(draggedProductId)) {
			reorderProducts(moveId(categoryProductIds, draggedProductId, targetProduct.id))
		}
		setDraggedProductId(null)
	}

	return (
		<div className="max-w-4xl rounded-xl border border-gray-200 bg-white">
			<div className="flex items-start justify-between gap-4 border-b border-gray-200 px-6 py-5">
				<div>
					<h2 className="text-xl font-semibold text-gray-900">Nabídka produktů</h2>
					<p className="mt-1 text-sm text-gray-500">
						Spravujte produkty, které si zákazníci mohou objednat na vašem webu.
					</p>
				</div>
				<Button variant="primary" onClick={openAddModal} className="flex shrink-0 items-center gap-1.5">
					<FiPlus size={16} />
					Přidat produkt
				</Button>
			</div>

			{products.length > 0 && (
				<div className="border-b border-gray-100 px-6 py-3">
					<div className="relative max-w-xs">
						<FiSearch size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Hledat produkt…"
							className="w-full rounded-lg border border-gray-300 py-1.5 pr-3 pl-8 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</div>
				</div>
			)}

			{error && <p className="px-6 pt-4 text-sm text-red-600">{error}</p>}

			{isLoading ? (
				<p className="px-6 py-10 text-center text-sm text-gray-500">Načítání…</p>
			) : products.length === 0 ? (
				<p className="px-6 py-10 text-center text-sm text-gray-500">
					Zatím nemáte žádné produkty. Přidejte první produkt tlačítkem výše.
				</p>
			) : visibleProducts.length === 0 ? (
				<p className="px-6 py-10 text-center text-sm text-gray-500">Žádný produkt neodpovídá hledání.</p>
			) : (
				categories.map((category) => {
					const categoryProducts = visibleProducts.filter((p) => p.categoryId === category.id)
					if (categoryProducts.length === 0) return null
					const categoryProductIds = categoryProducts.map((p) => p.id)

					return (
						<div
							key={category.id}
							draggable={!query}
							onDragStart={() => setDraggedCategoryId(category.id)}
							onDragOver={(e) => e.preventDefault()}
							onDrop={() => handleCategoryDrop(category)}
						>
							<h3 className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-6 py-2 text-sm font-semibold text-gray-600">
								{!query && <FiMove size={13} className="cursor-grab text-gray-400" />}
								{category.name}
							</h3>
							<ul>
								{categoryProducts.map((product) => (
									<li
										key={product.id}
										draggable={!query}
										onDragStart={() => setDraggedProductId(product.id)}
										onDragOver={(e) => e.preventDefault()}
										onDrop={(e) => {
											e.stopPropagation()
											handleProductDrop(product, categoryProductIds)
										}}
										className="flex items-center gap-4 border-b border-gray-100 px-6 py-4 last:border-b-0"
									>
										{!query && <FiMove size={14} className="shrink-0 cursor-grab text-gray-300" />}
										{product.photoUrl ? (
											<img
												src={`${API_URL}${product.photoUrl}`}
												alt=""
												className={[
													'size-11 shrink-0 rounded-full object-cover',
													product.soldOut ? 'opacity-40 grayscale' : '',
												].join(' ')}
											/>
										) : (
											<span
												className={[
													'flex size-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xl',
													product.soldOut ? 'opacity-40 grayscale' : '',
												].join(' ')}
											>
												{product.icon}
											</span>
										)}

										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-2">
												<p className={['font-medium', product.soldOut ? 'text-gray-400' : 'text-gray-900'].join(' ')}>
													{product.name}
												</p>
												{product.soldOut && (
													<span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
														Vyprodáno
													</span>
												)}
											</div>
											{product.description && (
												<p className="truncate text-sm text-gray-500">{product.description}</p>
											)}
											{product.addons.length > 0 && (
												<p className="mt-0.5 text-xs text-gray-400">
													{product.addons.length} příplatk{product.addons.length === 1 ? 'ek' : 'y'}
												</p>
											)}
										</div>

										<label className="flex shrink-0 items-center gap-2 text-xs font-medium text-gray-500">
											<input
												type="checkbox"
												checked={product.soldOut}
												onChange={(e) => setProductSoldOut(product.id, e.target.checked)}
												className="size-4 accent-gray-600"
											/>
											Vyprodáno
										</label>

										<span className="shrink-0 text-sm font-medium text-gray-900">
											{formatPriceRange(product.variants)}
										</span>

										{confirmDeleteId === product.id ? (
											<div className="flex shrink-0 items-center gap-2 text-sm">
												<span className="text-gray-500">Smazat?</span>
												<button
													type="button"
													onClick={() => handleDelete(product)}
													className="cursor-pointer font-medium text-red-600 hover:text-red-700"
												>
													Ano
												</button>
												<button
													type="button"
													onClick={() => setConfirmDeleteId(null)}
													className="cursor-pointer font-medium text-gray-500 hover:text-gray-700"
												>
													Zrušit
												</button>
											</div>
										) : (
											<div className="flex shrink-0 items-center gap-3">
												<button
													type="button"
													aria-label="Duplikovat produkt"
													onClick={() => duplicateProduct(product.id)}
													className="cursor-pointer text-gray-400 transition hover:text-blue-600"
												>
													<FiCopy size={16} />
												</button>
												<button
													type="button"
													aria-label="Upravit produkt"
													onClick={() => openEditModal(product)}
													className="cursor-pointer text-gray-400 transition hover:text-blue-600"
												>
													<FiEdit2 size={16} />
												</button>
												<button
													type="button"
													aria-label="Smazat produkt"
													onClick={() => setConfirmDeleteId(product.id)}
													className="cursor-pointer text-gray-400 transition hover:text-red-600"
												>
													<FiTrash2 size={16} />
												</button>
											</div>
										)}
									</li>
								))}
							</ul>
						</div>
					)
				})
			)}

			<Modal open={isModalOpen} title={editingProduct ? 'Upravit produkt' : 'Nový produkt'} onClose={closeModal}>
				<ProductForm
					categories={categories}
					initialProduct={editingProduct}
					onAddCategory={addCategory}
					onSubmit={handleSubmit}
					onCancel={closeModal}
				/>
			</Modal>

			{pendingDelete && (
				<UndoToast message={`Produkt „${pendingDelete.name}“ byl smazán.`} onUndo={handleUndoDelete} />
			)}
		</div>
	)
}
