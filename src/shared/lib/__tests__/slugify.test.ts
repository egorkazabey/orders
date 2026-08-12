import { describe, it, expect } from 'vitest'
import { slugify } from '../slugify'

describe('slugify', () => {
	it('lowercases and hyphenates spaces', () => {
		expect(slugify('Pizzeria Verona')).toBe('pizzeria-verona')
	})

	it('strips diacritics', () => {
		expect(slugify('Kavárna U Šípku')).toBe('kavarna-u-sipku')
	})

	it('collapses repeated separators', () => {
		expect(slugify('foo   bar---baz')).toBe('foo-bar-baz')
	})

	it('trims leading and trailing hyphens', () => {
		expect(slugify('  -Hello World-  ')).toBe('hello-world')
	})

	it('drops unsupported symbols', () => {
		expect(slugify('Café & Bistro!')).toBe('cafe-bistro')
	})

	it('returns an empty string for input with no valid characters', () => {
		expect(slugify('!!!')).toBe('')
	})
})
