import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ProductForm } from '../ProductForm'

vi.mock('@/entities/business', () => ({
	useBusiness: () => ({ uploadProductPhoto: vi.fn(), removeProductPhoto: vi.fn() }),
}))

const categories = [{ id: 'cat-1', name: 'Pizza' }]

function renderForm() {
	const onSubmit = vi.fn().mockResolvedValue(undefined)
	render(
		<ProductForm
			categories={categories}
			initialProduct={null}
			onAddCategory={vi.fn()}
			onSubmit={onSubmit}
			onCancel={vi.fn()}
		/>,
	)
	return { onSubmit }
}

describe('ProductForm price input', () => {
	it('starts empty rather than showing a literal 0', () => {
		renderForm()
		const priceInput = screen.getAllByRole('spinbutton')[0]!
		expect(priceInput).toHaveValue(null)
	})

	it('lets you type a price straight away without a stray leading zero', async () => {
		renderForm()
		const user = userEvent.setup()
		const priceInput = screen.getAllByRole('spinbutton')[0]!

		await user.click(priceInput)
		await user.keyboard('150')

		expect(priceInput).toHaveValue(150)
	})

	it('submits the typed price as a number', async () => {
		const { onSubmit } = renderForm()
		const user = userEvent.setup()

		await user.type(screen.getByPlaceholderText('např. Margherita'), 'Margherita')
		await user.type(screen.getByPlaceholderText('např. Malá 26 cm'), 'Malá')
		await user.click(screen.getAllByRole('spinbutton')[0]!)
		await user.keyboard('150')
		await user.click(screen.getByRole('button', { name: 'Přidat produkt' }))

		expect(onSubmit).toHaveBeenCalledWith(
			expect.objectContaining({ variants: [{ name: 'Malá', price: 150 }] }),
		)
	})

	it('clearing an existing price empties the field instead of snapping back to 0', async () => {
		render(
			<ProductForm
				categories={categories}
				initialProduct={{
					id: 'p1',
					categoryId: 'cat-1',
					name: 'Margherita',
					description: '',
					icon: '🍕',
					photoUrl: null,
					soldOut: false,
					variants: [{ id: 'v1', name: 'Small', price: 100 }],
					addons: [],
				}}
				onAddCategory={vi.fn()}
				onSubmit={vi.fn()}
				onCancel={vi.fn()}
			/>,
		)
		const priceInput = screen.getAllByRole('spinbutton')[0]!
		expect(priceInput).toHaveValue(100)

		const user = userEvent.setup()
		await user.click(priceInput)
		await user.keyboard('{End}{Backspace}{Backspace}{Backspace}')

		expect(priceInput).toHaveValue(null)
	})
})
