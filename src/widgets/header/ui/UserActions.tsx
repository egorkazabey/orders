import { FaBars, FaXmark } from 'react-icons/fa6'
import { IoIosInformationCircle } from 'react-icons/io'
import { IconButton } from '@/shared/ui'
import { OrdersBell } from './OrdersBell'
import { BusinessSwitcher } from './BusinessSwitcher'
import { UserMenu } from './UserMenu'
import { UpgradeButton } from './UpgradeButton'

type UserActionsProps = {
	menuOpen: boolean
	onToggleMenu: () => void
}

export function UserActions({ menuOpen, onToggleMenu }: UserActionsProps) {
	return (
		<div className="flex items-center gap-3 sm:gap-4">
			<div className="hidden items-center gap-3 sm:flex sm:gap-4">
				<BusinessSwitcher />
				<UpgradeButton />
				<IconButton icon={<IoIosInformationCircle />} label="Information" size="lg" />
			</div>
			<OrdersBell />
			<UserMenu />

			{/* Mobile menu toggle */}
			<IconButton
				icon={menuOpen ? <FaXmark /> : <FaBars />}
				label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				size="lg"
				className="lg:hidden"
				onClick={onToggleMenu}
			/>
		</div>
	)
}
