import { useEffect, useState } from 'react'

type CountdownTimerProps = {
	confirmedAt: string
	prepTimeMinutes: number
}

function formatDuration(ms: number) {
	const totalSeconds = Math.floor(Math.abs(ms) / 1000)
	const minutes = Math.floor(totalSeconds / 60)
	const seconds = totalSeconds % 60
	return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function CountdownTimer({ confirmedAt, prepTimeMinutes }: CountdownTimerProps) {
	const [now, setNow] = useState(() => Date.now())

	useEffect(() => {
		const interval = setInterval(() => setNow(Date.now()), 1000)
		return () => clearInterval(interval)
	}, [])

	const deadline = new Date(confirmedAt).getTime() + prepTimeMinutes * 60_000
	const remaining = deadline - now
	const isOverdue = remaining < 0

	return (
		<span className={`text-sm font-bold ${isOverdue ? 'text-red-600' : 'text-emerald-600'}`}>
			{isOverdue ? `Zpožděno o ${formatDuration(remaining)}` : formatDuration(remaining)}
		</span>
	)
}
