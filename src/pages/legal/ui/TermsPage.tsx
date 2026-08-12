import { LegalLayout } from './LegalLayout'

const OPERATOR_NAME = '[DOPLŇTE JMÉNO A PŘÍJMENÍ]'
const OPERATOR_ICO = '[DOPLŇTE IČO]'
const OPERATOR_ADDRESS = '[DOPLŇTE ADRESU SÍDLA]'
const CONTACT_EMAIL = '[DOPLŇTE KONTAKTNÍ E-MAIL]'
const SERVICE_NAME = 'Orders'

export function TermsPage() {
	return (
		<LegalLayout title="Obchodní podmínky" updatedAt="[DOPLŇTE DATUM]">
			<p>
				Tyto obchodní podmínky upravují užívání služby {SERVICE_NAME} (dále jen „Služba“), kterou provozuje{' '}
				{OPERATOR_NAME}, IČO: {OPERATOR_ICO}, se sídlem {OPERATOR_ADDRESS} (dále jen „Provozovatel“).
			</p>

			<h2>1. Co Služba dělá</h2>
			<p>
				Služba umožňuje registrovaným uživatelům („Podnikatel“) spravovat objednávky, produkty, klienty a
				provozovat vlastní online web pro příjem objednávek („Storefront“). Koncoví zákazníci Podnikatele
				(„Zákazník“) mohou přes Storefront zadávat objednávky a případně platit online.
			</p>

			<h2>2. Registrace a účet</h2>
			<ul>
				<li>Pro použití administrace je nutná registrace e-mailem a heslem.</li>
				<li>Podnikatel odpovídá za správnost údajů o svém podniku a za obsah, který na Storefront zveřejní.</li>
				<li>Přístupové údaje je nutné chránit; Provozovatel nenese odpovědnost za škody způsobené jejich zneužitím třetí osobou.</li>
			</ul>

			<h2>3. Platby a předplatné</h2>
			<p>
				Placené funkce Služby jsou zpracovávány prostřednictvím platební brány Stripe. Platební údaje (číslo
				karty apod.) Provozovatel nikdy nezpracovává ani neukládá — jejich zpracování probíhá výhradně u
				společnosti Stripe. Aktuální ceny a rozsah placených plánů jsou uvedeny v administraci Služby.
			</p>

			<h2>4. Dostupnost Služby</h2>
			<p>
				Provozovatel usiluje o maximální dostupnost Služby, negarantuje ji však nepřetržitě. Služba je
				poskytována „tak jak je“, bez záruky bezchybného provozu. Provozovatel neodpovídá za škody vzniklé
				výpadkem Služby, ztrátou dat nebo nedostupností třetích systémů (hosting, platební brána).
			</p>

			<h2>5. Odpovědnost za obsah</h2>
			<p>
				Za obsah zveřejněný na Storefront (popis produktů, ceny, fotografie) odpovídá výhradně Podnikatel.
				Provozovatel si vyhrazuje právo odstranit obsah, který porušuje právní předpisy nebo tyto podmínky.
			</p>

			<h2>6. Ukončení užívání</h2>
			<p>
				Podnikatel může kdykoli zrušit svůj účet. Provozovatel může přístup ke Službě omezit nebo zrušit při
				porušení těchto podmínek nebo zneužití Služby.
			</p>

			<h2>7. Změny podmínek</h2>
			<p>
				Provozovatel může tyto podmínky v přiměřeném rozsahu měnit. O podstatných změnách budou uživatelé
				informováni prostřednictvím Služby nebo e-mailem.
			</p>

			<h2>8. Kontakt</h2>
			<p>V případě dotazů nás kontaktujte na {CONTACT_EMAIL}.</p>
		</LegalLayout>
	)
}
