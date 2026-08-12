import { RouterProvider } from 'react-router-dom'
import { SessionProvider } from '@/entities/session'
import { router } from './providers/router/router'

export default function App() {
	return (
		<SessionProvider>
			<RouterProvider router={router} />
		</SessionProvider>
	)
}
