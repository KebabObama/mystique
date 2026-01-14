# úvod

Deskové hry na hrdiny představují specifickou kategorii herních systémů, které kombinují prvky narativního vyprávění, strategického rozhodování a pravidlově řízené interakce mezi hráči. Mezi nejznámější zástupce tohoto žánru patří systémy Dungeons & Dragons a jeho česká varianta Dračí doupě, které jsou založeny na spolupráci skupiny hráčů vedených jedním hráčem v roli Dungeon Mastera. Ten je zodpovědný za řízení herního světa, interpretaci pravidel a vytváření herních situací, zatímco ostatní hráči ovládají jednotlivé herní postavy.

S rozvojem digitálních technologií a webových aplikací dochází k postupné transformaci tradičních deskových her do online prostředí. Tento přechod přináší řadu výhod, mezi které patří snadnější dostupnost hry, možnost hraní na dálku, automatizace výpočtů a pravidel nebo rozšíření herního zážitku o multimediální prvky. Zároveň však klade vysoké nároky na návrh aplikační architektury, synchronizaci dat mezi hráči a zachování plynulosti herního průběhu.

Cílem této práce je návrh a implementace webové aplikace umožňující hraní multiplayerové hry na hrdiny inspirované systémem Dračího doupěte. Aplikace je navržena jako komplexní herní platforma, která zahrnuje správu herních entit, tvorbu a úpravu postav, organizaci multiplayerových lobby a podporu samotného herního sezení včetně bojových a nebojových interakcí. Důraz je kladen na moderní webové technologie, modularitu řešení a možnost dalšího rozšiřování aplikace.

Práce se zaměřuje především na teoretické aspekty použitých technologií a jejich vhodnost pro daný typ aplikace. Popsány jsou klíčové frameworky a nástroje použité při vývoji frontendové i backendové části aplikace, databázové řešení, práce se statickými soubory a kontejnerizace celého systému. Teoretická část tak vytváří základ pro následnou praktickou implementaci projektu.

# Architektura

Architektura aplikace je navržena na principu client–server modelu, který představuje standardní přístup k vývoji moderních webových aplikací. Tento model umožňuje jasné oddělení jednotlivých vrstev systému.

Klientská část aplikace běží v prostředí webového prohlížeče a slouží jako rozhraní mezi uživatelem a aplikací. Jejím hlavním úkolem je vykreslování uživatelského rozhraní, zpracování uživatelských vstupů a vizualizace aktuálního herního stavu. Klient komunikuje se serverem prostřednictvím síťových požadavků a v reálném čase reaguje na změny herního prostředí, což je klíčové pro plynulý průběh multiplayerových herních sezení.

Serverová část aplikace zajišťuje veškerou aplikační logiku a funguje jako centrální autoritativní a autentizační prvek celého systému. Je odpovědná za správu herních stavů, validaci akcí hráčů, autentizaci a autorizaci uživatelů a komunikaci s databázovou vrstvou. Server rovněž koordinuje komunikaci mezi jednotlivými klienty a zajišťuje synchronizaci dat v reálném čase, čímž je zajištěna konzistence herního světa pro všechny připojené hráče.

# Použité technologie

Výběr technologií pro vývoj komplexní multiplayerové aplikace je kritickým krokem, který definuje nejen možnosti budoucího rozvoje, ale i limity výkonu, bezpečnosti a udržitelnosti kódu. Pro realizaci platformy inspirované hrou Dungeons and Dragons byly zvoleny technologie, které reprezentují současný vrchol v oblasti vývoje webových aplikací. Důraz byl kladen především na modularitu, rozšiřitelnost a možnost efektivní práce s dynamickými daty v reálném čase.

## Next.JS

Jako základní technologická platforma moderních webových aplikací se v současnosti často využívají tzv. meta-frameworky postavené nad knihovnou React. Tyto frameworky reagují na omezení tradičních přístupů založených výhradně na konceptu Single Page Applications a rozšiřují je o pokročilé mechanismy pro renderování, routování a optimalizaci přenosu dat. Jejich cílem je sjednotit vývoj klientské i serverové části aplikace do jednoho konzistentního prostředí a nabídnout flexibilní architekturu schopnou reagovat na rozdílné nároky jednotlivých částí systému.

### App Router

Srdcem aplikace je App Router, který představuje zásadní architektonický posun od tradičního směrování. App Router je postaven na specifikaci React Server Components (RSC). Tato technologie umožňuje definovat komponenty, které se renderují výhradně na serveru a do klientského zařízení se nikdy nepřenášejí ve formě spustitelného JavaScript kódu.

1. Server Components (Default): V App Routeru jsou všechny komponenty ve výchozím nastavení serverové. Při požadavku na stránku server provede renderování React stromu. Výsledkem není HTML string (jako u klasického SSR), ale speciální textový formát zvaný RSC Payload. Tento payload obsahuje serializovanou reprezentaci UI stromu, odkazy na klientské komponenty a předpočítaná data. Klient (prohlížeč) tento stream postupně zpracovává a rekonstruuje DOM. Díky tomu je možné přistupovat k databázi nebo souborovému systému přímo v těle komponenty (pomocí async/await), aniž by bylo nutné vytvářet API endpointy.

2. Client Components: Pro interaktivní prvky (tlačítka, formuláře, ovládání mapy) se využívají klientské komponenty označené direktivou 'use client'. Next.js inteligentně odděluje kód těchto komponent a posílá je klientovi jako separátní JavaScriptové balíčky (chunks). Dochází tak k tzv. hydrataci, kdy se na serverem vyrenderované HTML "naváže" klientská logika.

Tento model hybridního renderování zajišťuje, že statické části herního rozhraní (hlavičky, popisy, layout) nezatěžují hlavní vlákno prohlížeče, zatímco dynamické části zůstávají plně interaktivní.

### Pages Router

Ačkoliv App Router představuje jednu z hlavních sil Next.JS, pro specifické potřeby persistentního připojení v reálném čase naráží na limity abstrakce. App Router je postaven na moderním Web Request/Response API, které je standardizované napříč různými runtimy:

- Node.js
- Edge
- Workers

Pro implementaci herního serveru na stejné instanci aplikace bylo nutné využít starší, ale v tomto ohledu flexibilnější Pages Router. Serverové handlery v Pages Routeru běží v kontextu nativního Node.js HTTP serveru a nejsou limitovány pouze na Request/Response API.

Tento přístup umožňuje tzv. socket hijacking nebo zvíšení spojení:

1. Klient odešle HTTP požadavek na specifický API endpoint.
2. Serverový handler detekuje tento požadavek a místo odeslání standardní odpovědi využije přístup k instanci HTTP serveru skrze res.socket.server.
3. Pokud WebSocket server ještě neběží, handler jej inicializuje a naváže na stejný port jako HTTP server.
4. Spojení je povýšeno z HTTP na WebSocket protokol.

Díky této hybridní strategii může aplikace využívat nejnovější optimalizace Reactu pro vykreslování UI , a zároveň udržovat stabilní, obousměrný komunikační kanál pro přenos herních dat, aniž by bylo nutné spravovat a platit dva oddělené servery.

### Caching a Data Fetching

Next.js v implementuje komplexní cachovací mechanismus, který je inspirován HTTP standardy, ale rozšiřuje je o granularitu na úrovni jednotlivých komponent. Aplikace využívá několik vrstev cachování:

- Request Memoization
  - Pokud v rámci jednoho renderovacího cyklu dojde k volání stejné funkce pro načtení dat, Next.js tento požadavek provede pouze jednou. To eliminuje redundanci dotazů do databáze.

- Data Cache
  - Výsledky fetch požadavků jsou perzistentně ukládány na serveru. V kontextu hry to znamená, že statická data jsou načtena pouze jednou při buildu nebo prvním požadavku a následně servírována z cache souborového systému.

- Revalidace
  - Pro dynamická herní data je klíčová možnost invalidovat cache na vyžádání. Jakmile Dungeon Master upraví statistiky předmětu v administraci, zavolá se serverová akce, což zajistí, že všichni hráči při příštím načtení obdrží čerstvá data, aniž by se musela cache vypínat globálně.

### Runtime

Architektura Next.js umožňuje volbu běhového prostředí (runtime) pro každou routu zvlášť.

- Node.js
  - Je využit pro většinu aplikace, včetně WebSocket serveru a databázových operací skz DrizzleORM. Poskytuje plnou kompatibilitu se všemi Node.js API a knihovnami. Hlavní nevýhodou je snížená rychlost a plná závislost na node modulech.

- Edge Runtime
  - Je založen na V8 isolation a je určen pro kód, který musí běžet s minimální latencí, typicky middleware pro autorizaci nebo proxy pro autentizaci. V této práci je Edge runtime zvažován pro budoucí optimalizaci směrování hráčů do nejbližších herních regionů, ačkoliv primární logika běží na Node.js z důvodu potřeby dlouhotrvajících spojení.

## Turbopack

Pro efektivní vývoj byla využita nová generace bundleru – Turbopack. Tento nástroj, napsaný v jazyce Rust, nahrazuje Webpack a řeší problém pomalého startu vývojového serveru u rozsáhlých aplikací. Turbopack využívá inkrementální výpočty – pamatuje si výsledky předchozích sestavení a přepočítává pouze ty moduly, které byly změněny. V praxi to znamená, že i když aplikace naroste do stovek komponent a tisíců řádků kódu, změna v jedné React komponentě se v prohlížeči projeví v řádu desítek až stovek milisekund.

## DAtabáze

Architektura backendu stojí na robustním řešení pro persistenci a správu dat. Vzhledem ke komplexitě herních mechanik, které vyžadují jak striktní relační vazby , tak flexibilní struktury pro variabilní herní entity, bylo zvoleno spojení osvědčené databáze PostgreSQL a moderní abstraktní vrstvy Drizzle ORM.

### PostgreSQL

Jako primární databázové úložiště byl vybrán PostgreSQL, pokročilý open-source objektově-relační databázový systém. Jeho volba v kontextu vývoje multiplayerové RPG hry vychází z několika klíčových vlastností, které zajišťují stabilitu, integritu a výkon.

Základním požadavkem na herní databázi je garance, že data zůstanou konzistentní i v případě selhání systému nebo souběžných požadavků. PostgreSQL plně implementuje model ACID, přesněji:

- Atomicity
- Consistency
- Isolation
- Durability.

V praxi to znamená, že herní operace jsou zpracovávány jako atomické transakce. Příkladem může být obchodování mezi hráči: pokud hráč A předává předmět hráči B výměnou za měnu, databáze zajistí, že se odečtení předmětu, přičtení předmětu a přesun měny stanou v jediném okamžiku. Pokud by jakákoliv část procesu selhala, celá transakce se vrátí zpět a nedojde k situaci, kdy předmět zmizí, ale zlaťáky se nepřevedou.

Ačkoliv je PostgreSQL relační databází, pro moderní aplikace nabízí silnou podporu pro práci s nestrukturovanými daty pomocí datového typu JSONB. Tento formát umožňuje ukládat JSON dokumenty v binární, indexovatelné podobě přímo do sloupce tabulky. Pro RPG hru je tato vlastnost kritická. Zatímco základní entity mají pevnou strukturu, rozšiřující entity mají mnoho proměných, které mohou, ale nemusí být přístupny pro všechny entity ve stejné tabulce. Místo vytváření desítek sloupců s hodnotami NULL pro každý možný atribut, využívá databáze sloupec metadata typu JSONB. PostgreSQL umožňuje nad klíči uvnitř tohoto JSON objektu vytvářet zobecněnýy převrácený index nazývaný: GIN index, což umožňuje extrémně rychlé vyhledávání s výkonem srovnatelným s NoSQL databázemi.

PostgreSQL využívá mechanismus MVCC (Multi-Version Concurrency Control). Díky tomu mohou čtecí operace probíhat současně s operacemi zápisu, aniž by se vzájemně blokovaly. To je nezbytné pro udržení nízké latence v prostředí, kde desítky hráčů interagují v reálném čase.

### Drizzle ORM

Pro efektivní komunikaci aplikačního kódu v jazyce typescript s databází PostgreSQL byla zvolena knihovna Drizzle ORM. Jedná se o moderní nástroj, který redefinuje přístup k ORM s důrazem na typovou bezpečnost, minimální režii a maximální kontrolu nad generovaným SQL kódem.

Drizzle se odlišuje od tradičních ORM frameworků svou lehkostí. Funguje jako tenká vrstva nad SQL driverem. Jedná se dudíž o nižší úroveň abstrakce, která umožňuje psát 1: 1 sql dotazy.

- Zero Runtime Overhead
  - Na rozdíl od konkurenčních řešení, jako je Prisma ORM, která často spouští na pozadí vlastního binárního souboru pro zpracování dotazů, je Drizzle čistá TypeScript knihovna. Při běhu aplikace pouze sestaví optimalizovaný SQL řetězec a předá jej databázi. To minimalizuje dobu náběhu aplikace, což je klíčové v prostředí serverless funkcí.
- Code-First Schema
  - Definice databázových tabulek probíhá přímo v kódu aplikace. Vývojář definuje schéma pomocí TypeScript objektů, které slouží jako _"jediný zdroj pravdy"_. Z této definice se následně generují jak SQL migrace pro databázi, tak relace tabulek a typy pro aplikaci.

Hlavní předností Drizzle ORM je hluboká integrace s TypeScriptem. Knihovna využívá pokročilou inferenci typů. Tento mechanismus funguje end-to-end:

1. Při psaní dotazu
   - Editor kódu napovídá názvy sloupců a jejich typy.
   - Pokud se vývojář pokusí porovnat text s číslem, kompilátor vyhlásí chybu ještě před spuštěním aplikace.

2. Při návratu dat
   - Výsledek databázového dotazu je automaticky typován.
   - Není potřeba manuálně definovat rozhraní pro výsledky dotazů, Drizzle je odvodí dynamicky na základě toho, jaké sloupce a relace byly v dotazu vyžádány.

Pro zjednodušení práce s propojenými daty nabízí Drizzle tzv. Relational Query API. Toto API umožňuje vývojářům načítat hierarchická data deklarativním způsobem, podobně jako v GraphQL nebo Prisma ORM. Drizzle interně optimalizuje tyto požadavky, aby předešel problému N+1, což situace, kdy pro každou položku seznamu aplikace posílá samostatný dotaz do databáze. V závislosti na struktuře dat a použitém databázovém ovladači Drizzle buď zkompiluje požadavek do jednoho efektivního SQL dotazu, nebo data načte paralelně v minimálním počtu kroků a spojí je na úrovni aplikace, čímž zajišťuje optimální výkon i při složitých datových strukturách.

Součástí ekosystému je nástroj příkazové řádky Drizzle Kit, který automatizuje správu změn v databázi. Porovnává aktuální schéma definované v TypeScriptu se snapshotem předchozího stavu a generuje SQL migrační soubory. Tento proces zajišťuje, že vývoj databáze je verzovaný, transparentní a bezpečně replikovatelný napříč vývojovým, testovacím a produkčním prostředím.

