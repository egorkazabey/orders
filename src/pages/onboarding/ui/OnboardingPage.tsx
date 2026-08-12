import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCheck, FiExternalLink } from 'react-icons/fi'
import { Header } from '@/widgets/header'
import { useSession } from '@/entities/session'
import { getSchedule } from '@/shared/api/schedule'
import { getProducts } from '@/shared/api/products'
import { getStaff } from '@/shared/api/staff'
import { getOrders } from '@/shared/api/orders'
import { ROUTES, storefrontPath } from '@/shared/config/routes'
import { Button } from '@/shared/ui'

type OnboardingStepProps = {
	done: boolean
	title: string
	description: string
	actionLabel: string
	onAction: () => void
}

function OnboardingStep({ done, title, description, actionLabel, onAction }: OnboardingStepProps) {
	return (
		<div
			className={`flex items-center gap-4 rounded-xl border p-4 ${
				done ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-white'
			}`}
		>
			<span
				className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
					done ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
				}`}
			>
				<FiCheck size={16} />
			</span>
			<div className="min-w-0 flex-1">
				<p className="font-medium text-gray-900">{title}</p>
				<p className="text-sm text-gray-500">{description}</p>
			</div>
			{!done && (
				<Button variant="ghost" onClick={onAction} className="shrink-0">
					{actionLabel}
				</Button>
			)}
		</div>
	)
}

function PageShell({ children }: { children: ReactNode }) {
	return (
		<div className="flex h-screen flex-col">
			<Header />
			<main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
		</div>
	)
}

type Checklist = {
	hasProfile: boolean
	hasHours: boolean
	hasProducts: boolean
	hasStaff: boolean
	hasNotifications: boolean
	hasBilling: boolean
	hasCompletedOrder: boolean
}

export function OnboardingPage() {
	const { status, business, role, token } = useSession()
	const navigate = useNavigate()
	const isOwner = role === 'OWNER'
	const [checklist, setChecklist] = useState<Checklist | null>(null)

	useEffect(() => {
		if (status !== 'authenticated' || !token || !business) return
		let cancelled = false

		Promise.all([
			getSchedule(token),
			getProducts(token),
			getOrders(token),
			isOwner ? getStaff(token) : Promise.resolve(null),
		])
			.then(([scheduleRes, productsRes, ordersRes, staffRes]) => {
				if (cancelled) return
				setChecklist({
					hasProfile: Boolean(business.phone.trim() && business.description.trim()),
					hasHours: scheduleRes.schedule.some((day) => day.enabled),
					hasProducts: productsRes.products.length > 0,
					hasStaff: staffRes ? staffRes.staff.length > 1 : true,
					hasNotifications: Boolean(
						!business.soundEnabled || business.ringTone !== 'classic' || business.quietHoursStart,
					),
					hasBilling: Boolean(business.subscription && business.subscription.plan !== 'free'),
					hasCompletedOrder: ordersRes.orders.some((order) => order.status === 'DONE'),
				})
			})
			.catch(() => {
				if (cancelled) return
				setChecklist({
					hasProfile: false,
					hasHours: false,
					hasProducts: false,
					hasStaff: false,
					hasNotifications: false,
					hasBilling: false,
					hasCompletedOrder: false,
				})
			})

		return () => {
			cancelled = true
		}
	}, [status, token, business, isOwner])

	if (status === 'loading') {
		return (
			<PageShell>
				<p className="text-sm text-gray-500">Načítání…</p>
			</PageShell>
		)
	}

	if (status === 'guest') {
		return (
			<PageShell>
				<div className="flex h-full flex-col items-center justify-center px-4 text-center">
					<h1 className="max-w-lg text-3xl font-semibold text-gray-900">
						Vlastní web pro objednávky za pár minut
					</h1>
					<p className="mt-3 max-w-md text-gray-500">
						Založte si účet a spusťte online objednávky pro svůj podnik ještě dnes.
					</p>
					<div className="mt-6 flex gap-3">
						<Button variant="primary" onClick={() => navigate(ROUTES.signup)}>
							Začít zdarma
						</Button>
						<Button variant="ghost" onClick={() => navigate(ROUTES.login)}>
							Přihlásit se
						</Button>
					</div>
				</div>
			</PageShell>
		)
	}

	const steps = checklist
		? [
				{
					visible: isOwner,
					done: checklist.hasProfile,
					title: 'Vyplnit profil podniku',
					description: 'Telefon a popis, které zákazníci uvidí na vašem webu.',
					actionLabel: 'Vyplnit profil',
					onAction: () => navigate('/settings?tab=profile'),
				},
				{
					visible: true,
					done: checklist.hasHours,
					title: 'Nastavit otevírací dobu',
					description: 'Zákazníci uvidí, kdy si u vás mohou objednat.',
					actionLabel: 'Nastavit hodiny',
					onAction: () => navigate('/settings?tab=availability'),
				},
				{
					visible: true,
					done: checklist.hasProducts,
					title: 'Přidat první produkt',
					description: 'Přidejte alespoň jeden produkt do nabídky.',
					actionLabel: 'Přidat produkt',
					onAction: () => navigate('/settings?tab=products'),
				},
				{
					visible: isOwner,
					done: checklist.hasStaff,
					title: 'Přidat personál',
					description: 'Pozvěte zaměstnance, kteří budou zpracovávat objednávky.',
					actionLabel: 'Přidat personál',
					onAction: () => navigate('/settings?tab=staff'),
				},
				{
					visible: isOwner,
					done: checklist.hasNotifications,
					title: 'Nastavit oznámení',
					description: 'Zvuk, tón vyzvánění nebo tiché hodiny pro nové objednávky.',
					actionLabel: 'Nastavit oznámení',
					onAction: () => navigate('/settings?tab=notifications'),
				},
				{
					visible: isOwner,
					done: checklist.hasBilling,
					title: 'Vybrat tarif',
					description: 'Zvolte si tarif podle velikosti vašeho podniku.',
					actionLabel: 'Vybrat tarif',
					onAction: () => navigate('/settings?tab=billing'),
				},
				{
					visible: true,
					done: checklist.hasCompletedOrder,
					title: 'Přijmout a dokončit první objednávku',
					description: 'Zkuste si projít celý proces od přijetí až po dokončení objednávky.',
					actionLabel: 'Zobrazit objednávky',
					onAction: () => navigate(ROUTES.onlineOrders),
				},
			].filter((step) => step.visible)
		: []

	const allDone = checklist !== null && steps.every((step) => step.done)

	return (
		<PageShell>
			<div className="mx-auto max-w-2xl">
				<h1 className="text-2xl font-semibold text-gray-900">Vítejte{business ? `, ${business.name}` : ''}!</h1>
				<p className="mt-1 mb-6 text-sm text-gray-500">
					{allDone
						? 'Máte vše nastaveno a připraveno na první objednávky.'
						: 'Dokončete pár kroků a spusťte svůj web pro objednávky.'}
				</p>

				{checklist && (
					<div className="mb-6 flex flex-col gap-3">
						{steps.map((step) => (
							<OnboardingStep
								key={step.title}
								done={step.done}
								title={step.title}
								description={step.description}
								actionLabel={step.actionLabel}
								onAction={step.onAction}
							/>
						))}
					</div>
				)}

				{business && (
					<div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
						<p className="text-sm font-medium text-gray-900">Váš web</p>
						<a
							href={storefrontPath(business.slug)}
							target="_blank"
							rel="noreferrer"
							className="mt-1 flex w-fit items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700"
						>
							{storefrontPath(business.slug)}
							<FiExternalLink size={14} />
						</a>
					</div>
				)}

				<Button variant="primary" onClick={() => navigate(ROUTES.sales)}>
					Pokračovat do administrace
				</Button>
			</div>
		</PageShell>
	)
}
