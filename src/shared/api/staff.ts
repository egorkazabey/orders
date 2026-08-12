import { apiRequest } from './client'

export type StaffMember = {
	membershipId: string
	email: string
	role: 'OWNER' | 'STAFF'
	isSelf: boolean
}

export function getStaff(token: string) {
	return apiRequest<{ staff: StaffMember[] }>('/staff', { token })
}

export function inviteStaff(token: string, payload: { email: string; password?: string }) {
	return apiRequest<{ staff: StaffMember }>('/staff', { method: 'POST', body: payload, token })
}

export function removeStaff(token: string, membershipId: string) {
	return apiRequest<void>(`/staff/${membershipId}`, { method: 'DELETE', token })
}
