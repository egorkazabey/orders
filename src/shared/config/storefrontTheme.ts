import type { AccentColor } from '@/entities/business'

type AccentPreset = {
	label: string
	swatch: string
	accent: string
	accentHover: string
	accentSoft: string
	accentSoftText: string
}

export const ACCENT_PRESETS: Record<AccentColor, AccentPreset> = {
	orange: {
		label: 'Oranžová',
		swatch: '#ea580c',
		accent: '#ea580c',
		accentHover: '#c2410c',
		accentSoft: '#fff7ed',
		accentSoftText: '#c2410c',
	},
	blue: {
		label: 'Modrá',
		swatch: '#2563eb',
		accent: '#2563eb',
		accentHover: '#1d4ed8',
		accentSoft: '#eff6ff',
		accentSoftText: '#1d4ed8',
	},
	emerald: {
		label: 'Zelená',
		swatch: '#059669',
		accent: '#059669',
		accentHover: '#047857',
		accentSoft: '#ecfdf5',
		accentSoftText: '#047857',
	},
	rose: {
		label: 'Růžová',
		swatch: '#e11d48',
		accent: '#e11d48',
		accentHover: '#be123c',
		accentSoft: '#fff1f2',
		accentSoftText: '#be123c',
	},
	violet: {
		label: 'Fialová',
		swatch: '#7c3aed',
		accent: '#7c3aed',
		accentHover: '#6d28d9',
		accentSoft: '#f5f3ff',
		accentSoftText: '#6d28d9',
	},
}

export function accentCssVars(color: AccentColor): Record<string, string> {
	const preset = ACCENT_PRESETS[color] ?? ACCENT_PRESETS.orange
	return {
		'--accent': preset.accent,
		'--accent-hover': preset.accentHover,
		'--accent-soft': preset.accentSoft,
		'--accent-soft-text': preset.accentSoftText,
	}
}
