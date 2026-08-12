import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui'
import { useSession } from '@/entities/session'
import { ApiError } from '@/shared/api/client'
import { slugify } from '@/shared/lib/slugify'

const FIELD_CLASSES =
	'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none'

export function SignupPage() {
	const { signup } = useSession()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [businessName, setBusinessName] = useState('')
	const [slug, setSlug] = useState('')
	const [slugTouched, setSlugTouched] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	function handleBusinessNameChange(value: string) {
		setBusinessName(value)
		if (!slugTouched) setSlug(slugify(value))
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		setIsSubmitting(true)
		try {
			await signup({ email, password, businessName, slug })
			navigate('/')
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Registrace se nezdařila')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
			<form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6">
				<h1 className="mb-1 text-xl font-semibold text-gray-900">Vytvořit účet</h1>
				<p className="mb-6 text-sm text-gray-500">Založte si podnik a vlastní web pro objednávky.</p>

				{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

				<div className="mb-4">
					<label htmlFor="signup-business-name" className="mb-1 block text-sm font-medium text-gray-700">
						Název podniku
					</label>
					<input
						id="signup-business-name"
						required
						value={businessName}
						onChange={(e) => handleBusinessNameChange(e.target.value)}
						placeholder="např. Pizzeria Verona"
						className={FIELD_CLASSES}
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="signup-slug" className="mb-1 block text-sm font-medium text-gray-700">
						Adresa webu
					</label>
					<input
						id="signup-slug"
						required
						value={slug}
						onChange={(e) => {
							setSlugTouched(true)
							setSlug(slugify(e.target.value))
						}}
						placeholder="pizzeria-verona"
						className={FIELD_CLASSES}
					/>
					{slug && <p className="mt-1 text-xs text-gray-400">Váš web: /s/{slug}</p>}
				</div>
				<div className="mb-4">
					<label htmlFor="signup-email" className="mb-1 block text-sm font-medium text-gray-700">
						E-mail
					</label>
					<input
						id="signup-email"
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={FIELD_CLASSES}
					/>
				</div>
				<div className="mb-6">
					<label htmlFor="signup-password" className="mb-1 block text-sm font-medium text-gray-700">
						Heslo
					</label>
					<input
						id="signup-password"
						type="password"
						required
						minLength={8}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={FIELD_CLASSES}
					/>
				</div>

				<Button variant="primary" type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? 'Vytváření účtu…' : 'Vytvořit účet'}
				</Button>

				<p className="mt-4 text-center text-xs text-gray-400">
					Registrací souhlasíte s{' '}
					<Link to="/terms" className="underline hover:text-gray-600">
						obchodními podmínkami
					</Link>{' '}
					a{' '}
					<Link to="/privacy" className="underline hover:text-gray-600">
						zásadami ochrany osobních údajů
					</Link>
					.
				</p>

				<p className="mt-4 text-center text-sm text-gray-500">
					Už máte účet?{' '}
					<Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
						Přihlaste se
					</Link>
				</p>
			</form>
		</div>
	)
}
