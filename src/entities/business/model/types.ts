export type TimeRange = {
	id: string
	fromTime: string
	toTime: string
}

export type DaySchedule = {
	id: string
	dayId: string
	enabled: boolean
	ranges: TimeRange[]
}

export type ProductVariant = {
	id: string
	name: string
	price: number
}

export type ProductAddon = {
	id: string
	name: string
	price: number
}

export type ProductCategory = {
	id: string
	name: string
}

export type Product = {
	id: string
	categoryId: string
	name: string
	description: string
	icon: string
	photoUrl: string | null
	soldOut: boolean
	variants: ProductVariant[]
	addons: ProductAddon[]
}

export type Subscription = {
	plan: string
	status: string
	currentPeriodEnd: string | null
}

export type StorefrontTheme = 'light' | 'dark'
export type AccentColor = 'orange' | 'blue' | 'emerald' | 'rose' | 'violet'

export type Business = {
	id: string
	slug: string
	name: string
	phone: string
	description: string
	prepTimeMinutes: number
	soundEnabled: boolean
	ringTone: 'classic' | 'chime' | 'alert'
	quietHoursStart: string | null
	quietHoursEnd: string | null
	storefrontTheme: StorefrontTheme
	accentColor: AccentColor
	tagline: string
	address: string
	instagramUrl: string
	facebookUrl: string
	subscription: Subscription | null
}

export type StorefrontData = Business & {
	schedule: DaySchedule[]
	categories: ProductCategory[]
	products: Product[]
}

export const WEEKDAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const WEEKDAY_LABELS: Record<string, string> = {
	monday: 'pondělí',
	tuesday: 'úterý',
	wednesday: 'středa',
	thursday: 'čtvrtek',
	friday: 'pátek',
	saturday: 'sobota',
	sunday: 'neděle',
}

export function sortByWeekday(schedule: DaySchedule[]) {
	return [...schedule].sort((a, b) => WEEKDAY_ORDER.indexOf(a.dayId) - WEEKDAY_ORDER.indexOf(b.dayId))
}
