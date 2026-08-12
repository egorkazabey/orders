import { apiRequest, API_URL } from './client'
import type { Product, ProductCategory } from '@/entities/business'

export function getCategories(token: string) {
	return apiRequest<{ categories: ProductCategory[] }>('/products/categories', { token })
}

export function createCategory(token: string, name: string) {
	return apiRequest<{ category: ProductCategory }>('/products/categories', {
		method: 'POST',
		body: { name },
		token,
	})
}

export function getProducts(token: string) {
	return apiRequest<{ products: Product[] }>('/products', { token })
}

export type ProductDraft = {
	categoryId: string
	name: string
	description: string
	icon: string
	variants: { name: string; price: number }[]
	addons: { name: string; price: number }[]
}

export function createProduct(token: string, draft: ProductDraft) {
	return apiRequest<{ product: Product }>('/products', { method: 'POST', body: draft, token })
}

export function updateProduct(token: string, id: string, draft: ProductDraft) {
	return apiRequest<{ product: Product }>(`/products/${id}`, { method: 'PATCH', body: draft, token })
}

export function deleteProduct(token: string, id: string) {
	return apiRequest<void>(`/products/${id}`, { method: 'DELETE', token })
}

export function setProductSoldOut(token: string, id: string, soldOut: boolean) {
	return apiRequest<{ product: Product }>(`/products/${id}/sold-out`, {
		method: 'PATCH',
		body: { soldOut },
		token,
	})
}

export function duplicateProduct(token: string, id: string) {
	return apiRequest<{ product: Product }>(`/products/${id}/duplicate`, { method: 'POST', token })
}

export function reorderCategories(token: string, orderedIds: string[]) {
	return apiRequest<void>('/products/categories/reorder', { method: 'PATCH', body: { orderedIds }, token })
}

export function reorderProducts(token: string, orderedIds: string[]) {
	return apiRequest<void>('/products/reorder', { method: 'PATCH', body: { orderedIds }, token })
}

export async function uploadProductPhoto(token: string, id: string, file: File) {
	const formData = new FormData()
	formData.append('photo', file)
	const res = await fetch(`${API_URL}/products/${id}/photo`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: formData,
	})
	if (!res.ok) throw new Error('Nahrání fotky se nezdařilo')
	return res.json() as Promise<{ product: Product }>
}

export function removeProductPhoto(token: string, id: string) {
	return apiRequest<{ product: Product }>(`/products/${id}/photo`, { method: 'DELETE', token })
}
