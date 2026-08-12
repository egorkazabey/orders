import { useCallback, useState } from 'react'

export function useToggle(initial = false) {
	const [value, setValue] = useState(initial)
	const toggle = useCallback(() => setValue((prev) => !prev), [])
	const close = useCallback(() => setValue(false), [])
	const open = useCallback(() => setValue(true), [])
	return { value, toggle, open, close }
}
