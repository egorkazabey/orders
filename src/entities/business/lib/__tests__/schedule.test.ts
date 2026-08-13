import { describe, it, expect } from 'vitest'
import { isBusinessOpenNow, isAcceptingOrders } from '../schedule'
import type { DaySchedule } from '../../model/types'

// 2024-01-01 is a Monday.
const MONDAY_10AM = new Date('2024-01-01T10:00:00')

function schedule(overrides: Partial<DaySchedule> = {}): DaySchedule[] {
	return [
		{
			id: 'd1',
			dayId: 'monday',
			enabled: true,
			ranges: [{ id: 'r1', fromTime: '09:00', toTime: '18:00' }],
			...overrides,
		},
	]
}

describe('isBusinessOpenNow', () => {
	it('is open when now falls inside an enabled range', () => {
		expect(isBusinessOpenNow(schedule(), MONDAY_10AM)).toBe(true)
	})

	it('is closed when the day is disabled', () => {
		expect(isBusinessOpenNow(schedule({ enabled: false }), MONDAY_10AM)).toBe(false)
	})

	it('is closed when now falls outside every range', () => {
		expect(isBusinessOpenNow(schedule({ ranges: [{ id: 'r1', fromTime: '19:00', toTime: '22:00' }] }), MONDAY_10AM)).toBe(
			false,
		)
	})
})

describe('isAcceptingOrders', () => {
	it('accepts orders with no cutoff whenever the shop is open', () => {
		expect(isAcceptingOrders(schedule(), 0, MONDAY_10AM)).toBe(true)
	})

	it('rejects orders once inside the cutoff window before closing', () => {
		const sched = schedule({ ranges: [{ id: 'r1', fromTime: '09:00', toTime: '10:15' }] })
		expect(isAcceptingOrders(sched, 30, MONDAY_10AM)).toBe(false)
	})

	it('accepts orders outside the cutoff window', () => {
		const sched = schedule({ ranges: [{ id: 'r1', fromTime: '09:00', toTime: '10:45' }] })
		expect(isAcceptingOrders(sched, 30, MONDAY_10AM)).toBe(true)
	})

	it('rejects orders when the shop is closed regardless of cutoff', () => {
		expect(isAcceptingOrders(schedule({ enabled: false }), 0, MONDAY_10AM)).toBe(false)
	})
})
