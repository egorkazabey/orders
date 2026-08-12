import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

export function LegalLayout({ title, updatedAt, children }: { title: string; updatedAt: string; children: ReactNode }) {
	return (
		<div className="min-h-screen bg-gray-50 px-4 py-10">
			<div className="mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-6 sm:p-10">
				<Link to="/" className="mb-6 inline-block text-sm text-gray-500 hover:text-gray-700">
					← Zpět
				</Link>
				<h1 className="mb-1 text-2xl font-semibold text-gray-900">{title}</h1>
				<p className="mb-8 text-sm text-gray-500">Poslední aktualizace: {updatedAt}</p>
				<div className="space-y-6 text-sm leading-relaxed text-gray-700 [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
					{children}
				</div>
			</div>
		</div>
	)
}
