import { useState } from 'react'
import { useSession } from '@/entities/session'
import { updateBusiness } from '@/shared/api/business'
import { Button } from '@/shared/ui'

export function ProfileSection() {
	const { token, business, setBusiness } = useSession()
	const [name, setName] = useState(business?.name ?? '')
	const [phone, setPhone] = useState(business?.phone ?? '')
	const [description, setDescription] = useState(business?.description ?? '')
	const [isSaving, setIsSaving] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [saved, setSaved] = useState(false)

	async function handleSave() {
		if (!token) return
		setIsSaving(true)
		setError(null)
		setSaved(false)
		try {
			const res = await updateBusiness(token, { name, phone, description })
			setBusiness(res.business)
			setSaved(true)
		} catch {
			setError('Uložení se nepodařilo')
		} finally {
			setIsSaving(false)
		}
	}

	return (
		<div className="max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
			<h2 className="text-xl font-semibold text-gray-900">Profil podniku</h2>
			<p className="mt-1 mb-6 text-sm text-gray-500">
				Tyto údaje se zobrazují zákazníkům na vaší veřejné stránce.
			</p>

			<div className="flex flex-col gap-4">
				<label className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-gray-700">Název podniku</span>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-gray-700">Telefon</span>
					<input
						type="text"
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-gray-700">Popis</span>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						rows={4}
						placeholder="Krátký popis vašeho podniku pro zákazníky…"
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
					/>
				</label>
			</div>

			{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
			{saved && !error && <p className="mt-4 text-sm text-emerald-600">Uloženo.</p>}

			<Button variant="primary" onClick={handleSave} disabled={isSaving} className="mt-6">
				{isSaving ? 'Ukládání…' : 'Uložit změny'}
			</Button>
		</div>
	)
}
