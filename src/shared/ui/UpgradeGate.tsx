import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLock } from 'react-icons/fi'
import { Button } from './Button'

type UpgradeGateProps = {
	unlocked: boolean
	title: string
	description: string
	children: ReactNode
}

export function UpgradeGate({ unlocked, title, description, children }: UpgradeGateProps) {
	const navigate = useNavigate()

	if (unlocked) return <>{children}</>

	return (
		<div className="flex max-w-2xl flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
			<span className="flex size-11 items-center justify-center rounded-full bg-gray-200 text-gray-500">
				<FiLock size={18} />
			</span>
			<p className="font-medium text-gray-900">{title}</p>
			<p className="max-w-sm text-sm text-gray-500">{description}</p>
			<Button variant="primary" onClick={() => navigate('/settings?tab=billing')} className="mt-2">
				Přejít na vyšší tarif
			</Button>
		</div>
	)
}
