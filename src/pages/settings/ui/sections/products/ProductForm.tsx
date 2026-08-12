import { useState } from 'react'
import type { ChangeEvent } from 'react'
import { FiImage, FiPlus, FiTrash2, FiX } from 'react-icons/fi'
import { Button } from '@/shared/ui'
import { useBusiness } from '@/entities/business'
import type { Product, ProductAddon, ProductCategory, ProductVariant } from '@/entities/business'
import type { ProductDraft } from '@/shared/api/products'
import { generateTempId } from '@/shared/lib/id'
import { API_URL } from '@/shared/api/client'

const FIELD_CLASSES =
	'rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none'

type ProductFormProps = {
	categories: ProductCategory[]
	initialProduct: Product | null
	onAddCategory: (name: string) => Promise<ProductCategory>
	onSubmit: (draft: ProductDraft) => Promise<void>
	onCancel: () => void
}

export function ProductForm({ categories, initialProduct, onAddCategory, onSubmit, onCancel }: ProductFormProps) {
	const [name, setName] = useState(initialProduct?.name ?? '')
	const [description, setDescription] = useState(initialProduct?.description ?? '')
	const [icon, setIcon] = useState(initialProduct?.icon ?? '🍕')
	const [categoryId, setCategoryId] = useState(initialProduct?.categoryId ?? categories[0]?.id ?? '')
	const [variants, setVariants] = useState<ProductVariant[]>(
		initialProduct?.variants ?? [{ id: generateTempId('variant'), name: '', price: 0 }],
	)
	const [addons, setAddons] = useState<ProductAddon[]>(initialProduct?.addons ?? [])
	const [addingCategory, setAddingCategory] = useState(false)
	const [newCategoryName, setNewCategoryName] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
	const { uploadProductPhoto, removeProductPhoto } = useBusiness()

	async function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0]
		if (!file || !initialProduct) return
		setIsUploadingPhoto(true)
		try {
			await uploadProductPhoto(initialProduct.id, file)
		} finally {
			setIsUploadingPhoto(false)
			e.target.value = ''
		}
	}

	function updateVariant(id: string, field: 'name' | 'price', value: string) {
		setVariants((rows) =>
			rows.map((row) => (row.id === id ? { ...row, [field]: field === 'price' ? Number(value) : value } : row)),
		)
	}

	function updateAddon(id: string, field: 'name' | 'price', value: string) {
		setAddons((rows) =>
			rows.map((row) => (row.id === id ? { ...row, [field]: field === 'price' ? Number(value) : value } : row)),
		)
	}

	async function confirmNewCategory() {
		const trimmed = newCategoryName.trim()
		if (!trimmed) return
		const category = await onAddCategory(trimmed)
		setCategoryId(category.id)
		setNewCategoryName('')
		setAddingCategory(false)
	}

	const isValid = name.trim().length > 0 && categoryId.length > 0 && variants.some((v) => v.name.trim().length > 0)

	async function handleSubmit() {
		if (!isValid) return
		setIsSubmitting(true)
		try {
			await onSubmit({
				categoryId,
				name: name.trim(),
				description: description.trim(),
				icon: icon.trim() || '🍕',
				variants: variants
					.filter((v) => v.name.trim().length > 0)
					.map((v) => ({ name: v.name.trim(), price: v.price })),
				addons: addons.filter((a) => a.name.trim().length > 0).map((a) => ({ name: a.name.trim(), price: a.price })),
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="flex flex-col gap-5">
			{initialProduct && (
				<div>
					<label className="mb-1 block text-sm font-medium text-gray-700">Fotka produktu</label>
					<div className="flex items-center gap-3">
						{initialProduct.photoUrl ? (
							<div className="relative">
								<img
									src={`${API_URL}${initialProduct.photoUrl}`}
									alt=""
									className="size-16 rounded-lg object-cover"
								/>
								<button
									type="button"
									aria-label="Odebrat fotku"
									onClick={() => removeProductPhoto(initialProduct.id)}
									className="absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-gray-900 text-white"
								>
									<FiX size={12} />
								</button>
							</div>
						) : (
							<span className="flex size-16 items-center justify-center rounded-lg bg-gray-100 text-gray-400">
								<FiImage size={22} />
							</span>
						)}
						<label className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
							{isUploadingPhoto ? 'Nahrávání…' : initialProduct.photoUrl ? 'Změnit fotku' : 'Nahrát fotku'}
							<input type="file" accept="image/*" onChange={handlePhotoChange} disabled={isUploadingPhoto} className="hidden" />
						</label>
					</div>
				</div>
			)}

			<div className="flex gap-4">
				<div className="w-20 shrink-0">
					<label className="mb-1 block text-sm font-medium text-gray-700">Ikona</label>
					<input
						value={icon}
						onChange={(e) => setIcon(e.target.value)}
						className={`${FIELD_CLASSES} w-full text-center text-lg`}
						maxLength={2}
					/>
				</div>
				<div className="flex-1">
					<label className="mb-1 block text-sm font-medium text-gray-700">Název produktu</label>
					<input
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="např. Margherita"
						className={`${FIELD_CLASSES} w-full`}
					/>
				</div>
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium text-gray-700">Kategorie</label>
				{addingCategory ? (
					<div className="flex gap-2">
						<input
							value={newCategoryName}
							onChange={(e) => setNewCategoryName(e.target.value)}
							placeholder="název kategorie"
							className={`${FIELD_CLASSES} w-full`}
							autoFocus
						/>
						<Button variant="primary" onClick={confirmNewCategory} className="shrink-0">
							Přidat
						</Button>
						<Button variant="ghost" onClick={() => setAddingCategory(false)} className="shrink-0">
							Zrušit
						</Button>
					</div>
				) : (
					<div className="flex items-center gap-3">
						<select
							value={categoryId}
							onChange={(e) => setCategoryId(e.target.value)}
							className={`${FIELD_CLASSES} w-full`}
						>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name}
								</option>
							))}
						</select>
						<button
							type="button"
							onClick={() => setAddingCategory(true)}
							className="flex shrink-0 cursor-pointer items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
						>
							<FiPlus size={16} />
							Nová kategorie
						</button>
					</div>
				)}
			</div>

			<div>
				<label className="mb-1 block text-sm font-medium text-gray-700">Popis</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="např. Rajčatová omáčka, mozzarella, bazalka"
					rows={2}
					className={`${FIELD_CLASSES} w-full`}
				/>
			</div>

			<div>
				<div className="mb-1 flex items-center justify-between">
					<span className="text-sm font-medium text-gray-700">Varianty a ceny</span>
				</div>
				<div className="flex flex-col gap-2">
					{variants.map((variant) => (
						<div key={variant.id} className="flex items-center gap-2">
							<div className="flex-1">
								<input
									value={variant.name}
									onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
									placeholder="např. Malá 26 cm"
									className={`${FIELD_CLASSES} w-full`}
								/>
							</div>
							<input
								type="number"
								min={0}
								value={variant.price}
								onChange={(e) => updateVariant(variant.id, 'price', e.target.value)}
								className={`${FIELD_CLASSES} w-24`}
							/>
							<span className="text-sm text-gray-500">Kč</span>
							{variants.length > 1 && (
								<button
									type="button"
									aria-label="Odebrat variantu"
									onClick={() => setVariants((rows) => rows.filter((r) => r.id !== variant.id))}
									className="cursor-pointer text-gray-400 transition hover:text-red-600"
								>
									<FiTrash2 size={16} />
								</button>
							)}
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={() => setVariants((rows) => [...rows, { id: generateTempId('variant'), name: '', price: 0 }])}
					className="mt-2 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
				>
					<FiPlus size={16} />
					Přidat variantu
				</button>
			</div>

			<div>
				<span className="text-sm font-medium text-gray-700">Příplatky (nepovinné)</span>
				<div className="mt-1 flex flex-col gap-2">
					{addons.map((addon) => (
						<div key={addon.id} className="flex items-center gap-2">
							<div className="flex-1">
								<input
									value={addon.name}
									onChange={(e) => updateAddon(addon.id, 'name', e.target.value)}
									placeholder="např. Extra sýr"
									className={`${FIELD_CLASSES} w-full`}
								/>
							</div>
							<span className="text-sm text-gray-500">+</span>
							<input
								type="number"
								min={0}
								value={addon.price}
								onChange={(e) => updateAddon(addon.id, 'price', e.target.value)}
								className={`${FIELD_CLASSES} w-24`}
							/>
							<span className="text-sm text-gray-500">Kč</span>
							<button
								type="button"
								aria-label="Odebrat příplatek"
								onClick={() => setAddons((rows) => rows.filter((r) => r.id !== addon.id))}
								className="cursor-pointer text-gray-400 transition hover:text-red-600"
							>
								<FiTrash2 size={16} />
							</button>
						</div>
					))}
				</div>
				<button
					type="button"
					onClick={() => setAddons((rows) => [...rows, { id: generateTempId('addon'), name: '', price: 0 }])}
					className="mt-2 flex cursor-pointer items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
				>
					<FiPlus size={16} />
					Přidat příplatek
				</button>
			</div>

			<div className="flex justify-end gap-3 pt-2">
				<Button variant="ghost" onClick={onCancel}>
					Zrušit
				</Button>
				<Button variant="primary" onClick={handleSubmit} disabled={!isValid || isSubmitting}>
					{isSubmitting ? 'Ukládání…' : initialProduct ? 'Uložit změny' : 'Přidat produkt'}
				</Button>
			</div>
		</div>
	)
}
