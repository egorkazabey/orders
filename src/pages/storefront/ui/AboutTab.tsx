import { FiFacebook, FiInstagram, FiMapPin, FiPhone } from 'react-icons/fi'
import { WEEKDAY_LABELS, sortByWeekday } from '@/entities/business'
import { useStorefrontData } from '../model/context'

export function AboutTab() {
	const business = useStorefrontData()
	const schedule = sortByWeekday(business.schedule)

	return (
		<div className="flex flex-col gap-9">
			{business.description && (
				<p className="text-sm leading-relaxed text-stone-600 dark:text-stone-300">{business.description}</p>
			)}

			<div>
				<h2 className="mb-4 border-l-4 border-(--accent) pl-3 text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
					Kontakt
				</h2>
				<div className="flex flex-col gap-3">
					<a
						href={`tel:${business.phone}`}
						className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-stone-900 shadow-sm shadow-stone-900/5 transition hover:shadow-md dark:bg-stone-800 dark:text-stone-50 dark:shadow-none"
					>
						<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--accent-soft) text-(--accent-soft-text)">
							<FiPhone size={15} />
						</span>
						{business.phone}
					</a>

					{business.address && (
						<div className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm font-medium text-stone-900 shadow-sm shadow-stone-900/5 dark:bg-stone-800 dark:text-stone-50 dark:shadow-none">
							<span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--accent-soft) text-(--accent-soft-text)">
								<FiMapPin size={15} />
							</span>
							{business.address}
						</div>
					)}

					{(business.instagramUrl || business.facebookUrl) && (
						<div className="flex gap-3">
							{business.instagramUrl && (
								<a
									href={business.instagramUrl}
									target="_blank"
									rel="noreferrer"
									className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white p-3 text-sm font-medium text-stone-900 shadow-sm shadow-stone-900/5 transition hover:shadow-md dark:bg-stone-800 dark:text-stone-50 dark:shadow-none"
								>
									<FiInstagram size={15} />
									Instagram
								</a>
							)}
							{business.facebookUrl && (
								<a
									href={business.facebookUrl}
									target="_blank"
									rel="noreferrer"
									className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white p-3 text-sm font-medium text-stone-900 shadow-sm shadow-stone-900/5 transition hover:shadow-md dark:bg-stone-800 dark:text-stone-50 dark:shadow-none"
								>
									<FiFacebook size={15} />
									Facebook
								</a>
							)}
						</div>
					)}
				</div>
			</div>

			<div>
				<h2 className="mb-4 border-l-4 border-(--accent) pl-3 text-xs font-bold tracking-widest text-stone-400 uppercase dark:text-stone-500">
					Otevírací doba
				</h2>
				<div className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-stone-900/5 dark:bg-stone-800 dark:shadow-none">
					{schedule.map((day, index) => (
						<div
							key={day.id}
							className={`flex items-center justify-between px-4 py-3 text-sm ${
								index > 0 ? 'border-t border-stone-100 dark:border-stone-700' : ''
							}`}
						>
							<span className="font-medium text-stone-700 capitalize dark:text-stone-300">
								{WEEKDAY_LABELS[day.dayId]}
							</span>
							{day.enabled ? (
								<span className="font-semibold text-stone-900 dark:text-stone-50">
									{day.ranges.map((r) => `${r.fromTime}–${r.toTime}`).join(', ')}
								</span>
							) : (
								<span className="text-stone-400 dark:text-stone-500">Zavřeno</span>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
