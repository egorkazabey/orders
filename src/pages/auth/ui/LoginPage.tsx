import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/shared/ui'
import { useSession } from '@/entities/session'
import { ApiError } from '@/shared/api/client'
import { ROUTES } from '@/shared/config/routes'

const FIELD_CLASSES =
	'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none'

export function LoginPage() {
	const { login } = useSession()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		setIsSubmitting(true)
		try {
			await login(email, password)
			navigate(ROUTES.sales)
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Přihlášení se nezdařilo')
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
			<form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6">
				<h1 className="mb-1 text-xl font-semibold text-gray-900">Přihlášení</h1>
				<p className="mb-6 text-sm text-gray-500">Přihlaste se do administrace svého podniku.</p>

				{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

				<div className="mb-4">
					<label className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
					<input
						type="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={FIELD_CLASSES}
					/>
				</div>
				<div className="mb-6">
					<label className="mb-1 block text-sm font-medium text-gray-700">Heslo</label>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className={FIELD_CLASSES}
					/>
				</div>

				<Button variant="primary" type="submit" disabled={isSubmitting} className="w-full">
					{isSubmitting ? 'Přihlašování…' : 'Přihlásit se'}
				</Button>

				<p className="mt-4 text-center text-sm text-gray-500">
					Nemáte účet?{' '}
					<Link to="/signup" className="font-medium text-blue-600 hover:text-blue-700">
						Zaregistrujte se
					</Link>
				</p>
			</form>
		</div>
	)
}
