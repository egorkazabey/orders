export type RingTone = 'classic' | 'chime' | 'alert'

let audioContext: AudioContext | null = null
let intervalId: number | null = null

function getContext() {
	if (!audioContext) audioContext = new AudioContext()
	return audioContext
}

function playBeep(ctx: AudioContext, startTime: number, frequency: number, duration: number) {
	const oscillator = ctx.createOscillator()
	const gain = ctx.createGain()
	oscillator.type = 'sine'
	oscillator.frequency.value = frequency
	gain.gain.setValueAtTime(0.0001, startTime)
	gain.gain.exponentialRampToValueAtTime(0.35, startTime + 0.02)
	gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)
	oscillator.connect(gain)
	gain.connect(ctx.destination)
	oscillator.start(startTime)
	oscillator.stop(startTime + duration + 0.05)
}

const TONE_PATTERNS: Record<RingTone, (ctx: AudioContext, now: number) => void> = {
	classic: (ctx, now) => {
		playBeep(ctx, now, 950, 0.35)
		playBeep(ctx, now + 0.45, 950, 0.35)
	},
	chime: (ctx, now) => {
		playBeep(ctx, now, 660, 0.2)
		playBeep(ctx, now + 0.2, 880, 0.2)
		playBeep(ctx, now + 0.4, 1100, 0.3)
	},
	alert: (ctx, now) => {
		playBeep(ctx, now, 1200, 0.15)
		playBeep(ctx, now + 0.2, 1200, 0.15)
		playBeep(ctx, now + 0.4, 1200, 0.15)
	},
}

export function previewTone(tone: RingTone) {
	const ctx = getContext()
	if (ctx.state === 'suspended') ctx.resume()
	TONE_PATTERNS[tone](ctx, ctx.currentTime)
}

export function startRinging(tone: RingTone = 'classic') {
	if (intervalId !== null) return
	const ctx = getContext()
	if (ctx.state === 'suspended') ctx.resume()
	const play = () => TONE_PATTERNS[tone](getContext(), getContext().currentTime)
	play()
	intervalId = window.setInterval(play, 2000)
}

export function stopRinging() {
	if (intervalId !== null) {
		window.clearInterval(intervalId)
		intervalId = null
	}
}
