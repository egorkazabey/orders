import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: ButtonVariant
	children: ReactNode
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
	primary: 'bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-1.5 rounded',
	ghost: 'text-gray-700 hover:text-blue-700',
}

/** Generic button. Composes variant styling on top of native button behaviour. */
export function Button({ variant = 'primary', className = '', disabled, children, ...rest }: ButtonProps) {
	return (
		<button
			type="button"
			disabled={disabled}
			className={`transition ${VARIANT_CLASSES[variant]} ${
				disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
			} ${className}`}
			{...rest}
		>
			{children}
		</button>
	)
}
