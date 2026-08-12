import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { FiX } from 'react-icons/fi'
import { IconButton } from './IconButton'

type ModalProps = {
	open: boolean
	title: string
	onClose: () => void
	children: ReactNode
	footer?: ReactNode
}

/** Generic centered dialog. Closes on backdrop click and Escape. */
export function Modal({ open, title, onClose, children, footer }: ModalProps) {
	useEffect(() => {
		if (!open) return
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [open, onClose])

	if (!open) return null

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
			onClick={onClose}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				onClick={(e) => e.stopPropagation()}
				className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl dark:bg-stone-800"
			>
				<div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-stone-700">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-stone-50">{title}</h2>
					<IconButton icon={<FiX />} label="Zavřít" onClick={onClose} />
				</div>

				<div className="overflow-y-auto px-6 py-5">{children}</div>

				{footer && (
					<div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4 dark:border-stone-700">
						{footer}
					</div>
				)}
			</div>
		</div>
	)
}
