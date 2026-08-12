import { useState } from 'react'
import { FiCheck, FiMoon, FiSun } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import { updateBusiness } from '@/shared/api/business'
import { Button } from '@/shared/ui'
import { ACCENT_PRESETS } from '@/shared/config/storefrontTheme'
import type { AccentColor, StorefrontTheme } from '@/entities/business'

export function DesignSection() {
	const { token, business, setBusiness } = useSession()
	const [theme, setTheme] = useState<StorefrontTheme>(business?.storefrontTheme ?? 'light')
	const [accentColor, setAccentColor] = useState<AccentColor>(business?.accentColor ?? 'orange')
	const [tagline, setTagline] = useState(business?.tagline ?? '')
	const [address, setAddress] = useState(business?.address ?? '')
	const [instagramUrl, setInstagramUrl] = useState(business?.instagramUrl ?? '')
	const [facebookUrl, setFacebookUrl] = useState(business?.facebookUrl ?? '')
	const [isSaving, setIsSaving] = useState(false)
	const [saved, setSaved] = useState(false)
	const [error, setError] = useState<string | null>(null)

	async function handleSave() {
		if (!token) return
		setIsSaving(true)
		setError(null)
		setSaved(false)
		try {
			const res = await updateBusiness(token, {
				storefrontTheme: theme,
				accentColor,
				tagline,
				address,
				instagramUrl,
				facebookUrl,
			})
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
			<h2 className="text-xl font-semibold text-gray-900">Vzhled webu</h2>
			<p className="mt-1 mb-6 text-sm text-gray-500">
				Přizpůsobte si veřejnou stránku, kterou vidí vaši zákazníci.
			</p>

			<div className="flex flex-col gap-6">
				<div>
					<span className="mb-2 block text-sm font-medium text-gray-700">Motiv</span>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => setTheme('light')}
							className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
								theme === 'light'
									? 'border-blue-500 bg-blue-50 text-blue-700'
									: 'border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
						>
							<FiSun size={16} />
							Světlý
						</button>
						<button
							type="button"
							onClick={() => setTheme('dark')}
							className={`flex flex-1 cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
								theme === 'dark'
									? 'border-blue-500 bg-blue-50 text-blue-700'
									: 'border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
						>
							<FiMoon size={16} />
							Tmavý
						</button>
					</div>
				</div>

				<div>
					<span className="mb-2 block text-sm font-medium text-gray-700">Barva webu</span>
					<div className="flex gap-3">
						{(Object.keys(ACCENT_PRESETS) as AccentColor[]).map((color) => (
							<button
								key={color}
								type="button"
								aria-label={ACCENT_PRESETS[color].label}
								onClick={() => setAccentColor(color)}
								className="relative flex size-10 cursor-pointer items-center justify-center rounded-full ring-offset-2 transition"
								style={{
									backgroundColor: ACCENT_PRESETS[color].swatch,
									boxShadow: accentColor === color ? `0 0 0 2px white, 0 0 0 4px ${ACCENT_PRESETS[color].swatch}` : undefined,
								}}
							>
								{accentColor === color && <FiCheck className="text-white" size={16} />}
							</button>
						))}
					</div>
				</div>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-gray-700">Slogan</span>
					<input
						type="text"
						value={tagline}
						onChange={(e) => setTagline(e.target.value)}
						placeholder="např. Nejlepší pizza ve městě, doručíme do 30 minut"
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
					/>
				</label>

				<label className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-gray-700">Adresa</span>
					<input
						type="text"
						value={address}
						onChange={(e) => setAddress(e.target.value)}
						placeholder="Ulice 123, Praha"
						className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
					/>
				</label>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Instagram</span>
						<input
							type="text"
							value={instagramUrl}
							onChange={(e) => setInstagramUrl(e.target.value)}
							placeholder="https://instagram.com/…"
							className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Facebook</span>
						<input
							type="text"
							value={facebookUrl}
							onChange={(e) => setFacebookUrl(e.target.value)}
							placeholder="https://facebook.com/…"
							className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none"
						/>
					</label>
				</div>
			</div>

			{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
			{saved && !error && <p className="mt-4 text-sm text-emerald-600">Uloženo.</p>}

			<Button variant="primary" onClick={handleSave} disabled={isSaving} className="mt-6">
				{isSaving ? 'Ukládání…' : 'Uložit změny'}
			</Button>
		</div>
	)
}
