import { useEffect, useRef } from 'react'
import { FaUser } from 'react-icons/fa'
import { FiExternalLink, FiLogOut } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import { IconButton } from '@/shared/ui'
import { useToggle } from '@/shared/lib/hooks/useToggle'
import { storefrontPath } from '@/shared/config/routes'

export function UserMenu() {
	const { business, logout } = useSession()
	const { value: isOpen, toggle, close } = useToggle()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!isOpen) return
		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) close()
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen, close])

	return (
		<div ref={containerRef} className="relative">
			<IconButton
				icon={<FaUser />}
				label="Uživatelský účet"
				aria-expanded={isOpen}
				onClick={toggle}
			/>

			{isOpen && (
				<div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-1.5 shadow-lg">
					{business && (
						<div className="border-b border-gray-100 px-4 py-2">
							<p className="truncate text-sm font-medium text-gray-900">{business.name}</p>
						</div>
					)}
					{business && (
						<a
							href={storefrontPath(business.slug)}
							target="_blank"
							rel="noreferrer"
							onClick={close}
							className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
						>
							<FiExternalLink size={14} />
							Zobrazit web
						</a>
					)}
					<button
						type="button"
						onClick={() => {
							close()
							logout()
						}}
						className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-gray-50"
					>
						<FiLogOut size={14} />
						Odhlásit se
					</button>
				</div>
			)}
		</div>
	)
}
