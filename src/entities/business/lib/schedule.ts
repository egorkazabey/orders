import type { DaySchedule } from '../model/types'

const DAY_ID_BY_JS_INDEX = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function toMinutes(time: string) {
	const [hours, minutes] = time.split(':').map(Number)
	return hours * 60 + minutes
}

export function isBusinessOpenNow(schedule: DaySchedule[], now = new Date()) {
	const day = schedule.find((d) => d.dayId === DAY_ID_BY_JS_INDEX[now.getDay()])
	if (!day || !day.enabled) return false

	const nowMinutes = now.getHours() * 60 + now.getMinutes()
	return day.ranges.some((range) => nowMinutes >= toMinutes(range.fromTime) && nowMinutes < toMinutes(range.toTime))
}

export function isAcceptingOrders(schedule: DaySchedule[], cutoffMinutes: number, now = new Date()) {
	const day = schedule.find((d) => d.dayId === DAY_ID_BY_JS_INDEX[now.getDay()])
	if (!day || !day.enabled) return false

	const nowMinutes = now.getHours() * 60 + now.getMinutes()
	return day.ranges.some(
		(range) => nowMinutes >= toMinutes(range.fromTime) && nowMinutes < toMinutes(range.toTime) - cutoffMinutes,
	)
}
