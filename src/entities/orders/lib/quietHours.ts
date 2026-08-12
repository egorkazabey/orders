function toMinutes(time: string) {
	const [h, m] = time.split(':').map(Number)
	return h * 60 + m
}

export function isWithinQuietHours(start: string | null, end: string | null, now = new Date()) {
	if (!start || !end) return false
	const nowMinutes = now.getHours() * 60 + now.getMinutes()
	const startMinutes = toMinutes(start)
	const endMinutes = toMinutes(end)

	if (startMinutes === endMinutes) return false
	if (startMinutes < endMinutes) {
		return nowMinutes >= startMinutes && nowMinutes < endMinutes
	}
	// Overnight range, e.g. 22:00 -> 06:00
	return nowMinutes >= startMinutes || nowMinutes < endMinutes
}
