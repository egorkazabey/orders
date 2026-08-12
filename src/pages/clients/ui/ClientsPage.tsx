import { useEffect, useState } from 'react'
import { Header } from '@/widgets/header'
import { useSession } from '@/entities/session'
import { getCustomers } from '@/shared/api/stats'
import type { Customer } from '@/shared/api/stats'
import { planFeaturesFor } from '@/shared/config/planFeatures'
import { UpgradeGate } from '@/shared/ui'

function formatCzk(amount: number) {
	return `${amount.toLocaleString('cs-CZ')} Kč`
}

export function ClientsPage() {
	const { token, business } = useSession()
	const [customers, setCustomers] = useState<Customer[] | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [search, setSearch] = useState('')
	const unlocked = planFeaturesFor(business?.subscription?.plan).crm

	useEffect(() => {
		if (!token || !unlocked) return
		getCustomers(token)
			.then((res) => setCustomers(res.customers))
			.catch(() => setError('Nepodařilo se načíst klienty'))
	}, [token, unlocked])

	const filtered = customers?.filter((c) => {
		const q = search.trim().toLowerCase()
		if (!q) return true
		return c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
	})

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 overflow-auto p-4 sm:p-6">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<h1 className="text-2xl font-semibold text-gray-900">Klienti</h1>
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Hledat podle jména nebo telefonu…"
						className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none sm:w-72"
					/>
				</div>

				<UpgradeGate
					unlocked={unlocked}
					title="Klienti jsou dostupní od tarifu Pro"
					description="Sledujte, kdo u vás objednává, kolik utratil a kdy objednal naposledy."
				>
				{error && <p className="text-sm text-red-600">{error}</p>}
				{!customers && !error && <p className="text-sm text-gray-500">Načítání…</p>}

				{customers && filtered && (
					<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
						{filtered.length === 0 ? (
							<p className="px-6 py-10 text-center text-sm text-gray-500">Žádní klienti nenalezeni.</p>
						) : (
							<div className="overflow-x-auto">
								<table className="w-full text-left text-sm">
									<thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
										<tr>
											<th className="px-6 py-3">Jméno</th>
											<th className="px-6 py-3">Telefon</th>
											<th className="px-6 py-3">Objednávky</th>
											<th className="px-6 py-3">Celkem utraceno</th>
											<th className="px-6 py-3">Poslední objednávka</th>
										</tr>
									</thead>
									<tbody>
										{filtered.map((c) => (
											<tr key={c.phone} className="border-b border-gray-100 last:border-b-0">
												<td className="px-6 py-3 font-medium whitespace-nowrap text-gray-900">{c.name}</td>
												<td className="px-6 py-3 whitespace-nowrap text-gray-600">{c.phone}</td>
												<td className="px-6 py-3 whitespace-nowrap text-gray-600">{c.orderCount}</td>
												<td className="px-6 py-3 whitespace-nowrap text-gray-600">{formatCzk(c.totalSpent)}</td>
												<td className="px-6 py-3 whitespace-nowrap text-gray-600">
													{new Date(c.lastOrderAt).toLocaleDateString('cs-CZ')}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				)}
			</UpgradeGate>
			</main>
		</div>
	)
}
