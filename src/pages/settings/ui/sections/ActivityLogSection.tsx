import { useEffect, useState } from 'react'
import { useSession } from '@/entities/session'
import { getAuditLog } from '@/shared/api/auditLog'
import type { AuditLogEntry } from '@/shared/api/auditLog'

const ACTION_LABELS: Record<string, string> = {
	'staff.invited': 'přidal(a) zaměstnance',
	'staff.removed': 'odebral(a) zaměstnance',
	'location.created': 'vytvořil(a) pobočku',
	'product.created': 'vytvořil(a) produkt',
	'product.updated': 'upravil(a) produkt',
	'product.deleted': 'smazal(a) produkt',
	'order.cancelled': 'zrušil(a) objednávku',
	'business.updated': 'upravil(a) profil podniku',
}

export function ActivityLogSection() {
	const { token } = useSession()
	const [entries, setEntries] = useState<AuditLogEntry[] | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		if (!token) return
		getAuditLog(token)
			.then((res) => setEntries(res.entries))
			.catch(() => setError('Nepodařilo se načíst záznam aktivit'))
	}, [token])

	if (error) return <p className="text-sm text-red-600">{error}</p>
	if (!entries) return <p className="text-sm text-gray-500">Načítání…</p>

	return (
		<div className="max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-white">
			{entries.length === 0 ? (
				<p className="px-6 py-10 text-center text-sm text-gray-500">Zatím žádná aktivita.</p>
			) : (
				<ul>
					{entries.map((entry) => (
						<li key={entry.id} className="border-b border-gray-100 px-6 py-3 text-sm last:border-b-0">
							<span className="font-medium text-gray-900">{entry.actorEmail}</span>{' '}
							<span className="text-gray-600">{ACTION_LABELS[entry.action] ?? entry.action}</span>{' '}
							<span className="font-medium text-gray-900">{entry.targetLabel}</span>
							<span className="ml-2 text-xs text-gray-400">
								{new Date(entry.createdAt).toLocaleString('cs-CZ')}
							</span>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
