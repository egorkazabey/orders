import type { ButtonHTMLAttributes, ReactNode } from 'react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	icon: ReactNode
	/** Accessible name — required since the button has no visible text. */
	label: string
	size?: 'md' | 'lg'
}

const SIZE_CLASSES = {
	md: 'text-lg',
	lg: 'text-xl',
}

/** Icon-only button. Always accessible via aria-label, never a bare clickable <div>. */
export function IconButton({ icon, label, size = 'md', className = '', ...rest }: IconButtonProps) {
	return (
		<button
			type="button"
			aria-label={label}
			className={`cursor-pointer text-gray-700 hover:text-blue-700 transition dark:text-stone-300 dark:hover:text-blue-400 ${SIZE_CLASSES[size]} ${className}`}
			{...rest}
		>
			{icon}
		</button>
	)
}
