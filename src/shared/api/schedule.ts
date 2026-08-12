import { apiRequest } from './client'
import type { DaySchedule } from '@/entities/business'

export function getSchedule(token: string) {
	return apiRequest<{ schedule: DaySchedule[] }>('/schedule', { token })
}

export type ScheduleDayInput = {
	dayId: string
	enabled: boolean
	ranges: { fromTime: string; toTime: string }[]
}

export function updateSchedule(token: string, days: ScheduleDayInput[]) {
	return apiRequest<{ schedule: DaySchedule[] }>('/schedule', { method: 'PUT', body: days, token })
}
