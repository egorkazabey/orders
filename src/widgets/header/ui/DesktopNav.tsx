import { NavLink } from 'react-router-dom'
import type { NavItem } from '../model/types'

type DesktopNavProps = {
	items: NavItem[]
}

export function DesktopNav({ items }: DesktopNavProps) {
	return (
		<nav aria-label="Main" className="hidden lg:block">
			<ul className="flex gap-4 text-gray-700">
				{items.map((item) => (
					<li key={item.href}>
						<NavLink
							to={item.href}
							end={item.href === '/'}
							className={({ isActive }) =>
								`flex items-center gap-2 py-1 transition hover:text-blue-700 ${
									isActive ? 'text-blue-700 font-medium' : ''
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
