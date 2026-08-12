import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from '@/widgets/header'
import { SettingsSidebar } from '@/widgets/settings-sidebar'
import { useSession } from '@/entities/session'
import { AvailabilitySection } from './sections/AvailabilitySection'
import { ProductsSection } from './sections/products/ProductsSection'
import { BillingSection } from './sections/BillingSection'
import { StatisticsSection } from './sections/StatisticsSection'
import { ProfileSection } from './sections/ProfileSection'
import { DesignSection } from './sections/DesignSection'
import { NotificationsSection } from './sections/NotificationsSection'
import { PromoCodesSection } from './sections/PromoCodesSection'
import { StaffSection } from './sections/StaffSection'
import { LocationsSection } from './sections/LocationsSection'
import { ActivityLogSection } from './sections/ActivityLogSection'

const SECTION_TITLES: Record<string, string> = {
	'activity-log': 'Záznam aktivit',
	statistics: 'Statistiky',
	profile: 'Profil podniku',
	design: 'Vzhled webu',
	branches: 'Pobočky',
	staff: 'Personál',
	availability: 'Dostupnost',
	notifications: 'Oznámení',
	billing: 'Fakturace',
	products: 'Produkty',
	'promo-codes': 'Promo kódy',
}

const KNOWN_SECTIONS = new Set([
	'availability',
	'products',
	'billing',
	'statistics',
	'profile',
	'design',
	'notifications',
	'promo-codes',
	'staff',
	'branches',
	'activity-log',
])

export function SettingsPage() {
	const [searchParams] = useSearchParams()
	const [activeId, setActiveId] = useState(searchParams.get('tab') ?? 'availability')
	const { role } = useSession()
	const isOwner = role === 'OWNER'

	useEffect(() => {
		const tab = searchParams.get('tab')
		if (tab) setActiveId(tab)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams.get('tab')])

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
				<SettingsSidebar activeId={activeId} onSelect={setActiveId} isOwner={isOwner} />
				<main className="flex-1 overflow-auto p-4 sm:p-6">
					<div className="mb-6">
						<h1 className="text-2xl font-semibold text-gray-900">{SECTION_TITLES[activeId]}</h1>
					</div>

					{activeId === 'availability' && <AvailabilitySection />}
					{activeId === 'products' && <ProductsSection />}
					{activeId === 'billing' && isOwner && <BillingSection />}
					{activeId === 'statistics' && <StatisticsSection />}
					{activeId === 'profile' && isOwner && <ProfileSection />}
					{activeId === 'design' && isOwner && <DesignSection />}
					{activeId === 'notifications' && isOwner && <NotificationsSection />}
					{activeId === 'promo-codes' && <PromoCodesSection />}
					{activeId === 'staff' && isOwner && <StaffSection />}
					{activeId === 'branches' && isOwner && <LocationsSection />}
					{activeId === 'activity-log' && isOwner && <ActivityLogSection />}
					{(!KNOWN_SECTIONS.has(activeId) ||
						(!isOwner &&
							['billing', 'profile', 'design', 'notifications', 'staff', 'branches', 'activity-log'].includes(
								activeId,
							))) && (
						<p className="text-sm text-gray-500">Tato sekce zatím není k dispozici.</p>
					)}
				</main>
			</div>
		</div>
	)
}
