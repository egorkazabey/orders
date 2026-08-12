import type { IconType } from 'react-icons'
import {
	FiActivity,
	FiBarChart2,
	FiBell,
	FiBox,
	FiClock,
	FiDroplet,
	FiFileText,
	FiHome,
	FiMapPin,
	FiTag,
	FiUsers
} from 'react-icons/fi'

type SettingsItem = {
	id: string
	label: string
	icon: IconType
	ownerOnly?: boolean
}

type SettingsSection = {
	title: string
	items: SettingsItem[]
}

const SECTIONS: SettingsSection[] = [
	{
		title: 'Reporty',
		items: [
			{ id: 'activity-log', label: 'Záznam aktivit', icon: FiActivity, ownerOnly: true },
			{ id: 'statistics', label: 'Statistiky', icon: FiBarChart2 }
		]
	},
	{
		title: 'Podnikání',
		items: [
			{ id: 'profile', label: 'Profil podniku', icon: FiHome, ownerOnly: true },
			{ id: 'design', label: 'Vzhled webu', icon: FiDroplet, ownerOnly: true },
			{ id: 'branches', label: 'Pobočky', icon: FiMapPin, ownerOnly: true },
			{ id: 'staff', label: 'Personál', icon: FiUsers, ownerOnly: true },
			{ id: 'availability', label: 'Dostupnost', icon: FiClock },
			{ id: 'notifications', label: 'Oznámení', icon: FiBell, ownerOnly: true },
			{ id: 'billing', label: 'Fakturace', icon: FiFileText, ownerOnly: true }
		]
	},
	{
		title: 'Inventář',
		items: [
			{ id: 'products', label: 'Produkty', icon: FiBox },
			{ id: 'promo-codes', label: 'Promo kódy', icon: FiTag }
		]
	}
]

type SettingsSidebarProps = {
	activeId: string
	onSelect: (id: string) => void
	isOwner: boolean
}

export function SettingsSidebar({ activeId, onSelect, isOwner }: SettingsSidebarProps) {
	const visibleSections = SECTIONS.map((section) => ({
		...section,
		items: section.items.filter((item) => isOwner || !item.ownerOnly)
	})).filter((section) => section.items.length > 0)

	return (
		<>
			{/* Mobile / tablet: horizontal scrollable tab strip */}
			<nav className="flex shrink-0 gap-2 overflow-x-auto border-b border-gray-200 bg-white px-3 py-2 lg:hidden">
				{visibleSections.flatMap((section) => section.items).map(item => {
					const Icon = item.icon
					const isActive = item.id === activeId
					return (
						<button
							key={item.id}
							type="button"
							onClick={() => onSelect(item.id)}
							className={[
								'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition cursor-pointer',
								isActive
									? 'bg-blue-50 text-blue-600 font-medium'
									: 'text-gray-600 hover:bg-gray-50'
							].join(' ')}
						>
							<Icon size={16} />
							{item.label}
						</button>
					)
				})}
			</nav>

			{/* Desktop: grouped vertical sidebar */}
			<aside className="hidden w-72 shrink-0 flex-col gap-6 overflow-y-auto bg-white py-4 px-3 lg:flex">
				{visibleSections.map(section => (
					<div key={section.title}>
						<h2 className="px-3 mb-2 text-xl font-semibold text-gray-900">
							{section.title}
						</h2>
						<ul className="flex flex-col gap-1">
							{section.items.map(item => {
								const Icon = item.icon
								const isActive = item.id === activeId
								return (
									<li key={item.id}>
										<button
											type="button"
											onClick={() => onSelect(item.id)}
											className={[
												'w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-base transition cursor-pointer',
												isActive
													? 'bg-blue-50 text-blue-600 font-medium'
													: 'text-gray-700 hover:bg-gray-50'
											].join(' ')}
										>
											<Icon size={20} />
											{item.label}
										</button>
									</li>
								)
							})}
						</ul>
					</div>
				))}
			</aside>
		</>
	)
}
