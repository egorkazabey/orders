import { describe, it, expect } from 'vitest'
import { planFeaturesFor, PLAN_FEATURES } from '../planFeatures'

describe('planFeaturesFor', () => {
	it('returns features for a known plan', () => {
		expect(planFeaturesFor('business')).toBe(PLAN_FEATURES.business)
	})

	it('falls back to free for undefined', () => {
		expect(planFeaturesFor(undefined)).toBe(PLAN_FEATURES.free)
	})

	it('falls back to free for null', () => {
		expect(planFeaturesFor(null)).toBe(PLAN_FEATURES.free)
	})

	it('falls back to free for an unrecognized plan', () => {
		expect(planFeaturesFor('enterprise')).toBe(PLAN_FEATURES.free)
	})
})
