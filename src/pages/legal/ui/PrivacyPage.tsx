import { LegalLayout } from './LegalLayout'

const OPERATOR_NAME = '[DOPLŇTE JMÉNO A PŘÍJMENÍ]'
const OPERATOR_ICO = '[DOPLŇTE IČO]'
const OPERATOR_ADDRESS = '[DOPLŇTE ADRESU SÍDLA]'
const CONTACT_EMAIL = '[DOPLŇTE KONTAKTNÍ E-MAIL]'
const SERVICE_NAME = 'Orders'

export function PrivacyPage() {
	return (
		<LegalLayout title="Zásady ochrany osobních údajů" updatedAt="[DOPLŇTE DATUM]">
			<p>
				Správcem osobních údajů zpracovávaných v souvislosti se službou {SERVICE_NAME} je {OPERATOR_NAME},
				IČO: {OPERATOR_ICO}, se sídlem {OPERATOR_ADDRESS}, e-mail: {CONTACT_EMAIL} (dále jen „Správce“).
				Zpracování probíhá v souladu s nařízením GDPR.
			</p>

			<h2>1. Jaké údaje zpracováváme</h2>
			<p>Podnikatel (uživatel administrace):</p>
			<ul>
				<li>E-mail a heslo (heslo je uloženo pouze jako hash, nikdy v čitelné podobě).</li>
				<li>Údaje o podniku: název, telefon, adresa, popis, odkazy na sociální sítě.</li>
				<li>Fakturační a platební údaje spravuje Stripe (viz bod 4).</li>
			</ul>
			<p>Zákazník (kdo zadává objednávku přes Storefront):</p>
			<ul>
				<li>Jméno, telefonní číslo, adresa doručení (je-li zvolen rozvoz) a poznámka k objednávce.</li>
				<li>Obsah objednávky (produkty, ceny, čas objednání).</li>
			</ul>

			<h2>2. Proč údaje zpracováváme</h2>
			<ul>
				<li>Za účelem poskytování Služby a zpracování objednávek (plnění smlouvy).</li>
				<li>Za účelem přihlášení a správy uživatelského účtu.</li>
				<li>Za účelem zpracování plateb a fakturace.</li>
				<li>Za účelem komunikace v souvislosti s objednávkou nebo účtem.</li>
			</ul>

			<h2>3. Jak dlouho údaje uchováváme</h2>
			<p>
				Údaje uchováváme po dobu trvání uživatelského účtu a dále po dobu vyžadovanou právními předpisy
				(např. účetní a daňové povinnosti). Po zrušení účtu jsou údaje, k jejichž uchování nejsme povinni ze
				zákona, smazány nebo anonymizovány.
			</p>

			<h2>4. Komu údaje předáváme (zpracovatelé)</h2>
			<p>Pro provoz Služby využíváme následující zpracovatele/subdodavatele:</p>
			<ul>
				<li><strong>Render</strong> — hosting serverové části aplikace.</li>
				<li><strong>Neon</strong> — hosting databáze.</li>
				<li><strong>Netlify</strong> — hosting webového rozhraní.</li>
				<li><strong>Stripe</strong> — zpracování plateb; platební údaje (číslo karty) Správce nikdy nevidí ani neukládá.</li>
			</ul>

			<h2>5. Přihlašovací token</h2>
			<p>
				Po přihlášení je ve vašem prohlížeči (localStorage) uložen přihlašovací token, který slouží k
				ověření identity při dalších požadavcích. Token se odstraní odhlášením nebo smazáním dat prohlížeče.
			</p>

			<h2>6. Vaše práva</h2>
			<p>Podle GDPR máte právo na:</p>
			<ul>
				<li>přístup ke svým osobním údajům,</li>
				<li>opravu nepřesných údajů,</li>
				<li>výmaz údajů („právo být zapomenut“),</li>
				<li>omezení zpracování,</li>
				<li>přenositelnost údajů,</li>
				<li>podání námitky proti zpracování a stížnosti u Úřadu pro ochranu osobních údajů (uoou.cz).</li>
			</ul>
			<p>Svá práva můžete uplatnit na {CONTACT_EMAIL}.</p>

			<h2>7. Změny těchto zásad</h2>
			<p>Tyto zásady můžeme čas od času aktualizovat. Aktuální verze je vždy dostupná na této stránce.</p>
		</LegalLayout>
	)
}
