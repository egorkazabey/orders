import { useNavigate } from 'react-router-dom'
import { useSession } from '@/entities/session'
import { Button } from '@/shared/ui'

export function UpgradeButton() {
	const { business, role } = useSession()
	const navigate = useNavigate()

	if (role !== 'OWNER') return null
	if (business?.subscription?.plan === 'business') return null

	return (
		<Button variant="primary" onClick={() => navigate('/settings?tab=billing')}>
			Upgrade
		</Button>
	)
}
