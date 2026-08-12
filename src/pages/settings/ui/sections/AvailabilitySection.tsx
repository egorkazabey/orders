import { useState } from 'react'
import { FiCopy, FiPlus, FiTrash2 } from 'react-icons/fi'
import { useBusiness, WEEKDAY_LABELS, WEEKDAY_ORDER } from '@/entities/business'

export function AvailabilitySection() {
	const { schedule, isLoading, error, toggleDay, addTimeRange, removeTimeRange, updateTimeRange, copyHoursToDays } =
		useBusiness()
	const [copyFromDayId, setCopyFromDayId] = useState<string | null>(null)
	const [copyTargets, setCopyTargets] = useState<Set<string>>(new Set())

	function startCopy(dayId: string) {
		setCopyFromDayId(dayId)
		setCopyTargets(new Set())
	}

	function cancelCopy() {
		setCopyFromDayId(null)
		setCopyTargets(new Set())
	}

	function toggleCopyTarget(dayId: string) {
		setCopyTargets((prev) => {
			const next = new Set(prev)
			if (next.has(dayId)) next.delete(dayId)
			else next.add(dayId)
			return next
		})
	}

	function applyCopy() {
		if (!copyFromDayId || copyTargets.size === 0) return
		copyHoursToDays(copyFromDayId, [...copyTargets])
		cancelCopy()
	}

	return (
		<div className="max-w-4xl rounded-xl border border-gray-200 bg-white">
			<div className="border-b border-gray-200 px-6 py-5">
				<h2 className="text-xl font-semibold text-gray-900">Otevírací hodiny</h2>
				<p className="mt-1 text-sm text-gray-500">Upravte obecnou provozní dobu svého podniku.</p>
				{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
			</div>

			{copyFromDayId && (
				<div className="flex flex-wrap items-center gap-3 border-b border-blue-100 bg-blue-50 px-6 py-3 text-sm">
					<span className="font-medium text-blue-900">
						Kopírovat hodiny z {WEEKDAY_LABELS[copyFromDayId]} na:
					</span>
					{WEEKDAY_ORDER.filter((id) => id !== copyFromDayId).map((dayId) => (
						<label key={dayId} className="flex items-center gap-1.5 text-blue-900">
							<input
								type="checkbox"
								checked={copyTargets.has(dayId)}
								onChange={() => toggleCopyTarget(dayId)}
								className="size-4 accent-blue-600"
							/>
							{WEEKDAY_LABELS[dayId]}
						</label>
					))}
					<button
						type="button"
						onClick={applyCopy}
						disabled={copyTargets.size === 0}
						className="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						Zkopírovat
					</button>
					<button
						type="button"
						onClick={cancelCopy}
						className="cursor-pointer font-medium text-blue-700 hover:text-blue-900"
					>
						Zrušit
					</button>
				</div>
			)}

			{isLoading ? (
				<p className="px-6 py-10 text-center text-sm text-gray-500">Načítání…</p>
			) : (
				<ul>
					{schedule.map((day) => (
						<li key={day.id} className="border-b border-gray-100 px-6 py-4 last:border-b-0">
							<div className="flex flex-wrap items-start gap-4">
								<label className="flex w-36 shrink-0 items-center gap-3 pt-2 text-sm font-medium text-gray-900">
									<input
										type="checkbox"
										checked={day.enabled}
										onChange={() => toggleDay(day.dayId)}
										className="size-4 accent-blue-600"
									/>
									{WEEKDAY_LABELS[day.dayId]}
								</label>

								{day.enabled ? (
									<div className="flex flex-1 flex-col gap-2">
										{day.ranges.map((range) => (
											<div key={range.id} className="flex flex-wrap items-center gap-3">
												<span className="text-sm text-gray-500">Od</span>
												<input
													type="time"
													value={range.fromTime}
													onChange={(e) => updateTimeRange(day.dayId, range.id, 'fromTime', e.target.value)}
													className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
												/>
												<span className="text-sm text-gray-500">Do</span>
												<input
													type="time"
													value={range.toTime}
													onChange={(e) => updateTimeRange(day.dayId, range.id, 'toTime', e.target.value)}
													className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
												/>
												{day.ranges.length > 1 && (
													<button
														type="button"
														aria-label="Odebrat časový úsek"
														onClick={() => removeTimeRange(day.dayId, range.id)}
														className="cursor-pointer text-gray-400 transition hover:text-red-600"
													>
														<FiTrash2 size={16} />
													</button>
												)}
											</div>
										))}
										<button
											type="button"
											onClick={() => addTimeRange(day.dayId)}
											className="flex w-fit cursor-pointer items-center gap-1.5 text-sm font-medium tracking-wide text-blue-600 uppercase hover:text-blue-700"
										>
											<FiPlus size={16} />
											Přidat hodiny
										</button>
									</div>
								) : (
									<span className="pt-2 text-sm font-medium text-gray-500">Zavřeno</span>
								)}

								<button
									type="button"
									aria-label="Kopírovat na jiné dny"
									onClick={() => startCopy(day.dayId)}
									className="ml-auto flex shrink-0 cursor-pointer items-center gap-1.5 pt-2 text-xs font-medium text-gray-400 transition hover:text-blue-600"
								>
									<FiCopy size={14} />
									Kopírovat
								</button>
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}
