import { useEffect, useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import { Button } from '@/shared/ui'
import { getStaff, inviteStaff, removeStaff } from '@/shared/api/staff'
import type { StaffMember } from '@/shared/api/staff'
import { ApiError } from '@/shared/api/client'

export function StaffSection() {
	const { token } = useSession()
	const [staff, setStaff] = useState<StaffMember[] | null>(null)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		if (!token) return
		getStaff(token)
			.then((res) => setStaff(res.staff))
			.catch(() => setError('Nepodařilo se načíst personál'))
	}, [token])

	async function handleInvite() {
		if (!token || !email.trim()) return
		setIsSubmitting(true)
		setError(null)
		try {
			const res = await inviteStaff(token, { email: email.trim(), password: password || undefined })
			setStaff((prev) => [...(prev ?? []), res.staff])
			setEmail('')
			setPassword('')
		} catch (err) {
			setError(err instanceof ApiError ? err.message : 'Nepodařilo se přidat zaměstnance')
		} finally {
			setIsSubmitting(false)
		}
	}

	async function handleRemove(membershipId: string) {
		if (!token) return
		await removeStaff(token, membershipId)
		setStaff((prev) => prev?.filter((s) => s.membershipId !== membershipId) ?? null)
	}

	return (
		<div className="max-w-3xl">
			<div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
				<h2 className="mb-1 text-lg font-semibold text-gray-900">Přidat zaměstnance</h2>
				<p className="mb-4 text-sm text-gray-500">
					Zaměstnanci mají přístup k objednávkám, produktům a dostupnosti, ale ne k fakturaci ani správě personálu.
				</p>
				<div className="flex flex-wrap items-end gap-3">
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">E-mail</span>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="zamestnanec@email.cz"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none sm:w-64"
						/>
					</label>
					<label className="flex flex-col gap-1.5">
						<span className="text-sm font-medium text-gray-700">Heslo (pro nový účet)</span>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="min. 8 znaků"
							className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none sm:w-48"
						/>
					</label>
					<Button variant="primary" onClick={handleInvite} disabled={isSubmitting || !email.trim()}>
						<span className="flex items-center gap-1.5">
							<FiPlus size={16} />
							Přidat
						</span>
					</Button>
				</div>
				{error && <p className="mt-3 text-sm text-red-600">{error}</p>}
			</div>

			<div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
				{!staff ? (
					<p className="px-6 py-10 text-center text-sm text-gray-500">Načítání…</p>
				) : (
					<div className="overflow-x-auto">
						<table className="w-full text-left text-sm">
							<thead className="border-b border-gray-200 bg-gray-50 text-xs font-medium tracking-wide text-gray-500 uppercase">
								<tr>
									<th className="px-6 py-3">E-mail</th>
									<th className="px-6 py-3">Role</th>
									<th className="px-6 py-3" />
								</tr>
							</thead>
							<tbody>
								{staff.map((member) => (
									<tr key={member.membershipId} className="border-b border-gray-100 last:border-b-0">
										<td className="px-6 py-3 font-medium whitespace-nowrap text-gray-900">
											{member.email}
											{member.isSelf && <span className="ml-2 text-xs text-gray-400">(vy)</span>}
										</td>
										<td className="px-6 py-3 whitespace-nowrap text-gray-600">
											{member.role === 'OWNER' ? 'Majitel' : 'Zaměstnanec'}
										</td>
										<td className="px-6 py-3 text-right">
											{member.role !== 'OWNER' && (
												<button
													type="button"
													aria-label="Odebrat přístup"
													onClick={() => handleRemove(member.membershipId)}
													className="cursor-pointer text-gray-400 transition hover:text-red-600"
												>
													<FiTrash2 size={16} />
												</button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>
		</div>
	)
}
