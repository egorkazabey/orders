import { createBrowserRouter } from 'react-router-dom'
import { ROUTES } from '@/shared/config/routes'
import { OnboardingPage } from '@/pages/onboarding'
import { SalesPage } from '@/pages/sales'
import { ClientsPage } from '@/pages/clients'
import { OnlineOrdersPage } from '@/pages/online-orders'
import { SettingsPage } from '@/pages/settings'
import { StorefrontPage } from '@/pages/storefront'
import { LoginPage, SignupPage } from '@/pages/auth'
import { TermsPage, PrivacyPage } from '@/pages/legal'
import { RequireAuth } from './RequireAuth'

export const router = createBrowserRouter([
	{ path: ROUTES.onboarding, element: <OnboardingPage /> },
	{ path: ROUTES.login, element: <LoginPage /> },
	{ path: ROUTES.signup, element: <SignupPage /> },
	{ path: ROUTES.terms, element: <TermsPage /> },
	{ path: ROUTES.privacy, element: <PrivacyPage /> },
	{
		element: <RequireAuth />,
		children: [
			{ path: ROUTES.settings, element: <SettingsPage /> },
			{ path: ROUTES.onlineOrders, element: <OnlineOrdersPage /> },
			{ path: ROUTES.clients, element: <ClientsPage /> },
			{ path: ROUTES.sales, element: <SalesPage /> },
		],
	},
	{ path: ROUTES.storefront, element: <StorefrontPage /> },
])
