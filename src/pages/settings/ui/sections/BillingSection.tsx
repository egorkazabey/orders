import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiCheck } from 'react-icons/fi'
import { useSession } from '@/entities/session'
import { getPlans, createCheckoutSession, createPortalSession } from '@/shared/api/billing'
import type { Plan } from '@/shared/api/billing'
import { me as fetchMe } from '@/shared/api/auth'
import { Button } from '@/shared/ui'
import { PLAN_DESCRIPTIONS } from '@/shared/config/planFeatures'

const STATUS_LABELS: Record<string, string> = {
	active: 'Aktivní',
	past_due: 'Platba se nezdařila',
	canceled: 'Zrušeno',
	trialing: 'Zkušební období',
}

export function BillingSection() {
	const { token, business, setBusiness } = useSession()
	const [searchParams, setSearchParams] = useSearchParams()
	const [plans, setPlans] = useState<Plan[]>([])
	const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
	const [isOpeningPortal, setIsOpeningPortal] = useState(false)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		getPlans()
			.then((res) => setPlans(res.plans))
			.catch(() => setError('Nepodařilo se načíst tarify'))
	}, [])

	const checkoutResult = searchParams.get('checkout')

	// The webhook that marks the subscription active can land a beat after
	// Stripe redirects back, so poll briefly instead of trusting one fetch.
	useEffect(() => {
		if (checkoutResult !== 'success' || !token) return
		let cancelled = false
		let attempts = 0

		async function poll() {
			if (cancelled || attempts >= 6) return
			attempts += 1
			const res = await fetchMe(token!)
			if (cancelled) return
			setBusiness(res.business)
			if (res.business.subscription?.plan === 'free') {
				setTimeout(poll, 1500)
			}
		}

		poll()
		return () => {
			cancelled = true
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkoutResult, token])

	const currentPlan = business?.subscription?.plan ?? 'free'
	const currentStatus = business?.subscription?.status ?? 'active'

	async function handleSubscribe(planId: Plan['id']) {
		if (!token) return
		setError(null)
		setLoadingPlan(planId)
		try {
			const res = await createCheckoutSession(token, planId)
			if (res.switched) {
				const me = await fetchMe(token)
				setBusiness(me.business)
				setLoadingPlan(null)
			} else {
				window.location.assign(res.url)
			}
		} catch {
			setError('Změnu tarifu se nepodařilo dokončit')
			setLoadingPlan(null)
		}
	}

	async function handleManageBilling() {
		if (!token) return
		setError(null)
		setIsOpeningPortal(true)
		try {
			const res = await createPortalSession(token)
			window.location.assign(res.url)
		} catch {
			setError('Nepodařilo se otevřít správu plateb')
			setIsOpeningPortal(false)
		}
	}

	return (
		<div className="max-w-4xl">
			{checkoutResult === 'success' && (
				<div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
					Platba proběhla úspěšně. Aktivace předplatného může chvíli trvat.
					<button
						type="button"
						onClick={() => setSearchParams({ tab: 'billing' })}
						className="ml-2 cursor-pointer font-medium underline"
					>
						Skrýt
					</button>
				</div>
			)}
			{checkoutResult === 'cancelled' && (
				<div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
					Platba byla zrušena.
				</div>
			)}
			{error && <p className="mb-4 text-sm text-red-600">{error}</p>}

			<div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
				<p className="text-sm text-gray-500">Aktuální tarif</p>
				<div className="mt-1 flex items-center gap-3">
					<span className="text-xl font-semibold text-gray-900 capitalize">
						{currentPlan === 'free' ? 'Free' : plans.find((p) => p.id === currentPlan)?.name || currentPlan}
					</span>
					{currentPlan !== 'free' && (
						<span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
							{STATUS_LABELS[currentStatus] ?? currentStatus}
						</span>
					)}
				</div>
				{business?.subscription?.currentPeriodEnd && currentPlan !== 'free' && (
					<p className="mt-1 text-sm text-gray-500">
						Obnoví se {new Date(business.subscription.currentPeriodEnd).toLocaleDateString('cs-CZ')}
					</p>
				)}
				{currentPlan !== 'free' && (
					<Button variant="ghost" onClick={handleManageBilling} disabled={isOpeningPortal} className="mt-3">
						{isOpeningPortal ? 'Otevírání…' : 'Spravovat platby'}
					</Button>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<div
					className={`flex flex-col rounded-xl border p-5 ${
						currentPlan === 'free' ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
					}`}
				>
					<h3 className="text-lg font-semibold text-gray-900">Free</h3>
					<p className="mt-1 text-2xl font-bold text-gray-900">
						0 Kč<span className="text-sm font-normal text-gray-500"> / měsíc</span>
					</p>
					<ul className="mt-4 flex flex-1 flex-col gap-2">
						{PLAN_DESCRIPTIONS.free.map((feature) => (
							<li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
								<FiCheck size={14} className="mt-0.5 shrink-0 text-emerald-500" />
								{feature}
							</li>
						))}
					</ul>
					{currentPlan === 'free' && (
						<span className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
							<FiCheck size={16} />
							Aktuální tarif
						</span>
					)}
				</div>

				{plans.map((plan) => {
					const isCurrent = plan.id === currentPlan
					return (
						<div
							key={plan.id}
							className={`flex flex-col rounded-xl border p-5 ${
								isCurrent ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
							}`}
						>
							<h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
							<p className="mt-1 text-2xl font-bold text-gray-900">
								{plan.priceCzk} Kč<span className="text-sm font-normal text-gray-500"> / měsíc</span>
							</p>
							<ul className="mt-4 flex flex-1 flex-col gap-2">
								{PLAN_DESCRIPTIONS[plan.id].map((feature) => (
									<li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
										<FiCheck size={14} className="mt-0.5 shrink-0 text-emerald-500" />
										{feature}
									</li>
								))}
							</ul>

							{isCurrent ? (
								<span className="mt-4 flex items-center justify-center gap-1.5 rounded-lg bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
									<FiCheck size={16} />
									Aktuální tarif
								</span>
							) : (
								<Button
									variant="primary"
									onClick={() => handleSubscribe(plan.id)}
									disabled={loadingPlan !== null}
									className="mt-4"
								>
									{loadingPlan === plan.id ? 'Přesměrování…' : 'Předplatit'}
								</Button>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
