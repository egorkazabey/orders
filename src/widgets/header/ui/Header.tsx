import { useToggle } from '@/shared/lib/hooks/useToggle'
import { NAV_ITEMS } from '../model/nav-items'
import { DesktopNav } from './DesktopNav'
import { MobileNav } from './MobileNav'
import { UserActions } from './UserActions'

export function Header() {
	const { value: menuOpen, toggle: toggleMenu, close: closeMenu } = useToggle()

	return (
		<header className="border-b border-gray-200">
			<div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2">
				<h1 className="text-lg font-semibold">
					<a href="/" className="text-gray-900 hover:text-blue-700 transition">
						Orders
					</a>
				</h1>

				<DesktopNav items={NAV_ITEMS} />

				<UserActions menuOpen={menuOpen} onToggleMenu={toggleMenu} />
			</div>

			{menuOpen && <MobileNav items={NAV_ITEMS} onNavigate={closeMenu} />}
		</header>
	)
}
