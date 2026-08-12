import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SignupPage } from '../SignupPage'
import { ApiError } from '@/shared/api/client'

const signup = vi.fn()

vi.mock('@/entities/session', () => ({
	useSession: () => ({ signup }),
}))

function renderPage() {
	return render(
		<MemoryRouter>
			<SignupPage />
		</MemoryRouter>,
	)
}

beforeEach(() => {
	signup.mockReset()
})

describe('SignupPage', () => {
	it('derives the slug from the business name until edited by hand', async () => {
		const user = userEvent.setup()
		renderPage()

		await user.type(screen.getByLabelText('Název podniku'), 'Pizzeria Verona')
		expect(screen.getByLabelText('Adresa webu')).toHaveValue('pizzeria-verona')

		await user.clear(screen.getByLabelText('Adresa webu'))
		await user.type(screen.getByLabelText('Adresa webu'), 'customslug')
		await user.type(screen.getByLabelText('Název podniku'), '!')
		expect(screen.getByLabelText('Adresa webu')).toHaveValue('customslug')
	})

	it('submits the form with the entered values', async () => {
		signup.mockResolvedValueOnce(undefined)
		const user = userEvent.setup()
		renderPage()

		await user.type(screen.getByLabelText('Název podniku'), 'Pizzeria Verona')
		await user.type(screen.getByLabelText('E-mail'), 'owner@example.com')
		await user.type(screen.getByLabelText('Heslo'), 'password123')
		await user.click(screen.getByRole('button', { name: 'Vytvořit účet' }))

		await waitFor(() =>
			expect(signup).toHaveBeenCalledWith({
				email: 'owner@example.com',
				password: 'password123',
				businessName: 'Pizzeria Verona',
				slug: 'pizzeria-verona',
			}),
		)
	})

	it('shows the API error message on failure', async () => {
		signup.mockRejectedValueOnce(new ApiError(409, 'Email already registered'))
		const user = userEvent.setup()
		renderPage()

		await user.type(screen.getByLabelText('Název podniku'), 'Pizzeria Verona')
		await user.type(screen.getByLabelText('E-mail'), 'owner@example.com')
		await user.type(screen.getByLabelText('Heslo'), 'password123')
		await user.click(screen.getByRole('button', { name: 'Vytvořit účet' }))

		expect(await screen.findByText('Email already registered')).toBeInTheDocument()
	})

	it('links to the terms and privacy pages', () => {
		renderPage()
		expect(screen.getByRole('link', { name: 'obchodními podmínkami' })).toHaveAttribute('href', '/terms')
		expect(screen.getByRole('link', { name: 'zásadami ochrany osobních údajů' })).toHaveAttribute('href', '/privacy')
	})
})
