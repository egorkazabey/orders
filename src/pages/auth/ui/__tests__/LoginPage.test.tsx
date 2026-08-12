import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { LoginPage } from '../LoginPage'
import { ApiError } from '@/shared/api/client'

const login = vi.fn()

vi.mock('@/entities/session', () => ({
	useSession: () => ({ login }),
}))

function renderPage() {
	return render(
		<MemoryRouter>
			<LoginPage />
		</MemoryRouter>,
	)
}

beforeEach(() => {
	login.mockReset()
})

describe('LoginPage', () => {
	it('submits email and password to login', async () => {
		login.mockResolvedValueOnce(undefined)
		const user = userEvent.setup()
		renderPage()

		await user.type(screen.getByLabelText('E-mail'), 'owner@example.com')
		await user.type(screen.getByLabelText('Heslo'), 'password123')
		await user.click(screen.getByRole('button', { name: 'Přihlásit se' }))

		await waitFor(() => expect(login).toHaveBeenCalledWith('owner@example.com', 'password123'))
	})

	it('shows the API error message on failure', async () => {
		login.mockRejectedValueOnce(new ApiError(401, 'Invalid email or password'))
		const user = userEvent.setup()
		renderPage()

		await user.type(screen.getByLabelText('E-mail'), 'owner@example.com')
		await user.type(screen.getByLabelText('Heslo'), 'wrong')
		await user.click(screen.getByRole('button', { name: 'Přihlásit se' }))

		expect(await screen.findByText('Invalid email or password')).toBeInTheDocument()
	})

	it('shows a generic error message for non-API failures', async () => {
		login.mockRejectedValueOnce(new Error('network down'))
		const user = userEvent.setup()
		renderPage()

		await user.type(screen.getByLabelText('E-mail'), 'owner@example.com')
		await user.type(screen.getByLabelText('Heslo'), 'password123')
		await user.click(screen.getByRole('button', { name: 'Přihlásit se' }))

		expect(await screen.findByText('Přihlášení se nezdařilo')).toBeInTheDocument()
	})
})
