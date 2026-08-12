import type { Product, ProductAddon, ProductVariant } from '@/entities/business'

export type CartItem = {
	id: string
	productId: string
	productName: string
	productIcon: string
	variantId: string
	variantName: string
	addonIds: string[]
	addonNames: string[]
	quantity: number
	unitPrice: number
}

let nextCartItemId = 0

export function createCartItem(
	product: Product,
	variant: ProductVariant,
	addons: ProductAddon[],
	quantity: number,
): CartItem {
	nextCartItemId += 1
	return {
		id: `cart-${nextCartItemId}`,
		productId: product.id,
		productName: product.name,
		productIcon: product.icon,
		variantId: variant.id,
		variantName: variant.name,
		addonIds: addons.map((a) => a.id),
		addonNames: addons.map((a) => a.name),
		quantity,
		unitPrice: variant.price + addons.reduce((sum, a) => sum + a.price, 0),
	}
}

export function cartItemTotal(item: CartItem) {
	return item.unitPrice * item.quantity
}

export function cartTotal(items: CartItem[]) {
	return items.reduce((sum, item) => sum + cartItemTotal(item), 0)
}

export function cartCount(items: CartItem[]) {
	return items.reduce((sum, item) => sum + item.quantity, 0)
}
