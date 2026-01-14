# úvod

Deskové hry na hrdiny představují specifickou kategorii herních systémů, které kombinují prvky narativního vyprávění, strategického rozhodování a pravidlově řízené interakce mezi hráči. Mezi nejznámější zástupce tohoto žánru patří systémy Dungeons & Dragons a jeho česká varianta Dračí doupě, které jsou založeny na spolupráci skupiny hráčů vedených jedním hráčem v roli Dungeon Mastera. Ten je zodpovědný za řízení herního světa, interpretaci pravidel a vytváření herních situací, zatímco ostatní hráči ovládají jednotlivé herní postavy.

S rozvojem digitálních technologií a webových aplikací dochází k postupné transformaci tradičních deskových her do online prostředí. Tento přechod přináší řadu výhod, mezi které patří snadnější dostupnost hry, možnost hraní na dálku, automatizace výpočtů a pravidel nebo rozšíření herního zážitku o multimediální prvky. Zároveň však klade vysoké nároky na návrh aplikační architektury, synchronizaci dat mezi hráči a zachování plynulosti herního průběhu.

Cílem této práce je návrh a implementace webové aplikace umožňující hraní multiplayerové hry na hrdiny inspirované systémem Dračího doupěte. Aplikace je navržena jako komplexní herní platforma, která zahrnuje správu herních entit, tvorbu a úpravu postav, organizaci multiplayerových lobby a podporu samotného herního sezení včetně bojových a nebojových interakcí. Důraz je kladen na moderní webové technologie, modularitu řešení a možnost dalšího rozšiřování aplikace.

Práce se zaměřuje především na teoretické aspekty použitých technologií a jejich vhodnost pro daný typ aplikace. Popsány jsou klíčové frameworky a nástroje použité při vývoji frontendové i backendové části aplikace, databázové řešení, práce se statickými soubory a kontejnerizace celého systému. Teoretická část tak vytváří základ pro následnou praktickou implementaci projektu.

# Architektura

Architektura aplikace je navržena na principu client–server modelu, který představuje standardní přístup k vývoji moderních webových aplikací. Tento model umožňuje jasné oddělení jednotlivých vrstev systému.

Klientská část aplikace běží v prostředí webového prohlížeče a slouží jako rozhraní mezi uživatelem a aplikací. Jejím hlavním úkolem je vykreslování uživatelského rozhraní, zpracování uživatelských vstupů a vizualizace aktuálního herního stavu. Klient komunikuje se serverem prostřednictvím síťových požadavků a v reálném čase reaguje na změny herního prostředí, což je klíčové pro plynulý průběh multiplayerových herních sezení.

Serverová část aplikace zajišťuje veškerou aplikační logiku a funguje jako centrální autoritativní a autentizační prvek celého systému. Je odpovědná za správu herních stavů, validaci akcí hráčů, autentizaci a autorizaci uživatelů a komunikaci s databázovou vrstvou. Server rovněž koordinuje komunikaci mezi jednotlivými klienty a zajišťuje synchronizaci dat v reálném čase, čímž je zajištěna konzistence herního světa pro všechny připojené hráče.

# Programovací jazyky

Volba programovacího jazyka pro fullstack aplikaci zásadně ovlivňuje rychlost vývoje a stabilitu celého systému. V rámci tohoto projektu byla zvolena kombinace moderního standardu JavaScriptu a jeho typové nadstavby TypeScript.

## JavaScript

JavaScript představuje primární programovací jazyk webu a jedinou nativní technologii pro logiku na straně klienta, kterou podporují všechny moderní prohlížeče. Pro potřeby této práce je JavaScript klíčový jako dynamický, interpretovaný jazyk s asynchronním modelem zpracování událostí.

V prostředí této aplikace je JavaScript využíván především skrze svůj moderní standard ECMAScript. Ten umožňuje efektivní manipulaci s asynchronními datovými toky pomocí konstrukcí async a await, což je nezbytné pro komunikaci se servery a databázemi. Díky neblokujícímu vstupu a výstupu je JavaScript ideální pro aplikace vyžadující vysokou míru interaktivity, jako jsou real-time herní systémy, kde je nutné zpracovávat mnoho vstupů od různých hráčů současně bez prodlev v uživatelském rozhraní.

## TypeScript

TypeScript je staticky typovaná nadstavba JavaScriptu. Pro vývoj komplexní multiplayerové platformy je TypeScript zvolen jako klíčový nástroj pro zajištění udržitelnosti a bezpečnosti kódu. TypeScript neexistuje jako samostatný runtime, ale v procesu sestavování aplikace je transpilován do čistého JavaScriptu.

Hlavním přínosem TypeScriptu je zavedení striktního typového systému. V případš, kde existuje velké množství provázaných entit s různými atributy, umožňuje TypeScript definovat přesné datové kontrakty. Pokud vývojář definuje strukturu, kompilátor během psaní kódu vynucuje správné používání všech parametrů. Tím dochází k eliminaci běžných programátorských chyb již ve fázi vývoje, nikoliv až při běhu aplikace u koncového uživatele.

TypeScript rovněž poskytuje pokročilé funkce, jako jsou rozhraní a generické typy. Ty jsou v projektu využity pro tvorbu znovupoužitelných komponent a funkcí, které mohou pracovat s různými datovými typy při zachování plné typové kontroly. Tato technologie tvoří nezbytný podklad pro fungování knihoven jako Drizzle ORM, které na typové bezpečnosti přímo staví svou architekturu.

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

## React

Zatímco Next.js zajišťuje celkovou architekturu a serverové schopnosti aplikace, samotné uživatelské rozhraní a interaktivita jsou postaveny na knihovně React. V kontextu této práce není React vnímán pouze jako nástroj pro tvorbu šablon, ale jako komplexní runtime prostředí, které definuje, jakým způsobem jsou data transformována do vizuální podoby a jak aplikace reaguje na vstupy uživatele v čase.

### JavaScript XML

Ačkoliv React umožňuje psaní komponent v čistém JavaScriptu, standardem a základním stavebním kamenem vývoje je JSX. Jedná se o syntaktické rozšíření jazyka JavaScript, které vývojářům umožňuje psát strukturu uživatelského rozhraní pomocí syntaxe podobné HTML přímo uvnitř logiky komponent.

Deklarativní popis UI a čitelnost JSX slouží popis toho, jak by mělo uživatelské rozhraní vypadat v závislosti na aktuálních datech. Namísto imperativního volání metod pro tvorbu elementů, vývojář definuje výsledný stav. To je v herní aplikaci výhodné zejména u komplexních prvků, jako jsou karty postav nebo tabulky statistik, kde JSX umožňuje přehledné vnořování komponent a logické oddělení struktury od funkčnosti.

Proces transformace a Transpilace Prohlížeče nativně JSX nepodporují, proto musí být během procesu sestavování transformováno. Moderní nástroje převádějí JSX zápis na volání funkcí.

Dynamické výrazy a zabezpečení JSX umožňuje vkládání libovolných JavaScriptových výrazů pomocí složených závorek. React v rámci JSX navíc automaticky provádí _"escapování"_ hodnot. Jakýkoliv obsah vložený do JSX je před vykreslením převeden na řetězec, což nativně chrání aplikaci před útoky typu Cross-Site Scripting, protože útočník nemůže do aplikace podvrhnout škodlivý skript skrze uživatelské jméno nebo chat.

Rozdíl mezi komponentami a HTML elementy JSX rozlišuje mezi standardními HTML tagy, které začínají malým písmenem, a uživatelskými komponentami, jež začínají velkým písmenem. Toto rozlišení je zásadní pro React runtime, který díky tomu ví, zda má vytvořit nativní DOM element, nebo spustit funkci přidružené komponenty a začít její životní cyklus.

### Virtual DOM

Základním výkonnostním pilířem Reactu je abstrakce zvaná Virtual DOM. Přímá manipulace s Reálným objektovým modelem dokumentu prohlížeče je výpočetně nákladná operace, která při častých změnách způsobuje zasekávání aplikace.

React tento problém řeší udržováním kopie DOM stromu v paměti. Tato verze, avšak neobsahuje celé html elementy, pouze jejich atributy, které jsou pozměněny od definovaného standardu. Při jakékoliv změně stavu aplikace React nejprve vytvoří novou verzi tohoto virtuálního stromu. Následně spustí _"usmiřovací algoritmus"_. Tento algoritmus porovná novou verzi stromu s předchozí verzí, tento proces proces zvaný diffing, a vypočítá minimální nutný počet operací, které je třeba provést na skutečném DOMu, aby odpovídal aktuálnímu stavu.

Díky tomuto mechanismu může herní smyčka aktualizovat stav hry desítkykrát za sekundu, přičemž React zajistí, že se v prohlížeči překreslí pouze ty atributy HTML elementů, které se skutečně změnily, aniž by docházelo k překreslování celého layoutu stránky.

### Hooky a životní cyklus komponent

Logika funkcionálních komponent je řízena pomocí mechanismu Hooků, které umožňují _"napojit se"_ na vnitřní stavy a životní cyklus Reactu. Existují tři typy hooků dělené podle funkcionality:

1. Stavové
2. Efektové
3. Referenční

Stavové hooky Slouží k uchování lokálního stavu komponenty mezi jednotlivými rendery. Standardem ve většině aplikací jsou: useState a useReducer. Zatímco useState je využit pro jednoduché hodnoty, popřípadně vnořené objekty, tak useReducer je implementován pro komplexní logiku, kde jeden akční vstup může ovlivnit více stavových proměnných. Při změně hodnoty hooku vždy nastane aktualizace komponentu ve kterém se hook nachází.

Efektové hook useEffek je vyžíván jako náhrada starší metody životního cyklu. Jedná se o způsob napojení na životní cyklus react komponentu. Který se aktivuje vždy když se jakákoliv z jeho _"závislostí"_ pozmění. Pokuď se funkce v useEffekt napojuje na DOM strukturu je potřeba vždy vyčistit _"event listenery"_ na konci životního cyklu aplikace.

Referenční hook useRef umožňuje uchovat referenci na hodnotu, která přetrvává mezi rendery, ale jejíž změna nevyvolává nové vykreslení. Využíván je především na reference HTML elementů a udržování více verzí hodnot jednoho parametru.

### React Server Components

Zatímco Next.js poskytuje routing pro serverové komponenty, samotná technologie RSC je vlastností Reactu. Klíčovým rozdílem oproti klasickému SSR je způsob serializace. Serverové komponenty nejsou na serveru transformovány do HTML, ale do speciálního formátu, který popisuje strukturu UI. Tento formát umožňuje Reactu na klientovi sloučit nově příchozí serverová data s již existujícím stavem klientských komponent, tato funkce je nazývána _"state prevention"_. Díky tomu je možné, aby se při navigaci v menu neztratil stav klientských komponent.

### Immutabilita a referenční identita

Pro správné fungování detekce změn v Reactu je klíčový koncept _neměnosti_ dat. V JavaScriptu jsou objekty a pole předávány referencí. Tradiční mutabilní přístup, kdy se mění hodnota přímo v paměti, je v Reactu antipatternem.

React využívá pro detekci změn takzvaný _"Shallow Comparison"_. Místo aby knihovna procházela hlubokou strukturu vnořených objektů a porovnávala každou hodnotu zvlášť, porovnává pouze reference objektů. Optimalizace tohoto systému se ze O(n) stává O(1).

Pokud se reference na objekt nezměnila, React předpokládá, že se nezměnila ani data uvnitř, a přeskočí náročný proces renderování. Aby aplikace donutila komponentu k překreslení, musí při aktualizaci stavu vytvořit zcela novou instanci objektu, čímž se změní jeho referenční identita. Tento princip je striktně dodržován, což zaručuje predikovatelnost toku dat.

### React Compiler

Významnou inovací použitou v projektu je nasazení React Compileru. V předchozích verzích Reactu, do verze 19, byla optimalizace renderování z velké části manuální odpovědností vývojáře. Aby se předešlo zbytečnému vytváření nových instancí funkcí a objektů při každém vykreslení, museli vývojáři obalovat kód do hooků useMemo, který slouží pro hodnoty, a useCallback, jenž složí pro funkce.

React Compiler tento proces automatizuje na úrovni sestavování. Analyzuje sémantiku kódu a datové toky uvnitř komponent a automaticky _"memorizuje"_ hodnoty, které nezávisí na změněných vstupech. V praxi to znamená, že pokud se změní data ve vyším komponentu, tak ne všechny _pod-komponenty_ budou muset být znovu sestaveny.

## Databáze

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

## Tailwind CSS

Pro definici vizuální podoby uživatelského rozhraní a tvorbu responzivního designu byla zvolena knihovna Tailwind CSS. Na rozdíl od tradičních CSS knihoven, které nabízejí předpřipravené komponenty,

### Utility-First paradigma

Základem Tailwind CSS je koncept Utility-First. Namísto vytváření sémantických tříd, které v sobě nesou desítky deklarací, framework poskytuje atomické třídy reprezentující jednotlivé CSS vlastnosti. V kontextu herní aplikace tento přístup přináší několik klíčových výhod:

- Eliminace kontextového přepínání:
  - Stylizace probíhá přímo v kódu komponenty.
  - Vývojář definuje vzhled elementů, pomocí řetězení tříd pro okraje, barvy a typografii, což výrazně zrychluje iterační cyklus vývoje.

- Konzistence herního světa
  - Tailwind definuje pevný systém hodnot pro mezery, stíny a barevné palety. Tím je zajištěno, že rozhraní působí celistvým dojmem a všechny prvky dodržují stejný vizuální řád bez manuálního hlídání konkrétních pixelových hodnot.

- Optimalizace datového přenosu
  - Knihovna využívá proces zvaný _"Purging"_. Během sestavování aplikace analyzuje zdrojový kód a do výsledného CSS souboru zahrne pouze ty třídy, které jsou v aplikaci skutečně použity. To vede k extrémně malým souborům stylů, což zrychluje načítání herního rozhraní.

### Responzivita a interaktivní stavy

Každá webová aplikace vyžaduje rozhrání, které se dokáže přizpůsobit různým velikostem obrazovek a poskytovat okamžitou vizuální odezvu. Tailwind tento problém řeší pomocí modifikátorů:

- Adaptivní design
  - Pomocí prefixů lze definovat, jak se má rozhraní přeskládat při změně velikosti okna prohlížeče.

- Stavy elementů
  - Tailwind CSS nabízí jednoduchý způsob, jak definovat vzhled prvků při interakci.
  - Modifikátory pro přejetí myší, aktivní prvek nebo zakázaný stav jsou klíčové pro intuitivní ovládání.
- Datové modifikátory
  - Knihovna má možnost vytvářet vlastní prefixy podle datového obsahu dané komponenty
  - CSS only návrh vizualizace HTML elementu

### Designový systém

Aplikace využívá centrální konfigurační soubor, který umožňuje rozšíření základníh knihovny o specifické prvky. Tento soubor je od verze Tailwind CSS v4 psán v podobě souoru css, ve kterém se pre-definují kaskádové styly. Do konfiguračního souboru jsou zaneseny vlastní barevné palety, specifické fonty a definice animací.

Díky integraci s TypeScriptem jsou tyto vlastní třídy plně typované. Pokud vývojář definuje v konfiguraci novou barvu, editor mu ji automaticky nabídne, čímž se minimalizuje riziko vzniku chyb v designu.

## Zustand

Pro správu globálního stavu aplikace byla zvolena knihovna Zustand. Jedná se o moderní, minimalistické řešení pro state management v prostředí Reactu, které se zaměřuje na jednoduchost, nízkou režii a vysoký výkon. V aplikaci plní Zustand roli centrálního uzlu, který propojuje data přicházející ze serveru s uživatelským rozhraním.

### Architektura Store a principy

Zustand funguje na principu centrálního úložiště, označovaného jako Store. Na rozdíl od komplexních knihoven, jako je Redux, Zustand nevyžaduje obalování aplikace do mnoha _"kontextových poskytovatelů"_, což eliminuje problém zvaný _"Provider Hell"_ a zjednodušuje celkovou strukturu projektu.

### Immutabilita a hooky

Stav v úložišti je imutabilní a lze jej měnit pouze pomocí definovaných akcí. To zajišťuje, že změny v stavu jsou predikovatelné a snadno sledovatelné.

Úložiště se v komponentách používá formou vlastních React hooků. To umožňuje vývojářům přistupovat k datům i k funkcím pro jejich aktualizaci pomocí intuitivního a čistého zápisu.

### Selektory a optimalizace vykreslování

Jednou z nejvýznamnějších vlastností knihovny Zustand, která je pro vývoj náročné webové aplikace klíčová, je nativní podpora selektorů. Selektory umožňují komponentám odebírat pouze ty části stavu, které jsou pro jejich funkci nezbytné.

V praxi to znamená, že pokud se v globálním úložišti změní například pozice postavy na mapě, komponenta zajišťující zobrazení chatu na tuto změnu nereaguje a nedochází k jejímu zbytečnému překreslování. Tento mechanismus radikálně snižuje zátěž na procesor klientského zařízení, což je u real-time aplikací, kde se data mění několikrát za sekundu, naprosto nezbytné.

### Integrace s asynchronními operacemi a WebSockety

Zustand vyniká svou schopností snadno integrovat asynchronní logiku přímo do akcí úložiště. Toho je v projektu využito především pro synchronizaci s API a real-time aktualizace. Tato uspořádání navíc umožňuje vícero připojení nejen typu client-server, jak už formou HTTP požadavků, tak i pomocí websocketů, ale i typu peer to peer pro rychlejší komunikaci uživatelů.

### Perzistence stavu

Díky podpoře middleware funkcí umožňuje Zustand snadnou implementaci perzistence. Vybrané části stavu, jsou automaticky ukládány do lokálního úložiště prohlížeče. Při opětovném načtení stránky se aplikace vrací do naposledy nastaveného stavu, což zvyšuje uživatelský komfort.

### Typování

Díky spojení s TypeScriptem je celý Store zcela typovaný. To znamená, že jakákoliv interakce se stavem je kontrolována kompilátorem, což zabraňuje chybám v logice herních mechanik a zajišťuje integritu dat napříč celým frontendem.

