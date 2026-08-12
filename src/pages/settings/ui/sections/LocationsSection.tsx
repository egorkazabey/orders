import { useEffect, useState } from 'react'
import { FiCheck, FiMapPin, FiPlus } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import { Button } from '@/shared/ui'
import { getMemberships } from '@/shared/api/auth'
import type { Membership } from '@/shared/api/auth'
import { createLocation } from '@/shared/api/locations'
import { ApiError } from '@/shared/api/client'
import { slugify } from '@/shared/lib/slugify'

export function LocationsSection() {
	const { token, switchBusiness } = useSession()
	const [memberships, setMemberships] = useState<Membership[] | null>(null)
	const [name, setName] = useState('')
	const [slug, setSlug] = useState('')
	const [slugTouched, setSlugTouched] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	function load() {
		if (!token) return
		getMemberships(token)
			.then((res) => setMemberships(res.memberships.filter((m) => m.role === 'OWNER')))
			.catch(() => setError('Nepodařilo se načíst pobočky'))
	}

	useEffect(load, [token])

	function handleNameChange(value: string) {
		setName(value)
		if (!slugTouched) setSlug(slugify(value))
	}

	async function handleCreate() {
		if (!token || !name.trim() || !slug.trim()) return
		setIsSubmitting(true)
		setError(null)
		try {
			await createLocation(token, { name: name.trim(), slug: slug.trim() })
			setName('')
			setSlug('')
			setSlugTouched(false)
			load()
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Nepodařilo se vytvořit pobočku')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="max-w-3xl">
			<div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
				<h2 className="mb-1 text-lg font-semibold text-gray-900">Nová pobočka</h2>
				<p className="mb-4 text-sm text-gray-500">
					Každá pobočka má vlastní web, otevírací dobu a nabídku produktů.
				</p>
				<div className="flex flex-wrap items-end gap-3">
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Název</span>
						<input
							value={name}
							onChange={(e) => handleNameChange(e.target.value)}
							placeholder="např. Pizzeria Centrum"
							className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Adresa webu</span>
						<input
							value={slug}
							onChange={(e) => {
								setSlug(slugify(e.target.value))
								setSlugTouched(true)
							}}
							placeholder="pizzeria-centrum"
							className="w-48 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</label>
					<Button variant="primary" onClick={handleCreate} disabled={isSubmitting || !name.trim() || !slug.trim()}>
						<span className="flex items-center gap-1.5">
							<FiPlus size={16} />
							Vytvořit
						</span>
					</Button>
				</div>
				{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
				{!memberships ? (
					<p className="px-6 py-10 text-center text-sm text-gray-500">Načítání…</p>
				) : (
					<ul>
						{memberships.map((m) => (
							<li
								key={m.businessId}
								className="flex items-center gap-3 border-b border-gray-100 px-6 py-4 last:border-b-0"
							>
								<FiMapPin size={16} className="shrink-0 text-gray-400" />
								<div className="min-w-0 flex-1">
									<p className="font-medium text-gray-900">{m.businessName}</p>
									<p className="text-sm text-gray-500">/s/{m.slug}</p>
								</div>
								{m.isCurrent ? (
									<span className="flex items-center gap-1 text-sm font-medium text-blue-600">
										<FiCheck size={14} />
										Aktivní
									</span>
								) : (
									<button
										type="button"
										onClick={() => switchBusiness(m.businessId)}
										className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700"
									>
										Přepnout
									</button>
								)}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	)
}
