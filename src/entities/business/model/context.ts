import { createContext } from 'react'
import type { DaySchedule, Product, ProductCategory } from './types'
import type { ProductDraft } from '@/shared/api/products'

export type BusinessContextValue = {
	schedule: DaySchedule[]
	categories: ProductCategory[]
	products: Product[]
	isLoading: boolean
	error: string | null
	toggleDay: (dayId: string) => void
	addTimeRange: (dayId: string) => void
	removeTimeRange: (dayId: string, rangeId: string) => void
	updateTimeRange: (dayId: string, rangeId: string, field: 'fromTime' | 'toTime', value: string) => void
	copyHoursToDays: (fromDayId: string, toDayIds: string[]) => void
	addCategory: (name: string) => Promise<ProductCategory>
	createProduct: (draft: ProductDraft) => Promise<void>
	updateProduct: (id: string, draft: ProductDraft) => Promise<void>
	deleteProduct: (id: string) => Promise<void>
	setProductSoldOut: (id: string, soldOut: boolean) => Promise<void>
	duplicateProduct: (id: string) => Promise<void>
	reorderCategories: (orderedIds: string[]) => void
	reorderProducts: (orderedIds: string[]) => void
	uploadProductPhoto: (id: string, file: File) => Promise<void>
	removeProductPhoto: (id: string) => Promise<void>
}

export const BusinessContext = createContext<BusinessContextValue | null>(null)
