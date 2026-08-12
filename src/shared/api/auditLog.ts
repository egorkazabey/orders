import { apiRequest } from './client'

export type AuditLogEntry = {
	id: string
	actorEmail: string
	action: string
	targetType: string
	targetLabel: string
	createdAt: string
}

export function getAuditLog(token: string) {
	return apiRequest<{ entries: AuditLogEntry[] }>('/audit-log', { token })
}
