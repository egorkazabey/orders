import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import { Button, UpgradeGate } from '@/shared/ui'
import {
	getPromoCodes,
	createPromoCode,
	setPromoCodeActive,
	deletePromoCode,
} from '@/shared/api/promoCodes'
import type { PromoCode } from '@/shared/api/promoCodes'
import { planFeaturesFor } from '@/shared/config/planFeatures'

export function PromoCodesSection() {
	const { token, business } = useSession()
	const [promoCodes, setPromoCodes] = useState<PromoCode[] | null>(null)
	const [error, setError] = useState<string | null>(null)
	const [code, setCode] = useState('')
	const [type, setType] = useState<'percent' | 'fixed'>('percent')
	const [value, setValue] = useState('10')
	const [maxUses, setMaxUses] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const unlocked = planFeaturesFor(business?.subscription?.plan).promoCodes

	useEffect(() => {
		if (!token || !unlocked) return
		getPromoCodes(token)
			.then((res) => setPromoCodes(res.promoCodes))
			.catch(() => setError('Nepodařilo se načíst promo kódy'))
	}, [token, unlocked])

	async function handleCreate() {
		if (!token || !code.trim()) return
		setIsSubmitting(true)
		setError(null)
		try {
			const res = await createPromoCode(token, {
				code: code.trim(),
				type,
				value: Number(value),
				maxUses: maxUses ? Number(maxUses) : null,
			})
			setPromoCodes((prev) => [res.promoCode, ...(prev ?? [])])
			setCode('')
			setValue('10')
			setMaxUses('')
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Nepodařilo se vytvořit promo kód')
		} finally {
			setIsSubmitting(false)
		}
	}

	async function handleToggleActive(promoCode: PromoCode) {
		if (!token) return
		const res = await setPromoCodeActive(token, promoCode.id, !promoCode.active)
		setPromoCodes((prev) => prev?.map((p) => (p.id === promoCode.id ? res.promoCode : p)) ?? null)
	}

	async function handleDelete(id: string) {
		if (!token) return
		await deletePromoCode(token, id)
		setPromoCodes((prev) => prev?.filter((p) => p.id !== id) ?? null)
	}

	return (
		<UpgradeGate
			unlocked={unlocked}
			title="Promo kódy jsou dostupné od tarifu Pro"
			description="Vytvářejte slevové kódy pro zákazníky přímo na vašem webu."
		>
		<div className="max-w-3xl">
			<div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
				<h2 className="mb-4 text-lg font-semibold text-gray-900">Nový promo kód</h2>
				<div className="flex flex-wrap items-end gap-3">
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Kód</span>
						<input
							value={code}
							onChange={(e) => setCode(e.target.value)}
							placeholder="např. LETO10"
							className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Typ</span>
						<select
							value={type}
							onChange={(e) => setType(e.target.value as 'percent' | 'fixed')}
							className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						>
							<option value="percent">Procenta</option>
							<option value="fixed">Pevná částka</option>
						</select>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">
							{type === 'percent' ? 'Sleva (%)' : 'Sleva (Kč)'}
						</span>
						<input
							type="number"
							min={1}
							value={value}
							onChange={(e) => setValue(e.target.value)}
							className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Max. použití</span>
						<input
							type="number"
							min={1}
							value={maxUses}
							onChange={(e) => setMaxUses(e.target.value)}
							placeholder="bez limitu"
							className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</label>
					<Button variant="primary" onClick={handleCreate} disabled={isSubmitting || !code.trim()}>
						<span className="flex items-center gap-1.5">
							<FiPlus size={16} />
							Přidat
						</span>
					</Button>
				</div>
				{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
				{!promoCodes ? (
					<p className="px-6 py-10 text-center text-sm text-gray-500">Načítání…</p>
				) : promoCodes.length === 0 ? (
					<p className="px-6 py-10 text-center text-sm text-gray-500">Zatím nemáte žádné promo kódy.</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
								<tr>
									<th className="px-6 py-3">Kód</th>
									<th className="px-6 py-3">Sleva</th>
									<th className="px-6 py-3">Použito</th>
									<th className="px-6 py-3">Aktivní</th>
									<th className="px-6 py-3" />
								</tr>
							</thead>
							<tbody>
								{promoCodes.map((promoCode) => (
									<tr key={promoCode.id} className="border-b border-gray-100 last:border-b-0">
										<td className="px-6 py-3 font-medium whitespace-nowrap text-gray-900">{promoCode.code}</td>
										<td className="px-6 py-3 whitespace-nowrap text-gray-600">
											{promoCode.type === 'percent' ? `${promoCode.value} %` : `${promoCode.value} Kč`}
										</td>
										<td className="px-6 py-3 whitespace-nowrap text-gray-600">
											{promoCode.usageCount}
											{promoCode.maxUses ? ` / ${promoCode.maxUses}` : ''}
										</td>
										<td className="px-6 py-3">
											<label className="inline-flex cursor-pointer items-center">
												<input
													type="checkbox"
													checked={promoCode.active}
													onChange={() => handleToggleActive(promoCode)}
													className="size-4 accent-blue-600"
												/>
											</label>
										</td>
										<td className="px-6 py-3 text-right">
											<button
												type="button"
												aria-label="Smazat promo kód"
												onClick={() => handleDelete(promoCode.id)}
												className="cursor-pointer text-gray-400 transition hover:text-red-600"
											>
												<FiTrash2 size={16} />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
		</UpgradeGate>
	)
}
