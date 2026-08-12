import type { ProductVariant } from '../model/types'

export function formatPriceRange(variants: ProductVariant[]) {
	const prices = variants.map((v) => v.price)
	const min = Math.min(...prices)
	const max = Math.max(...prices)
	return min === max ? `${min} Kč` : `od ${min} Kč`
}
