import type { Order } from '@/shared/api/orders'

export function printOrderTicket(order: Order, businessName: string) {
	const win = window.open('', '_blank', 'width=380,height=600')
	if (!win) return

	const itemsHtml = order.items
		.map(
			(item) =>
				`<div class="item"><span>${item.quantity}× ${item.productName} (${item.variantName}${item.addonNames ? `, ${item.addonNames}` : ''})</span></div>`,
		)
		.join('')

	win.document.write(`
		<!doctype html>
		<html>
			<head>
				<title>Objednávka #${order.orderNumber}</title>
				<style>
					body { font-family: monospace; padding: 16px; font-size: 14px; color: #111; }
					h1 { font-size: 18px; margin: 0 0 4px; }
					.meta { margin-bottom: 12px; font-size: 12px; color: #444; }
					.item { padding: 3px 0; border-bottom: 1px dashed #ccc; }
					.total { margin-top: 12px; font-weight: bold; font-size: 16px; }
					.note { margin-top: 8px; font-style: italic; }
					hr { border: none; border-top: 1px dashed #999; margin: 12px 0; }
				</style>
			</head>
			<body>
				<h1>${businessName}</h1>
				<div class="meta">
					Objednávka #${order.orderNumber}<br/>
					${new Date(order.createdAt).toLocaleString('cs-CZ')}<br/>
					${order.customerName} · ${order.customerPhone}<br/>
					${order.deliveryMethod === 'delivery' ? `Doručení: ${order.address ?? ''}` : 'Osobní odběr'}
				</div>
				<hr/>
				${itemsHtml}
				<hr/>
				<div class="total">${order.totalPrice} Kč</div>
				${order.note ? `<div class="note">Poznámka: ${order.note}</div>` : ''}
			</body>
		</html>
	`)
	win.document.close()
	win.focus()
	win.print()
}
