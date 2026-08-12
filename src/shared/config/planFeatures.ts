export type PlanId = 'free' | 'start' | 'pro' | 'business'

export type PlanFeatures = {
	maxStaff: number | null
	maxLocations: number | null
	maxOrdersPerMonth: number | null
	statistics: boolean
	crm: boolean
	promoCodes: boolean
	printableTickets: boolean
	csvExport: boolean
	branding: boolean
}

export const PLAN_FEATURES: Record<PlanId, PlanFeatures> = {
	free: {
		maxStaff: 1,
		maxLocations: 1,
		maxOrdersPerMonth: 50,
		statistics: false,
		crm: false,
		promoCodes: false,
		printableTickets: false,
		csvExport: false,
		branding: true,
	},
	start: {
		maxStaff: 1,
		maxLocations: 1,
		maxOrdersPerMonth: null,
		statistics: false,
		crm: false,
		promoCodes: false,
		printableTickets: false,
		csvExport: false,
		branding: false,
	},
	pro: {
		maxStaff: 5,
		maxLocations: 1,
		maxOrdersPerMonth: null,
		statistics: true,
		crm: true,
		promoCodes: true,
		printableTickets: true,
		csvExport: false,
		branding: false,
	},
	business: {
		maxStaff: null,
		maxLocations: null,
		maxOrdersPerMonth: null,
		statistics: true,
		crm: true,
		promoCodes: true,
		printableTickets: true,
		csvExport: true,
		branding: false,
	},
}

export function planFeaturesFor(plan: string | null | undefined): PlanFeatures {
	return PLAN_FEATURES[(plan as PlanId) ?? 'free'] ?? PLAN_FEATURES.free
}

export const PLAN_LABELS: Record<PlanId, string> = {
	free: 'Free',
	start: 'Start',
	pro: 'Pro',
	business: 'Business',
}

export const PLAN_DESCRIPTIONS: Record<PlanId, string[]> = {
	free: ['1 pobočka', 'až 50 objednávek / měsíc', 'odznak „Vytvořeno s Orders“ na webu'],
	start: ['Neomezené objednávky', 'Bez odznaku na webu', 'Vyprodáno, kopie produktu, kopírování hodin'],
	pro: ['Vše ze Start', 'Statistiky', 'Klienti (CRM)', 'Promo kódy', 'Tisk účtenek', 'Až 5 přihlášení personálu'],
	business: ['Vše z Pro', 'Neomezené pobočky', 'Neomezený personál', 'Export objednávek do CSV', 'Prioritní podpora'],
}
