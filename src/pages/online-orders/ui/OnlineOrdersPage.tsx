import { useState } from 'react'
import { FiChevronDown, FiChevronRight, FiDownload, FiSearch } from 'react-icons/fi'
import { Header } from '@/widgets/header'
import { useSession } from '@/entities/session'
import { useOrders } from '@/entities/orders'
import type { Order } from '@/shared/api/orders'
import { updateBusiness } from '@/shared/api/business'
import { downloadOrdersCsv } from '@/shared/api/orders'
import { planFeaturesFor } from '@/shared/config/planFeatures'
import { nextStatus } from '../lib/pipeline'
import { OrderCard } from './OrderCard'

export function OnlineOrdersPage() {
	const { token, business, setBusiness } = useSession()
	const features = planFeaturesFor(business?.subscription?.plan)
	const { orders: allOrders, isLoading, error, setStatus } = useOrders()
	const [prepTimeInput, setPrepTimeInput] = useState(() => String(business?.prepTimeMinutes ?? 30))
	const [isSavingPrepTime, setIsSavingPrepTime] = useState(false)
	const [isArchiveOpen, setArchiveOpen] = useState(false)
	const [search, setSearch] = useState('')
	const [isExporting, setIsExporting] = useState(false)

	async function handleExport() {
		if (!token) return
		setIsExporting(true)
		try {
			await downloadOrdersCsv(token)
		} finally {
			setIsExporting(false)
		}
	}

	const prepTimeMinutes = business?.prepTimeMinutes ?? 30

	const query = search.trim().toLowerCase()
	const orders: Order[] = query
		? allOrders.filter(
				(o) =>
					o.customerName.toLowerCase().includes(query) ||
					o.customerPhone.toLowerCase().includes(query) ||
					String(o.orderNumber).includes(query),
			)
		: allOrders

	const newOrders = orders.filter((o) => o.status === 'NEW')
	const activeOrders = orders.filter((o) => ['ACCEPTED', 'COOKING', 'DELIVERING'].includes(o.status))
	const finishedToday = orders.filter((o) => !o.archived && (o.status === 'DONE' || o.status === 'CANCELLED'))
	const archived = orders.filter((o) => o.archived)

	async function savePrepTime() {
		if (!token) return
		const minutes = Number(prepTimeInput)
		if (!Number.isFinite(minutes) || minutes < 1) return
		setIsSavingPrepTime(true)
		try {
			const res = await updateBusiness(token, { prepTimeMinutes: minutes })
			setBusiness(res.business)
		} finally {
			setIsSavingPrepTime(false)
		}
	}

	function handleAdvance(orderId: string, currentStatus: (typeof orders)[number]['status']) {
		const next = nextStatus(currentStatus)
		if (next) setStatus(orderId, next)
	}

	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 overflow-auto p-4 sm:p-6">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<h1 className="text-2xl font-semibold text-gray-900">Online objednávky</h1>
					<div className="relative">
						<FiSearch size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Hledat podle jména, telefonu, čísla…"
							className="w-72 rounded-lg border border-gray-300 py-1.5 pr-3 pl-8 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</div>
					{features.csvExport && (
						<button
							type="button"
							onClick={handleExport}
							disabled={isExporting}
							className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<FiDownload size={14} />
							{isExporting ? 'Exportuji…' : 'Export CSV'}
						</button>
					)}
					<div className="flex items-center gap-2 text-sm">
						<label className="text-gray-500">Doba přípravy a doručení</label>
						<input
							type="number"
							min={1}
							value={prepTimeInput}
							onChange={(e) => setPrepTimeInput(e.target.value)}
							className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center focus:border-blue-500 focus:outline-none"
						/>
						<span className="text-gray-500">min</span>
						<button
							type="button"
							onClick={savePrepTime}
							disabled={isSavingPrepTime || Number(prepTimeInput) === prepTimeMinutes}
							className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1 font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSavingPrepTime ? 'Ukládání…' : 'Uložit'}
						</button>
					</div>
				</div>

				{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

				{isLoading ? (
					<p className="text-sm text-gray-500">Načítání…</p>
				) : (
					<div className="flex flex-col gap-8">
						<section>
							<h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
								Nové ({newOrders.length})
							</h2>
							{newOrders.length === 0 ? (
								<p className="text-sm text-gray-400">Žádné nové objednávky</p>
							) : (
								<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
									{newOrders.map((order) => (
										<OrderCard
											key={order.id}
											order={order}
											prepTimeMinutes={prepTimeMinutes}
										canPrint={features.printableTickets}
											onAdvance={() => handleAdvance(order.id, order.status)}
											onCancel={() => setStatus(order.id, 'CANCELLED')}
										/>
									))}
								</div>
							)}
						</section>

						<section>
							<h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
								V přípravě ({activeOrders.length})
							</h2>
							{activeOrders.length === 0 ? (
								<p className="text-sm text-gray-400">Žádné rozpracované objednávky</p>
							) : (
								<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
									{activeOrders.map((order) => (
										<OrderCard
											key={order.id}
											order={order}
											prepTimeMinutes={prepTimeMinutes}
										canPrint={features.printableTickets}
											onAdvance={() => handleAdvance(order.id, order.status)}
											onCancel={() => setStatus(order.id, 'CANCELLED')}
										/>
									))}
								</div>
							)}
						</section>

						<section>
							<h2 className="mb-3 text-sm font-semibold tracking-wide text-gray-500 uppercase">
								Dokončeno dnes ({finishedToday.length})
							</h2>
							{finishedToday.length === 0 ? (
								<p className="text-sm text-gray-400">Zatím žádné dokončené objednávky</p>
							) : (
								<div className="grid grid-cols-1 gap-3 md:grid-cols-3">
									{finishedToday.map((order) => (
										<OrderCard key={order.id} order={order} prepTimeMinutes={prepTimeMinutes}
										canPrint={features.printableTickets} />
									))}
								</div>
							)}
						</section>

						<section>
							<button
								type="button"
								onClick={() => setArchiveOpen((v) => !v)}
								className="flex cursor-pointer items-center gap-1.5 text-sm font-semibold tracking-wide text-gray-500 uppercase transition hover:text-gray-700"
							>
								{isArchiveOpen ? <FiChevronDown size={14} /> : <FiChevronRight size={14} />}
								Archiv ({archived.length})
							</button>
							{isArchiveOpen && (
								<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
									{archived.length === 0 ? (
										<p className="text-sm text-gray-400">Archiv je prázdný</p>
									) : (
										archived.map((order) => (
											<OrderCard key={order.id} order={order} prepTimeMinutes={prepTimeMinutes}
										canPrint={features.printableTickets} />
										))
									)}
								</div>
							)}
						</section>
					</div>
				)}
			</main>
		</div>
	)
}
