import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import * as scheduleApi from '@/shared/api/schedule'
import * as productsApi from '@/shared/api/products'
import type { ProductDraft } from '@/shared/api/products'
import { useSession } from '@/entities/session'
import { generateTempId } from '@/shared/lib/id'
import { BusinessContext } from './context'
import type { DaySchedule, Product, ProductCategory } from './types'
import { sortByWeekday } from './types'

function toErrorMessage(err: unknown, fallback: string) {
	return err instanceof Error ? err.message : fallback
}

export function BusinessProvider({ children }: { children: ReactNode }) {
	const { token } = useSession()
	const [schedule, setSchedule] = useState<DaySchedule[]>([])
	const [categories, setCategories] = useState<ProductCategory[]>([])
	const [products, setProducts] = useState<Product[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!token) return
		let cancelled = false

		async function load() {
			setIsLoading(true)
			try {
				const [scheduleRes, categoriesRes, productsRes] = await Promise.all([
					scheduleApi.getSchedule(token!),
					productsApi.getCategories(token!),
					productsApi.getProducts(token!),
				])
				if (cancelled) return
				setSchedule(sortByWeekday(scheduleRes.schedule))
				setCategories(categoriesRes.categories)
				setProducts(productsRes.products)
			} catch (err) {
				if (!cancelled) setError(toErrorMessage(err, 'Nepodařilo se načíst data'))
			} finally {
				if (!cancelled) setIsLoading(false)
			}
		}

		load()
		return () => {
			cancelled = true
		}
	}, [token])

	async function persistSchedule(next: DaySchedule[]) {
		setSchedule(next)
		if (!token) return
		try {
			const res = await scheduleApi.updateSchedule(
				token,
				next.map((day) => ({
					dayId: day.dayId,
					enabled: day.enabled,
					ranges: day.ranges.map((r) => ({ fromTime: r.fromTime, toTime: r.toTime })),
				})),
			)
			setSchedule(sortByWeekday(res.schedule))
		} catch (err) {
			setError(toErrorMessage(err, 'Nepodařilo se uložit otevírací dobu'))
		}
	}

	function toggleDay(dayId: string) {
		persistSchedule(
			schedule.map((day) =>
				day.dayId === dayId
					? {
							...day,
							enabled: !day.enabled,
							ranges: day.ranges.length > 0 ? day.ranges : [{ id: generateTempId('range'), fromTime: '08:00', toTime: '16:00' }],
						}
					: day,
			),
		)
	}

	function addTimeRange(dayId: string) {
		persistSchedule(
			schedule.map((day) =>
				day.dayId === dayId
					? { ...day, ranges: [...day.ranges, { id: generateTempId('range'), fromTime: '08:00', toTime: '16:00' }] }
					: day,
			),
		)
	}

	function removeTimeRange(dayId: string, rangeId: string) {
		persistSchedule(
			schedule.map((day) =>
				day.dayId === dayId ? { ...day, ranges: day.ranges.filter((r) => r.id !== rangeId) } : day,
			),
		)
	}

	function updateTimeRange(dayId: string, rangeId: string, field: 'fromTime' | 'toTime', value: string) {
		persistSchedule(
			schedule.map((day) =>
				day.dayId === dayId
					? { ...day, ranges: day.ranges.map((r) => (r.id === rangeId ? { ...r, [field]: value } : r)) }
					: day,
			),
		)
	}

	function copyHoursToDays(fromDayId: string, toDayIds: string[]) {
		const source = schedule.find((day) => day.dayId === fromDayId)
		if (!source) return
		persistSchedule(
			schedule.map((day) =>
				toDayIds.includes(day.dayId)
					? {
							...day,
							enabled: source.enabled,
							ranges: source.ranges.map((r) => ({
								id: generateTempId('range'),
								fromTime: r.fromTime,
								toTime: r.toTime,
							})),
						}
					: day,
			),
		)
	}

	async function addCategory(name: string): Promise<ProductCategory> {
		const existing = categories.find((c) => c.name.toLowerCase() === name.toLowerCase())
		if (existing) return existing
		if (!token) throw new Error('Not authenticated')

		const res = await productsApi.createCategory(token, name)
		setCategories((prev) => [...prev, res.category])
		return res.category
	}

	async function createProduct(draft: ProductDraft) {
		if (!token) return
		try {
			const res = await productsApi.createProduct(token, draft)
			setProducts((prev) => [...prev, res.product])
		} catch (err) {
			setError(toErrorMessage(err, 'Nepodařilo se vytvořit produkt'))
		}
	}

	async function updateProduct(id: string, draft: ProductDraft) {
		if (!token) return
		try {
			const res = await productsApi.updateProduct(token, id, draft)
			setProducts((prev) => prev.map((p) => (p.id === id ? res.product : p)))
		} catch (err) {
			setError(toErrorMessage(err, 'Nepodařilo se uložit produkt'))
		}
	}

	async function deleteProduct(id: string) {
		if (!token) return
		try {
			await productsApi.deleteProduct(token, id)
			setProducts((prev) => prev.filter((p) => p.id !== id))
		} catch (err) {
			setError(toErrorMessage(err, 'Nepodařilo se smazat produkt'))
		}
	}

	async function setProductSoldOut(id: string, soldOut: boolean) {
		if (!token) return
		setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, soldOut } : p)))
		try {
			await productsApi.setProductSoldOut(token, id, soldOut)
		} catch (err) {
			setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, soldOut: !soldOut } : p)))
			setError(toErrorMessage(err, 'Nepodařilo se změnit dostupnost produktu'))
		}
	}

	async function duplicateProduct(id: string) {
		if (!token) return
		try {
			const res = await productsApi.duplicateProduct(token, id)
			setProducts((prev) => [...prev, res.product])
		} catch (err) {
			setError(toErrorMessage(err, 'Nepodařilo se duplikovat produkt'))
		}
	}

	function reorderCategories(orderedIds: string[]) {
		setCategories((prev) => {
			const byId = new Map(prev.map((c) => [c.id, c]))
			return orderedIds.map((id) => byId.get(id)).filter((c): c is ProductCategory => Boolean(c))
		})
		if (!token) return
		productsApi
			.reorderCategories(token, orderedIds)
			.catch((err) => setError(toErrorMessage(err, 'Nepodařilo se uložit pořadí kategorií')))
	}

	function reorderProducts(orderedIds: string[]) {
		setProducts((prev) => {
			const byId = new Map(prev.map((p) => [p.id, p]))
			const reordered = orderedIds.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p))
			const reorderedIds = new Set(orderedIds)
			const untouched = prev.filter((p) => !reorderedIds.has(p.id))
			return [...untouched, ...reordered]
		})
		if (!token) return
		productsApi
			.reorderProducts(token, orderedIds)
			.catch((err) => setError(toErrorMessage(err, 'Nepodařilo se uložit pořadí produktů')))
	}

	async function uploadProductPhoto(id: string, file: File) {
		if (!token) return
		try {
			const res = await productsApi.uploadProductPhoto(token, id, file)
			setProducts((prev) => prev.map((p) => (p.id === id ? res.product : p)))
		} catch (err) {
			setError(toErrorMessage(err, 'Nepodařilo se nahrát fotku'))
		}
	}

	async function removeProductPhoto(id: string) {
		if (!token) return
		try {
			const res = await productsApi.removeProductPhoto(token, id)
			setProducts((prev) => prev.map((p) => (p.id === id ? res.product : p)))
		} catch (err) {
			setError(toErrorMessage(err, 'Nepodařilo se odebrat fotku'))
		}
	}

	const value = {
		schedule,
		categories,
		products,
		isLoading,
		error,
		toggleDay,
		addTimeRange,
		removeTimeRange,
		updateTimeRange,
		copyHoursToDays,
		addCategory,
		createProduct,
		updateProduct,
		deleteProduct,
		setProductSoldOut,
		duplicateProduct,
		reorderCategories,
		reorderProducts,
		uploadProductPhoto,
		removeProductPhoto,
	}

	return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}
