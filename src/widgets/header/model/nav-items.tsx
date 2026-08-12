import { FaCalculator, FaClipboardUser, FaRocket } from 'react-icons/fa6'
import { IoMegaphone, IoSettings } from 'react-icons/io5'
import { ROUTES } from '@/shared/config/routes'
import type { NavItem } from './types'

export const NAV_ITEMS: NavItem[] = [
	{ icon: <FaRocket />, label: 'Onboarding', href: ROUTES.onboarding },
	{ icon: <FaCalculator />, label: 'Dashboard', href: ROUTES.sales },
	{ icon: <FaClipboardUser />, label: 'Clients', href: ROUTES.clients },
	{ icon: <IoMegaphone />, label: 'Online orders', href: ROUTES.onlineOrders },
	{ icon: <IoSettings />, label: 'Settings', href: ROUTES.settings },
]
