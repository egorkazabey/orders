export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export class ApiError extends Error {
	status: number

	constructor(status: number, message: string) {
		super(message)
		this.status = status
	}
}

type RequestOptions = {
	method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
	body?: unknown
	token?: string | null
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		method: options.method ?? 'GET',
		headers: {
			'Content-Type': 'application/json',
			...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
		},
		body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
	})

	if (!res.ok) {
		const data = await res.json().catch(() => ({}))
		throw new ApiError(res.status, data.error ?? `Request failed with status ${res.status}`)
	}

	if (res.status === 204) return undefined as T
	return res.json() as Promise<T>
}
