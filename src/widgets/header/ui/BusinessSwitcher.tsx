import { useEffect, useState } from 'react'
import { useSession } from '@/entities/session'
import { getMemberships } from '@/shared/api/auth'
import type { Membership } from '@/shared/api/auth'

export function BusinessSwitcher() {
	const { token, business, switchBusiness } = useSession()
	const [memberships, setMemberships] = useState<Membership[]>([])

	useEffect(() => {
		if (!token) return
		getMemberships(token)
			.then((res) => setMemberships(res.memberships))
			.catch(() => setMemberships([]))
	}, [token, business?.id])

	if (memberships.length <= 1) return null

	return (
		<select
			value={business?.id ?? ''}
			onChange={(e) => switchBusiness(e.target.value)}
			className="cursor-pointer rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm font-medium text-gray-700 focus:border-blue-500 focus:outline-none"
		>
			{memberships.map((m) => (
				<option key={m.businessId} value={m.businessId}>
					{m.businessName}
				</option>
			))}
		</select>
	)
}
