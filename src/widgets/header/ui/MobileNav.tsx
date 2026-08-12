import { NavLink } from 'react-router-dom'
import type { NavItem } from '../model/types'

type MobileNavProps = {
	items: NavItem[]
	onNavigate: () => void
}

export function MobileNav({ items, onNavigate }: MobileNavProps) {
	return (
		<nav aria-label="Main mobile" className="border-t border-gray-200 px-4 py-2 lg:hidden">
			<ul className="flex flex-col gap-1 text-gray-700">
				{items.map((item) => (
					<li key={item.href}>
						<NavLink
							to={item.href}
							end={item.href === '/'}
							onClick={onNavigate}
							className={({ isActive }) =>
								`flex items-center gap-2 rounded px-2 py-2 transition hover:text-blue-700 ${
									isActive ? 'bg-blue-50 text-blue-700 font-medium' : ''
								}`
							}
						>
							<span aria-hidden="true">{item.icon}</span>
							{item.label}
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	)
}
