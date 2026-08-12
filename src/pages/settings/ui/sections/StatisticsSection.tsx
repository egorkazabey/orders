import { useEffect, useState } from 'react'
import { useSession } from '@/entities/session'
import { getStatsOverview } from '@/shared/api/stats'
import type { StatsOverview } from '@/shared/api/stats'
import { planFeaturesFor } from '@/shared/config/planFeatures'
import { UpgradeGate } from '@/shared/ui'

function formatCzk(amount: number) {
	return `${amount.toLocaleString('cs-CZ')} Kč`
}

function formatDayLabel(dateStr: string) {
	const date = new Date(`${dateStr}T00:00:00`)
	return date.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'numeric' })
}

export function StatisticsSection() {
	const { token, business } = useSession()
	const [stats, setStats] = useState<StatsOverview | null>(null)
	const [error, setError] = useState<string | null>(null)
	const unlocked = planFeaturesFor(business?.subscription?.plan).statistics

	useEffect(() => {
		if (!token || !unlocked) return
		getStatsOverview(token)
			.then(setStats)
			.catch(() => setError('Nepodařilo se načíst statistiky'))
	}, [token, unlocked])

	return (
		<UpgradeGate
			unlocked={unlocked}
			title="Statistiky jsou dostupné od tarifu Pro"
			description="Sledujte tržby, nejprodávanější položky a průměrnou hodnotu objednávky."
		>
			<StatisticsContent stats={stats} error={error} />
		</UpgradeGate>
	)
}

function StatisticsContent({ stats, error }: { stats: StatsOverview | null; error: string | null }) {
	if (error) return <p className="text-sm text-red-600">{error}</p>
	if (!stats) return <p className="text-sm text-gray-500">Načítání…</p>

	const maxRevenue = Math.max(1, ...stats.revenueByDay.map((d) => d.revenue))

	return (
		<div className="max-w-4xl">
			<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				<div className="rounded-xl border border-gray-200 bg-white p-5">
					<p className="text-sm text-gray-500">Celkové tržby</p>
					<p className="mt-1 text-2xl font-semibold text-gray-900">{formatCzk(stats.totalRevenue)}</p>
				</div>
				<div className="rounded-xl border border-gray-200 bg-white p-5">
					<p className="text-sm text-gray-500">Počet objednávek</p>
					<p className="mt-1 text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
				</div>
				<div className="rounded-xl border border-gray-200 bg-white p-5">
					<p className="text-sm text-gray-500">Průměrná objednávka</p>
					<p className="mt-1 text-2xl font-semibold text-gray-900">{formatCzk(stats.avgOrderValue)}</p>
				</div>
			</div>

			<div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
				<h2 className="mb-4 text-lg font-semibold text-gray-900">Tržby za posledních 14 dní</h2>
				{stats.revenueByDay.every((d) => d.revenue === 0) ? (
					<p className="text-sm text-gray-500">Zatím žádné objednávky v tomto období.</p>
				) : (
					<div className="flex h-40 items-end gap-1.5">
						{stats.revenueByDay.map((d) => (
							<div key={d.date} className="flex flex-1 flex-col items-center gap-1.5">
								<div
									className="w-full rounded-t bg-blue-500"
									style={{ height: `${Math.max(2, (d.revenue / maxRevenue) * 100)}%` }}
									title={`${formatDayLabel(d.date)}: ${formatCzk(d.revenue)}`}
								/>
								<span className="text-[10px] text-gray-400">{formatDayLabel(d.date)}</span>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="rounded-xl border border-gray-200 bg-white p-5">
				<h2 className="mb-4 text-lg font-semibold text-gray-900">Nejprodávanější položky</h2>
				{stats.topProducts.length === 0 ? (
					<p className="text-sm text-gray-500">Zatím žádné prodané položky.</p>
				) : (
					<ul className="flex flex-col gap-3">
						{stats.topProducts.map((p, i) => (
							<li key={p.name} className="flex items-center justify-between text-sm">
								<span className="flex items-center gap-2 text-gray-900">
									<span className="w-5 text-gray-400">{i + 1}.</span>
									{p.name}
								</span>
								<span className="text-gray-500">
									{p.quantity}× · {formatCzk(p.revenue)}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
