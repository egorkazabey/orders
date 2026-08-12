import { useState } from 'react'
import { FiPlay } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import { updateBusiness } from '@/shared/api/business'
import { previewTone } from '@/entities/orders/lib/ring'
import type { RingTone } from '@/entities/orders/lib/ring'
import { Button } from '@/shared/ui'

const TONE_LABELS: Record<RingTone, string> = {
	classic: 'Klasický',
	chime: 'Zvonek',
	alert: 'Naléhavý',
}

export function NotificationsSection() {
	const { token, business, setBusiness } = useSession()
	const [soundEnabled, setSoundEnabled] = useState(business?.soundEnabled ?? true)
	const [ringTone, setRingTone] = useState<RingTone>(business?.ringTone ?? 'classic')
	const [quietEnabled, setQuietEnabled] = useState(Boolean(business?.quietHoursStart && business?.quietHoursEnd))
	const [quietStart, setQuietStart] = useState(business?.quietHoursStart ?? '22:00')
	const [quietEnd, setQuietEnd] = useState(business?.quietHoursEnd ?? '08:00')
	const [isSaving, setIsSaving] = useState(false)
	const [saved, setSaved] = useState(false)

	async function handleSave() {
		if (!token) return
		setIsSaving(true)
		setSaved(false)
		try {
			const res = await updateBusiness(token, {
				soundEnabled,
				ringTone,
				quietHoursStart: quietEnabled ? quietStart : null,
				quietHoursEnd: quietEnabled ? quietEnd : null,
			})
			setBusiness(res.business)
			setSaved(true)
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
			<h2 className="text-xl font-semibold text-gray-900">Oznámení</h2>
			<p className="mt-1 mb-6 text-sm text-gray-500">
				Nastavte, jak vás bude systém upozorňovat na nové objednávky.
			</p>

			<div className="flex flex-col gap-6">
				<label className="flex items-center gap-3 text-sm font-medium text-gray-900">
					<input
						type="checkbox"
						checked={soundEnabled}
						onChange={(e) => setSoundEnabled(e.target.checked)}
						className="size-4 accent-blue-600"
					/>
					Přehrávat zvuk při nové objednávce
				</label>

				{soundEnabled && (
					<div className="flex flex-col gap-2">
						<span className="text-sm font-medium text-gray-700">Tón vyzvánění</span>
						<div className="flex gap-2">
							{(Object.keys(TONE_LABELS) as RingTone[]).map((tone) => (
								<button
									key={tone}
									type="button"
									onClick={() => setRingTone(tone)}
									className={[
										'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition',
										ringTone === tone
											? 'border-blue-500 bg-blue-50 text-blue-700'
											: 'border-gray-300 text-gray-700 hover:bg-gray-50',
									].join(' ')}
								>
									{TONE_LABELS[tone]}
								</button>
							))}
							<button
								type="button"
								aria-label="Přehrát ukázku"
								onClick={() => previewTone(ringTone)}
								className="flex cursor-pointer items-center gap-1 rounded-lg px-2 text-gray-400 hover:text-blue-600"
							>
								<FiPlay size={16} />
							</button>
						</div>
					</div>
				)}

				<div className="flex flex-col gap-2">
					<label className="flex items-center gap-3 text-sm font-medium text-gray-900">
						<input
							type="checkbox"
							checked={quietEnabled}
							onChange={(e) => setQuietEnabled(e.target.checked)}
							className="size-4 accent-blue-600"
						/>
						Tiché hodiny (bez zvuku)
					</label>
					{quietEnabled && (
						<div className="ml-7 flex items-center gap-3">
							<span className="text-sm text-gray-500">Od</span>
							<input
								type="time"
								value={quietStart}
								onChange={(e) => setQuietStart(e.target.value)}
								className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
							/>
							<span className="text-sm text-gray-500">Do</span>
							<input
								type="time"
								value={quietEnd}
								onChange={(e) => setQuietEnd(e.target.value)}
								className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
							/>
						</div>
					)}
				</div>
			</div>

			{saved && <p className="mt-4 text-sm text-emerald-600">Uloženo.</p>}

			<Button variant="primary" onClick={handleSave} disabled={isSaving} className="mt-6">
				{isSaving ? 'Ukládání…' : 'Uložit změny'}
			</Button>
		</div>
	)
}
