type UndoToastProps = {
	message: string
	onUndo: () => void
}

export function UndoToast({ message, onUndo }: UndoToastProps) {
	return (
		<div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-xl bg-gray-900 px-4 py-3 text-sm text-white shadow-lg">
			<span>{message}</span>
			<button
				type="button"
				onClick={onUndo}
				className="cursor-pointer font-semibold tracking-wide text-blue-300 uppercase hover:text-blue-200"
			>
				Zpět
			</button>
		</div>
	)
}
