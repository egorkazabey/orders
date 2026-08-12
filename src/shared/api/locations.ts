import { apiRequest } from './client'

export function createLocation(token: string, payload: { name: string; slug: string }) {
	return apiRequest<{ business: { id: string; slug: string; name: string } }>('/locations', {
		method: 'POST',
		body: payload,
		token,
	})
}
