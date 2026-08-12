let nextId = 0

/** Client-only temporary id for list keys before the server assigns a real one. */
export function generateTempId(prefix: string) {
	nextId += 1
	return `${prefix}-${nextId}`
}
