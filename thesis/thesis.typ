= úvod

Žánr deskových her na hrdiny se stal jedinečným typem herních systémů, které spojují prvky vyprávění příběhu, strategického rozhodování a pravidelně řízených interakcí mezi hráči. Patří sem nejznámější deskové hry na hrdiny systému Dungeons & Dragons a jeho český analog Dračí doupě, které se staví na spolupráci skupinového hráče se skupinou hráčů řízených jedním hráčem jako Dungeon Masterem. Dungeon Master je odpovědný za řízení herového světa a interpretaci pravidel, zatímco hráči ovládají jednotlivé herové postavy.

S rozvojem aplikací a online prostředí se tyto hry začínají objevovat i v online prostředí. To s sebou přináší řadu výhod, jako je možnost jednodušeji dostupné hry, možnosti hraní na dálku, automatizace provádění pravidel nebo obohacení hry o multimediální prvky. Hraní her tohoto typu ale klade vysoké nároky na konstrukci aplikace, synchronizaci dat mezi hráči a udržení plynulosti hry.

Cílem této práce je návrh a implementace webové aplikace umožňující hraní multiplayerové hry na hrdiny inspirované Dračí doupětem. Aplikace je navržena tak, aby sloužila jako plnohodnotná herní platforma zahrnující správu herních jednotek, tvorbu a úpravu postav, správu multiplayerových utkání a vedení samotné hry. Důraz je kladen na využití moderních technologií pro web a na maximální možnosti dalšího rozšiřování aplikace.

= Architektura

Pro aplikaci bylo zvoleno schéma klient-server, které je běžným standardem pro vývoj webových aplikací. Architektura klient-server umožňuje čisté oddělení klientského kódu od serverového, což umožní bezpečnost serveru a jeden zdroj pravdy.

Klientská část aplikace běží přímo v webovém prohlížeči a představuje rozhraní mezi uživatelem a aplikací. Její hlavní úlohou je zobrazování uživatelského rozhraní, zpracovávání uživatelských vstupů a zobrazování aktuálního herního stavu. Klientská část aplikace s serverem komunikuje pomocí síťových požadavků a reaguje v reálném čase na změny.

Části aplikace, které se zabývají jsou prováděny na serveru a jsou zde umístěny rozhodící autoritativní a autentizační část celého systému. Zajišťuje také správu herních stavů, ověřování tahů hráčů, přihlášení a legitimaci uživatele a komunikační funkce s databází. Server také zajišťuje komunikační funkce s jednotlivými klienty a provádí synchronizaci dat v reálném čase s cílem zajištění konzistence.

= Programovací jazyky

Výběr programovacího jazyka pro fullstack aplikace je extrémně důležité pro rychlost vývoje i stabilnost takového systému. V tomto projektu bude kombinován moderní standard jazyka JavaScriptu se jeho typovou nadstavbou TypeScriptem.

== JavaScript

JavaScript je hlavním programovací jazykem pro web a jediným nativním webovým jazykem pro logiku na straně klienta, který je podporován všemi moderními prohlížeči. Pro účely této publikace je jazyk JavaScript velice důležitý, protože se jedná o dynamicky interpretovaný jazyk s asynchronV kontextu této aplikace je jazyk JavaScript využíván hlavně prostřednictvím jeho současného standardu ECMAScript. Ten poskytuje účelnou manipulaci asynchronními proudy dat prostřednictvím konstrukcí async a await, což je nesmírné požadavku pro interakce s serverem i databází. Také kvůli neblokujícím vstupu a výstupu je jazyk JavaScript nejvhodnějším pro aplikace vyžadující vysoké interaktivní hodnoty, jako jsou systémy reálného času, kde je zapotřebí zpracování velké množství vstupů od různých uživatelů současně bez prodlení.

== TypeScript

TypeScript je staticky typovaná nadstavba JavaScriptu . Pro vývoj komplexní multiplayerové platformy je TypeScript zvolen jako klíčový nástroj pro zajištění udržitelnosti a bezpečnosti kódu. TypeScript neexistuje jako samostatný runtime, ale v procesu sestavování aplikace je transpilován do čistého JavaScriptu @typescript-docs.

Hlavním přínosem TypeScriptu je zavedení striktního typového systému. V případš, kde existuje velké množství provázaných entit s různými atributy, umožňuje TypeScript definovat přesné datové kontrakty. Pokud vývojář definuje strukturu, kompilátor během psaní kódu vynucuje správné používání všech parametrů. Tím dochází k eliminaci běžných programátorských chyb již ve fázi vývoje, nikoliv až při běhu aplikace u koncového uživatele.

TypeScript rovněž poskytuje pokročilé funkce, jako jsou rozhraní a generické typy. Ty jsou v projektu využity pro tvorbu znovupoužitelných komponent a funkcí, které mohou pracovat s různými datovými typy při zachování plné typové kontroly. Tato technologie tvoří nezbytný podklad pro fungování knihoven jako Drizzle ORM, které na typové bezpečnosti přímo staví svou architekturu.

= Použité technologie

Výběr technologií na vývoj komplexní aplikace s multiplayer podporou je rozhodujícím bodem, který určuje nikoli pouze možnosti dalšího rozvoje, ale také omezení výkonu, bezpečnosti a udržitelnosti vyvinutého kódu. Pro vývoj platformy na bázi hry Dungeons & Dragons byly vybrane technologie, které představují aktuální špičku na poli vývojových technologií webových aplikací. Značný důraz byl kladen na modulárnost, rozšiřitelnost a efektivní zpracování dynam

== Next.JS

Jako základy technologie pro moderne webové aplikace se dnes často používají tzv. meta-frameworky navržené nad knihovnou React. Takové frameworky reagují na omezení klasických přístupů, které se soustředí jenom na Single Page Applications, a rozšiřují ho o pokročilé mechanismy pro renderování, routování a optimalizaci přenosu dat. Cílem takových frameworků je sjednotit vývoj obou částí klienta a serveru jedné aplikace v jediném prostředí a nabídnout flexibilní architekturu, která bude reagovat podle rozdílných potřeb obou částí systému @nextjs-docs.

=== App Router

V rámci App Routeru jsou veškeré komponenty implicitně nastaveny jako serverové. Při zpracování požadavku server provede rendering React stromu, jehož výstupem není prostý HTML řetězec, ale specifický textový formát RSC Payload. Tento stream obsahuje serializovanou reprezentaci UI stromu, odkazy na klientské komponenty a předpočítaná data, na jejichž základě klientský prohlížeč postupně rekonstruuje DOM. Tento mechanismus umožňuje přímý přístup k databázi či souborovému systému pomocí async/await přímo v těle komponenty, bez nutnosti expozice API endpointů.

Pro interaktivní prvky jsou využívány Client Components uvozené direktivou 'use client'. Next.js tyto komponenty izoluje do separátních JavaScriptových balíčků (chunks), které jsou odesílány klientovi k následné hydrataci – procesu, kdy se na serverem vyrenderované HTML naváže klientská aplikační logika. Tento model zajišťuje, že statické části rozhraní nezatěžují hlavní vlákno prohlížeče, zatímco dynamické segmenty zůstávají plně interaktivní.

Tento model hybridního renderování zajišťuje, že statické části rozhraní nezatěžují hlavní vlákno prohlížeče, zatímco dynamické části zůstávají plně interaktivní.

=== Pages Router

Navzdory pokročilé abstrakci App Routeru, který staví na moderním a standardizovaném Web Request/Response API (kompatibilním s Node.js, Edge i Workers), naráží tato architektura na limity v případě perzistentních připojení. Pro implementaci herního serveru vyžadujícího obousměrnou komunikaci v reálném čase je proto nezbytné využít Pages Router. Serverové handlery v Pages Routeru operují v kontextu nativního Node.js HTTP serveru, což umožňuje techniku tzv. socket hijacking. Tato hybridní strategie dovoluje aplikaci využívat nejnovější optimalizace Reactu pro UI a současně udržovat stabilní komunikační kanál pro herní data bez nutnosti správy separátní serverové infrastruktury.

=== Caching a Data Fetching

Next.js implementuje komplexní vícevrstvý cachovací mechanismus inspirovaný standardy protokolu HTTP, který však rozšiřuje o vysokou míru granularity až na úroveň jednotlivých komponent. První linii této architektury tvoří Request Memoization, jež v rámci jediného renderovacího cyklu eliminuje redundanci datových dotazů tím, že identické volání funkce pro načtení dat provede pouze jednou, čímž efektivně snižuje zátěž navazujících vrstev. Na tuto fázi navazuje Data Cache, kde jsou výsledky požadavků typu fetch perzistentně ukládány přímo v souborovém systému serveru; statická data jsou tak načtena pouze při sestavení aplikace (buildu) nebo při historicky prvním požadavku a následně jsou distribuována přímo z cache bez nutnosti opětovné komunikace se zdrojem. Klíčovým prvkem pro správu dynamických herních či aplikačních dat je pak mechanismus revalidace, který umožňuje on-demand invalidaci uložených záznamů. Jakákoliv změna stavu, například úprava statistik v administraci, tak skrze serverovou akci zajistí doručení aktuálních dat hned při příštím klientském požadavku, aniž by bylo nutné přistoupit k neefektivnímu globálnímu vypínání cachování.

=== Runtime

Architektura frameworku nabízí vysokou míru flexibility díky možnosti volby specifického běhového prostředí (dále již nazývaného `runtime`) pro každou jednotlivou cestu nebo API endpoint, což vývojářům umožňuje precizně optimalizovat výkon aplikace podle povahy konkrétní úlohy. Dominantním prostředím pro většinu aplikační logiky zůstává Node.js runtime, který poskytuje plnou podporu standardních serverových API a nízkoúrovňových operací. I přes určitou režii spojenou s komplexností Node.js modulů a potenciálně vyšší latencí při studených startech, je toto prostředí nezbytné pro operace vyžadující přímý přístup k systémovým prostředkům. V kontextu herního serveru se Node.js využívá zejména pro obsluhu WebSocket serveru a náročné databázové procesy realizované skrze Drizzle ORM, kde je vyžadována robustní manipulace s daty a stabilní konektivita.

Protiváhu k robustnímu Node.js představuje Edge Runtime, který je navržen s důrazem na maximální efektivitu a minimální latenci. Toto prostředí je postaveno na technologii V8 isolation, která je výrazně lehčí než tradiční Node.js kontejnery, což umožňuje bleskové spuštění kódu v datových centrech fyzicky nejbližších uživateli. Vzhledem k vysoké optimalizaci a omezené sadě dostupných API je Edge Runtime ideální volbou pro kritické operace, které nesmí brzdit tok požadavku. Typické nasazení zahrnuje komplexní middleware pro ověřování přístupových práv, dynamické směrování nebo proxy servery zajišťující transparentní autentizaci, kde je prioritou okamžitá odezva systému bez zbytečné režie standardního serverového prostředí.

== Turbopack

Pro efektivní vývoj byla využita nová generace bundleru -- Turbopack. Tento nástroj, napsaný v jazyce Rust, nahrazuje Webpack a řeší problém pomalého startu vývojového serveru u rozsáhlých aplikací. Turbopack využívá inkrementální výpočty -- pamatuje si výsledky předchozích sestavení a přepočítává pouze ty moduly, které byly změněny. V praxi to znamená, že i když aplikace naroste do stovek komponent a tisíců řádků kódu, změna v jedné React komponentě se v prohlížeči projeví v řádu desítek až stovek milisekund.

== React

Zatímco Next.js zajišťuje celkovou architekturu a serverové schopnosti aplikace, samotné uživatelské rozhraní a interaktivita jsou postaveny na knihovně React. V kontextu této práce není React vnímán pouze jako nástroj pro tvorbu šablon, ale jako komplexní runtime prostředí, které definuje, jakým způsobem jsou data transformována do vizuální podoby a jak aplikace reaguje na vstupy uživatele v čase @react-docs.

=== JavaScript XML

Ačkoliv React umožňuje psaní komponent v čistém JavaScriptu, standardem a základním stavebním kamenem vývoje je JSX. Jedná se o syntaktické rozšíření jazyka JavaScript, které vývojářům umožňuje psát strukturu uživatelského rozhraní pomocí syntaxe podobné HTML přímo uvnitř logiky komponent.

Deklarativní popis UI a čitelnost JSX slouží popis toho, jak by mělo uživatelské rozhraní vypadat v závislosti na aktuálních datech. Namísto imperativního volání metod pro tvorbu elementů, vývojář definuje výsledný stav. To je v herní aplikaci výhodné zejména u komplexních prvků, jako jsou karty postav nebo tabulky statistik, kde JSX umožňuje přehledné vnořování komponent a logické oddělení struktury od funkčnosti.

Proces transformace a Transpilace Prohlížeče nativně JSX nepodporují, proto musí být během procesu sestavování transformováno. Moderní nástroje převádějí JSX zápis na volání funkcí.

Dynamické výrazy a zabezpečení JSX umožňuje vkládání libovolných JavaScriptových výrazů pomocí složených závorek. React v rámci JSX navíc automaticky provádí _"escapování"_ hodnot. Jakýkoliv obsah vložený do JSX je před vykreslením převeden na řetězec, což nativně chrání aplikaci před útoky typu Cross-Site Scripting, protože útočník nemůže do aplikace podvrhnout škodlivý skript skrze uživatelské jméno nebo chat.

Rozdíl mezi komponentami a HTML elementy JSX rozlišuje mezi standardními HTML tagy, které začínají malým písmenem, a uživatelskými komponentami, jež začínají velkým písmenem. Toto rozlišení je zásadní pro React runtime, který díky tomu ví, zda má vytvořit nativní DOM element, nebo spustit funkci přidružené komponenty a začít její životní cyklus.

=== Virtual DOM

Základním výkonnostním pilířem Reactu je abstrakce zvaná Virtual DOM. Přímá manipulace s Reálným objektovým modelem dokumentu prohlížeče je výpočetně nákladná operace, která při častých změnách způsobuje zasekávání aplikace.

React tento problém řeší udržováním kopie DOM stromu v paměti. Tato verze, avšak neobsahuje celé html elementy, pouze jejich atributy, které jsou pozměněny od definovaného standardu. Při jakékoliv změně stavu aplikace React nejprve vytvoří novou verzi tohoto virtuálního stromu. Následně spustí _"usmiřovací algoritmus"_. Tento algoritmus porovná novou verzi stromu s předchozí verzí, tento proces proces zvaný diffing, a vypočítá minimální nutný počet operací, které je třeba provést na skutečném DOMu, aby odpovídal aktuálnímu stavu.

Díky tomuto mechanismu může herní smyčka aktualizovat stav hry desítkykrát za sekundu, přičemž React zajistí, že se v prohlížeči překreslí pouze ty atributy HTML elementů, které se skutečně změnily, aniž by docházelo k překreslování celého layoutu stránky.

=== Hooky a životní cyklus komponent

Logika funkcionálních komponent je řízena pomocí mechanismu Hooků, které umožňují _"napojit se"_ na vnitřní stavy a životní cyklus Reactu. Existují tři typy hooků dělené podle funkcionality:

+ Stavové
+ Efektové
+ Referenční

Stavové hooky Slouží k uchování lokálního stavu komponenty mezi jednotlivými rendery. Standardem ve většině aplikací jsou: useState a useReducer. Zatímco useState je využit pro jednoduché hodnoty, popřípadně vnořené objekty, tak useReducer je implementován pro komplexní logiku, kde jeden akční vstup může ovlivnit více stavových proměnných. Při změně hodnoty hooku vždy nastane aktualizace komponentu ve kterém se hook nachází.

Efektový hook se jmenuje hook useEffek a je používáno jako náhrada pro starší životní cyklus v podobě soběstačné metody. Jedná se o způsob, jak napojit na životní cyklus React komponentu, který se spustí jen v případě, že se hodnota jeho „závislostí“ změní. Pokuď se funkce v useEffekt napojuje na DOM strukturu je potřeba vždy vyčistit _"event listenery"_ na konci životního cyklu aplikace.

Referenční hook useRef umožňuje uchovat referenci na hodnotu, která přetrvává mezi rendery, ale jejíž změna nevyvolává nové vykreslení. Využíván je především na reference HTML elementů a udržování více verzí hodnot jednoho parametru.

=== React Server Components

I když Next.js podporuje routing zahrnující server-side komponenty, samotný mechanismus RSC je součástí Reactu. Hlavním odlišným faktorem v porovnání s tradiční SSR je seriazizace. Na serverovém nástroji se totiž komponenty nezpracovávají na různé html prvky, ale dělají to na velmi specifickou strukturu. Takže React na straně klienta sloučí nově doručené serverové informace spolu s údajemi již existujících stavú klientských komponent, velmi praktičtí nástroj na obhospodařovávání komponent a rychlého vykreslování.

=== Immutabilita a referenční ident

Důležitý princip pro efektivní práci s detekcí změn ve Reactu je právě nedokončenost dat. V jazyku JavaScript jsou objektu a rozsahu posílána reference. Kulturní objekt s proměnností veadratickým způsobem přímo na míre-findu několi by bylo ve Reactu

V zařízení React se využívá takzvaný „_Shallow Comparison_“ místo hlubokého rozboru struktur vnořených objektech. Oproti tomu knihovna místo hlubokého rozboru rozdílnou hodnotou jednotlivě srovnávané objekty pouze jejich

Pokud se reference na objekt nezměnila, React uměl progressDialoguecalled zapomenula, že se.data nezměnil内部, a přeskočídifficil获取runtime proces renderování. Pro instance festival.applicative, aby musela měnit komponentu rins, když se aktualizovala.data state Pavel musela vytvořit úplně fresh nový instance objektu, takže by se měnil også reference na objekt. Takhle.aldrin princip Eugineaders_annotations,rectticky

=== React Compiler

Významnou inovací použitou v projektu je nasazení React Compileru. V předchozích verzích Reactu, do verze 19, byla optimalizace renderování z velké části manuální odpovědností vývojáře. Aby se předešlo zbytečnému vytváření nových instancí funkcí a objektů při každém vykreslení, museli vývojáři obalovat kód do hooků useMemo, který slouží pro hodnoty, a useCallback, jenž složí pro funkce.

React Compiler tento proces automatizuje na úrovni sestavování. Analyzuje sémantiku kódu a datové toky uvnitř komponent a automaticky _"memorizuje"_ hodnoty, které nezávisí na změněných vstupech. V praxi to znamená, že pokud se změní data ve vyším komponentu, tak ne všechny _pod-komponenty_ budou muset být znovu sestaveny.

== Databáze

Architektura backendu stojí na robustním řešení pro persistenci a správu dat. Vzhledem ke komplexitě herních mechanik, které vyžadují jak striktní relační vazby , tak flexibilní struktury pro variabilní herní entity, bylo zvoleno spojení osvědčené databáze PostgreSQL a moderní abstraktní vrstvy Drizzle ORM.

=== PostgreSQL

Jako primární databázové úložiště byl vybrán PostgreSQL, pokročilý open-source objektově-relační databázový systém @postgresql-docs. Jeho volba v kontextu vývoje multiplayerové RPG hry vychází z několika klíčových vlastností, které zajišťují stabilitu, integritu a výkon.

Základní kritériem pro databázi je zajištění konzistence dat i při selhání systému nebo více souběžných požadavcích. PostgreSQL plně podporuje ACID model - Atomicity, Consistency, Isolation a Durability. To znamená, že herní operace probíhají jako atomické transakce. Při obchodování mezi hráči, třeba když hráč A dá hráči B předmět výměnou za měnu, databáze zajistí, že odečtení předmětu, přidání předmětu a převod peněz nastanou v jednom kroku. Pokud dojde k selhání kterékoliv části, transakce se vrátí a nedojde k situaci, kdy by zmizel předmět, ale peníze by zůstaly nepřevodné.

Ačkoliv je PostgreSQL relační databází, pro moderní aplikace nabízí silnou podporu pro práci s nestrukturovanými daty pomocí datového typu JSONB. Tento formát umožňuje ukládat JSON dokumenty v binární, indexovatelné podobě přímo do sloupce tabulky. Pro RPG hru je tato vlastnost kritická. Zatímco základní entity mají pevnou strukturu, rozšiřující entity mají mnoho proměných, které mohou, ale nemusí být přístupny pro všechny entity ve stejné tabulce. Místo vytváření desítek sloupců s hodnotami NULL pro každý možný atribut, využívá databáze sloupec metadata typu JSONB. PostgreSQL umožňuje nad klíči uvnitř tohoto JSON objektu vytvářet zobecněnýy převrácený index nazývaný: GIN index, což umožňuje extrémně rychlé vyhledávání s výkonem srovnatelným s NoSQL databázemi.

K tomu využívá také technologii MVCC (Multi-Version Concurrency Control). S její pomocí můžou probíhat čtecí operace i operace zápisu paralelně bez toho, aby se sečetly, a takové operace nezamezují, ani nerozptylují veškerý tok operačního systému. To je nezbytné pro udržení nízké latence, při vícero real-rime připojení.

=== Drizzle ORM

Pro efektivní komunikaci aplikačního kódu v jazyce typescript s databází PostgreSQL byla zvolena knihovna Drizzle ORM @drizzle-docs. Jedná se o moderní nástroj, který redefinuje přístup k ORM s důrazem na typovou bezpečnost, minimální režii a maximální kontrolu nad generovaným SQL kódem.

Drizzle se odlišuje od tradičních ORM frameworků svou lehkostí. Funguje jako tenká vrstva nad SQL driverem. Jedná se dudíž o nižší úroveň abstrakce, která umožňuje psát 1: 1 sql dotazy.  Hlavní výhodou je zero Runtime Overhead. Na rozdíl od konkurenčních řešení, jako je Prisma ORM, která často spouští na pozadí vlastního binárního souboru pro zpracování dotazů, je Drizzle čistá TypeScript knihovna. Při běhu aplikace pouze sestaví optimalizovaný SQL řetězec a předá jej databázi. To minimalizuje dobu náběhu aplikace, což je klíčové v prostředí serverless funkcí. Dále využití Drizzle ORM preferuje code-First Schema. Tím je umožněna definice databázových tabulek probající přímo v kódu aplikace. Vývojář definuje schéma pomocí TypeScript objektů, které slouží jako _"jediný zdroj pravdy"_. Z této definice se následně generují jak SQL migrace pro databázi, tak relace tabulek a typy pro aplikaci.

Předností Drizzle ORM je hluboká integrace s TypeScriptem. Knihovna využívá pokročilou inferenci typů. Tento mechanismus funguje end-to-end:

+ Při psaní dotazu
  - Editor kódu napovídá názvy sloupců a jejich typy.
  - Pokud se vývojář pokusí porovnat text s číslem, kompilátor vyhlásí chybu ještě před spuštěním aplikace.

+ Při návratu dat
  - Výsledek databázového dotazu je automaticky typován.
  - Není potřeba manuálně definovat rozhraní pro výsledky dotazů, Drizzle je odvodí dynamicky na základě toho, jaké sloupce a relace byly v dotazu vyžádány.

Pro práci s propojenými daty nabízí Drizzle zjednodušené Relational Query API. To umožňuje vývojářům načítat hierarchická data deklarativně, podobně jako v GraphQL nebo Prisma ORM. Drizzle interně optimalizuje tyto požadavky, aby předešel problému N+1, situaci, kdy aplikace pro každou položku seznamu posílá do databáze samostatný dotaz. Podle struktury dat a použitého databázového ovladače Drizzle buď zkompiluje požadavek do jednoho efektivního SQL dotazu, nebo data načte paralelně v minimálním počtu kroků a spojí je na úrovni aplikace. Tím zajišťuje optimální výkon i při složitých datových strukturách. Součástí ekosystému je nástroj Drizzle Kit, který automatizuje správu změn v databázi. Porovnává aktuální schéma definované v TypeScriptu se snapshotem předchozího stavu a generuje SQL migrační soubory. Tento proces zajišťuje, že vývoj databáze je verzovaný, transparentní a bezpečně replikovatelný napříč vývojovým, testovacím a produkčním prostředím.

== Tailwind CSS

Pro definici vizuální podoby uživatelského rozhraní a tvorbu responzivního designu byla zvolena knihovna Tailwind CSS. Na rozdíl od tradičních CSS knihoven, které nabízejí předpřipravené komponenty @tailwind-docs.

=== Utility-First paradigma

Základem Tailwind CSS je koncept Utility-First. Namísto vytváření sémantických tříd, které v sobě nesou desítky deklarací, framework poskytuje atomické třídy reprezentující jednotlivé CSS vlastnosti. V kontextu aplikace tento přístup přináší několik klíčových výhod. Prnví je eliminace kontextového přepínání:
- Stylizace probíhá přímo v kódu komponenty.
- Vývojář definuje vzhled elementů, pomocí řetězení tříd pro okraje, barvy a typografii, což výrazně zrychluje iterační cyklus vývoje.

Dále Tailwind CSS definuje pevný systém hodnot pro mezery, stíny a barevné palety. Tím je zajištěno, že rozhraní působí celistvým dojmem a všechny prvky dodržují stejný vizuální řád bez manuálního hlídání konkrétních pixelových hodnot. Optimalizace knihovny využívá proces zvaný _"Purging"_. Během sestavování aplikace analyzuje zdrojový kód a do výsledného CSS souboru zahrne pouze ty třídy, které jsou v aplikaci skutečně použity. To vede k extrémně malým souborům stylů, což zrychluje načítání herního rozhraní.

=== Responzivita a interaktivní stavy

Každá webová aplikace vyžaduje rozhrání, které se dokáže přizpůsobit různým velikostem obrazovek a poskytovat okamžitou vizuální odezvu. Tailwind tento problém řeší pomocí modifikátorů.

Kromě přizpůsobení obrazovce je pro intuitivní ovládání klíčové definovat stavy elementů. Tailwind nabízí jednoduchý způsob, jak popsat vzhled prvků během interakce s uživatelem. Pomocí modifikátorů lze bleskově nastavit vizuální změny.

Pokročilou vrstvu představují datové modifikátory, které umožňují vytvářet vlastní prefixy na základě konkrétního datového obsahu dané komponenty. To otevírá cestu k čistě CSS návrhům vizualizace HTML elementů, kde se vzhled dynamicky mění podle stavu aplikace (například atributů data-\*), čímž se minimalizuje nutnost psát dodatečný JavaScript pro jednoduché stylování.

=== Designový systém

Aplikace využívá centrální konfigurační soubor, který umožňuje rozšíření základníh knihovny o specifické prvky. Tento soubor je od verze Tailwind CSS v4 psán v podobě souoru css, ve kterém se pre-definují kaskádové styly. Do konfiguračního souboru jsou zaneseny vlastní barevné palety, specifické fonty a definice animací.Díky integraci s TypeScriptem jsou tyto vlastní třídy plně typované. Pokud vývojář definuje v konfiguraci novou barvu, editor mu ji automaticky nabídne, čímž se minimalizuje riziko vzniku chyb v designu.

== Zustand

Pro zacházení s globálním stavem aplikací je použita knihovna Zustand. Jde o moderní a jednoduché řešení pro správu stavů v Reactu, které se vyznačuje tím, že je minimalistické, má nízké režie @zustand-docs.

Zustand funguje na principu centrálního úložiště, označovaného jako Store. Na rozdíl od komplexních knihoven, jako je Redux, Zustand nevyžaduje obalování aplikace do mnoha _"kontextových poskytovatelů"_, což eliminuje problém zvaný _"Provider Hell"_ a zjednodušuje celkovou strukturu projektu.

Stav v úložišti je imutabilní a lze jej měnit pouze pomocí definovaných akcí. To zajišťuje, že změny v stavu jsou predikovatelné a snadno sledovatelné.

Úložiště se v komponentách používá formou vlastních React hooků. To umožňuje vývojářům přistupovat k datům i k funkcím pro jejich aktualizaci pomocí intuitivního a čistého zápisu.

Jednou z nejvýznamnějších vlastností knihovny Zustand, která je pro vývoj náročné webové aplikace klíčová, je nativní podpora selektorů. Selektory umožňují komponentám odebírat pouze ty části stavu, které jsou pro jejich funkci nezbytné.

Zustand vyniká svou schopností snadno integrovat asynchronní logiku přímo do akcí úložiště. Toho je v projektu využito především pro synchronizaci s API a real-time aktualizace. Díky podpoře middleware funkcí umožňuje Zustand snadnou implementaci perzistence. Vybrané části stavu, jsou automaticky ukládány do lokálního úložiště prohlížeče.

== WebGL a 3D renderování ve webové aplikaci

Pro vytvoření interaktivního 3D prostředí herního světa je potřeba využit vícevrstvý technologický stack. Na nejnižší úrovni stojí WebGL jako standardizované grafické API pro přístup ke grafické kartě (dále již pouze jako GPU) z prostředí webového prohlížeče. Nad ním je použita knihovna `Three.js`, která abstrahuje nízkoúrovňové operace do objektového modelu scény. Další vrstvu tvoří React Three Fiber, jenž převádí deklarativní paradigma Reactu do správy 3D scény. Sadu specializovaných pomocných komponent poskytuje knihovna `drei` a plynulé fyzikálně založené animace jsou realizovány pomocí `react-spring` v integraci `@react-spring/three`.

=== WebGL

Web Graphics Library (dále již pouze jako WebGL) je JavaScriptové rozhraní vycházející z OpenGL ES#footnote[OpenGL for Embedded Systems je odlehčená specifikace grafického API OpenGL určená pro vestavěná zařízení a mobilní platformy.], které umožňuje provádět grafické operace přímo na grafickém procesoru. Vykreslovací pipeline je programovatelná a skládá se zejména z vertex shaderu a fragment shaderu#footnote[Shader je program spouštěný na GPU. Vertex shader transformuje vrcholy modelu do projekčního prostoru, zatímco fragment shader určuje výslednou barvu fragmentu#footnote[Fragmentem bývá označen sametný pixel nebo vektorová část geometrie meshe.] po rasterizaci.]. Vertex shader zpracovává vrcholy geometrie, aplikuje transformační matice model-view-projection a připravuje data pro rasterizaci. Fragment shader následně určuje výslednou barvu jednotlivých pixelů s ohledem na materiál, textury, osvětlení a případné postprocesní efekty @khronos-webgl @w3c-webgl @khronos-opengles32 @realtime-rendering @pbr-book.

Data jsou do grafické výpočetní jednotky přenášena prostřednictvím bufferů a atributů, zatímco globální parametry scény jako jsou světelné podmínky, transformační matice nebo čas jsou předávány přes uniform proměnné. WebGL dále používá depth buffer pro korektní překryv objektů v prostoru, stencil buffer pro maskování a blending pro práci s průhledností. Výkonové limity jsou úzce svázány s počtem draw-call, velikostí geometrií, komplexitou shaderů a šířkou paměťové propustnosti mezi CPU a GPU.

=== Three.js

Three.js představuje vysokou abstrakční vrstvu nad WebGL @threejs-docs. Místo manuální správy shader programů, bufferů a stavu renderovacího kontextu nabízí scénový graf s entitami jako `Scene`, `Camera`, `Mesh`, `Geometry`, `Material` a `Light`. Vývojář tak pracuje s doménově srozumitelnými objekty a transformačním stromem, zatímco knihovna interně řeší serializaci dat do GPU, optimalizaci renderovacího průchodu a správu WebGL stavu.

Klíčovou součástí je renderovací smyčka, kde renderer v každém snímku vyhodnocuje scénu vzhledem ke kameře a generuje výsledný obraz. Three.js zároveň poskytuje nástroje pro raycasting, načítání externích assetů, práci s PBR materiály#footnote[Physically Based Rendering je model materiálů založený na fyzikálních vlastnostech povrchu.] a správu stínování. V praxi to umožňuje vytvářet komplexní 3D rozhraní bez nutnosti psát nízkoúrovňový grafický kód od začátku.

=== React Three Fiber

React Three Fiber (dále již pouze jako R3F) je vlastní renderer pro React, který mapuje JSX prvky na objekty Three.js @r3f-docs. Nejedná se o nadstavbu typu „wrapper komponent“, ale o plnohodnotný React reconciler#footnote[Reconciler je interní mechanismus Reactu, který porovnává předchozí a nový stav stromu komponent a provádí pouze minimální sadu změn potřebných pro aktualizaci výstupu.]. To znamená, že životní cyklus 3D objektů je řízen stejným principem diffingu a reconciliace jako běžné DOM komponenty: při změně stavu React vypočítá minimální nutné změny a aplikuje je do scénového grafu Three.js.

Architektonicky je zásadní komponenta `Canvas`, která inicializuje renderer, scénu, kameru a interní loop. Hook `useFrame` umožňuje registrovat per-frame logiku#footnote[Per-frame logika je kód spouštěný při každém vykresleném snímku.] s přesným časovým krokem, například pro aktualizaci pozic, simulaci projektilů nebo interpolaci síťových snapshotů. R3F také podporuje řízení renderování v režimu `always` i `demand`, což umožňuje cíleně snižovat výpočetní zátěž v okamžicích, kdy se scéna nemění.

Významnou výhodou je přímá integrace s React ekosystémem. Stav aplikace lze sdílet přes stejné mechanismy jako ve 2D UI (například Zustand), a 3D komponenty tak mohou reagovat na stejné doménové události jako zbytek aplikace. Tento jednotný datový model redukuje architektonickou složitost a usnadňuje údržbu rozsáhlého projektu.

=== \@react-three/drei

Knihovna `drei` poskytuje množinu předpřipravených utilit a komponent nad R3F, které řeší opakující se technické úlohy @drei-docs. Patří sem například orbitální ovládání kamery (`OrbitControls`), načítání modelů a textur (`useGLTF`, `useTexture`), environment mapy, helpery světel, předkonfigurované geometrie a komponenty pro text nebo postprocessing.

Hlavní přínos `drei` spočívá v redukci boilerplate kódu a ve standardizaci osvědčených implementačních vzorů. Tím se zkracuje čas vývoje, snižuje riziko chyb při konfiguraci scény a zlepšuje čitelnost komponentové vrstvy. V kontextu maturitní práce je důležité, že `drei` neomezuje přístup k nízkoúrovňovým mechanismům Three.js; pouze poskytuje ergonomičtější vstupní bod pro běžné scénáře.

=== React Spring pro 3D animace

Knihovna `react-spring` v kombinaci s modulem `@react-spring/three` realizuje animace na bázi pružinového modelu, nikoliv na pevných časových křivkách @reactspring-docs. Pohyb je popsán parametry fyzikální soustavy, kterými jsou: tuhost, tlumení, hmotnost, atd. Využití `react-spring` vede k přirozenému průběhu změn a stabilnímu chování i při přerušení nebo změně cílového stavu během animace.

V prostředí R3F se animované hodnoty přímo mapují na transformace a materiálové vlastnosti objektů. Přesněji se jedná o hodnoty jako pozice, rotace, viditelnost a attributy upravující geometrii. Tento přístup je zásadní pro interaktivní herní UI, kde se stav může měnit asynchronně v závislosti na síťové komunikaci. Oproti klasickým keyframe animacím umožňuje pružinový model kontinuální a vizuálně hladké přechody mezi diskrétními stavy herní logiky.

=== Spolupráce vrstev v praxi

Při běhu aplikace probíhá zpracování ve více navazujících vrstvách. React vrstva vyhodnotí změnu stavu (například pohyb postavy, změnu iniciativy nebo aktivaci efektu). React Three Fiber tuto změnu promítne do odpovídajících uzlů scénového grafu Three.js. Three.js následně připraví renderovací data pro WebGL a předá je grafickému procesoru. Pokud je změna animovaná, `react-spring` generuje mezikroky, které jsou v každém snímku aplikovány přes R3F do scény.

Tento model poskytuje jasné oddělení odpovědností: WebGL řeší nízkoúrovňové vykreslení, Three.js správu 3D domény, R3F integraci s React architekturou, `drei` produktivitu vývoje a `react-spring` fyzikálně konzistentní přechody stavů. Výsledkem je škálovatelné řešení, které je vhodné pro multiplayerovou RPG aplikaci s důrazem na plynulost, čitelnost kódu a dlouhodobou udržitelnost.

= Praktická část

Praktická část této práce popisuje skutečné fungování implementace v projektu Mystique, nikoliv pouze seznam technologií. Zaměřuje se na to, co se v systému děje při renderování 3D scény, interakci uživatele,  otevírání dialogů a komunikaci mezi clientem a serverem.

== Kompozice scény a odpovědnosti jednotlivých vrstev

Herní stránka je složena jako kompozice několika navzájem oddělených vrstev. Vrstva `GameProvider` zajišťuje napojení na multiplayer instanci a životní cyklus připojení. Vrstva `Main` vytváří `Canvas` pro podporu a vykreslení R3F komponentů. V tomto kontextu jsou umístěny:
- entity čítající charaktery, monstra a specifické interaktivní objekty
- podlaha a interaktivní vrstvy pro zvýraznění dosažitelných polí a detekci kliknutí
- světla a kamera pro zajištění správného osvětlení a pohledu na scénu

Z pohledu systémové správy je implementován hybridní provozní model, který odděluje vykreslovací odpovědnosti od řízení aplikačního stavu a současně zachovává jednotné doménové kontrakty.

Technicky je tok operací realizován jako deterministický příkaz. Uživatelský vstup ve 3D scéně je serializován do doménové akce, akce je validována proti aktuálnímu snapshotu, následně je odeslána na backend přes socket kanál a po serverovém ověření a potvrzení je promítnuta do centrálního uložiště na klientské straně. Tím je zajištěno, že změna vzniklá interakcí  3D entitou se konzistentně projeví v obou prezentačních vrstvách i ve sdíleném synchronizovaném stavu celého lobby.

Renderovací subsystém je navržen modulárně, tudíž každý typ objektu má samostatnou komponentu, vlastní datový vstup a optimalizační strategii. Tím je dosaženo vysoké čitelnosti vykreslovacího řetězece i predikovatelného výkonového chování.

=== Podlaha a interakční vrstvy

Komponenta `Floor` představuje translační vrstvu mezi diskrétním herním modelem (dlaždicová mřížka) a spojitým 3D prostorem. Jejím úkolem není pouze vykreslení povrchu, ale zejména projekce herních pravidel do vizuálních interakčních markerů. Teoreticky jde o dvoufázové zpracování. Prvním je výpočet doménových kandidátů (viable tiles, impact tiles, area of effect) na základě aktuálního stavu hry a pravidel pro danou akci. Druhým je samotná vizualizace těchto kandidátů, která je podmíněna lokální viditelností a render distance. Tím se zajišťuje, že hráč vidí pouze relevantní informace, které odpovídají jeho aktuálnímu pohledu na herní svět. Tato separace výpočtu a vykreslení je zásadní pro determinismus: stejná pravidla mohou být použita jak pro UI feedback, tak pro serverovou validaci akce.

=== Entity

Vrstva `Entities` realizuje render herních aktérů i statických interaktivních objektů pomocí jednotného kontraktu entity. Rendering je založen na principu „model-first. Avšak pro zkrácení načítací doby byl přidán fallback s parametrickou geometrii, která slouží jako záložní varianta, když se něco pokazí. Součástí je i časově spojitá interpolace pozice pomocí spring-based smoothing (dále již pouze jako SbM), která filtruje síťovou diskretizaci a redukuje vizuální sekání při příjmu a vykreslování nových dat. Dále je aplikována selektivní viditelnost odvozená od vzdálenosti vykreslování od pozice kamery, čímž se omezuje počet objektů zařazených do render pass v každém snímku.

=== Stěny jako instancované objekty

Stěny jsou implementovány jako instance jediné geometrie a společného materiálu s per-instancí transformační maticí. Z teoretického hlediska jde o klasickou GPU strategii, která minimalizuje vytížení na CPU straně a snižuje počet draw-call#footnote[Jednotlivé příkazy pro grafickou jednotku nutící vykreslení specifické instance] za obnovení. V praxi to znamená, že všechny stěny jsou reprezentovány jako jedna geometrie, která je duplikována a transformována pomocí shaderu. Tento přístup umožňuje efektivní vykreslení velkého množství stěn bez nutnosti vytvářet samostatné objekty pro každou z nich, což výrazně zlepšuje výkon a škálovatelnost scény. Problém tvoří maximální velikost bufferu pro instancované objekty, která je omezena na specifický počet sub-instancí. V daném případě je využit manager pro rozdělení stěn do skupin, které nepřekračují tento limit. Ačkoliv tento přístup přidává určitou komplexitu do správy stěn, výsledkem je výrazné zlepšení výkonu při zachování vizuální kvality.

=== Postprocessing

Postprocessing je v rámci grafického řetězce realizován jako separátní kompoziční fáze, která operuje nad již kompletně vykresleným framebufferem. Tento procesní postup znamená, že vizuální efekty nejsou aplikovány izolovaně na jednotlivé herní entity, ale zpracovávají až finální obrazový výstup scény, což plně odpovídá standardům moderních vykreslovacích pipeline. Zvolená metodika umožňuje efektivní nasazení screen-space efektů, mezi které patří bloom pro simulaci rozptylu světla, techniky pixelizace pro specifickou estetiku nebo procedurální vykreslování hran při pohybu. V kontextu celého projektu tato vrstva zajišťuje konzistentní stylizaci vizuálního výstupu, aniž by docházelo k zásahům do vnitřních mechanik, výpočetních pravidel nebo interakčního modelu simulace.

== Metriky vzdálenosti v distribuovaném systému

Klíčovým prvkem pro řízení prostorové logiky a optimalizaci vykreslování je centrální utilitární funkce `Render.distance()`. Tato funkce v závislosti na kontextu volání počítá vzdálenost mezi dvěma body pomocí tří rozdílných matematických metrik, z nichž každá hraje specifickou roli v interpretaci herního prostoru.


První z nich, Eukleidovská vzdálenost, představuje geometricky nejkratší přímou spojnici dvou bodů ve vektorovém prostoru, definovanou vztahem $d(x, y) = sqrt(sum_(i=1)^n (x_i - y_i)^2)$. V systému je využívána primárně pro definici parametrů viditelnosti, neboli render distance, kde její lineární charakter poskytuje uživateli nejpřirozenější vizuální vjem hloubky.

Naproti tomu Manhattanská vzdálenost definuje prostor jako součet absolutních rozdílů souřadnic podél os mřížky, tedy $d_1(x, y) = sum_(i=1)^n |x_i - y_i|$. Tato metrika je nezbytná pro výpočet interakčního dosahu a zobrazení dosažitelných polí, neboť její ortogonální povaha přesně koresponduje s pravidly pohybu po čtvercové či krychlové mřížce herního plánu.

Poslední aplikovanou metodou je Čebyševova vzdálenost, která je určena jako maximum z rozdílů v jednotlivých dimenzích, formálně $L_infinity = max_i (|x_i - y_i|)$. Své uplatnění nachází především v algoritmech pro render culling a definici čtvercových výřezových oblastí, kde umožňuje bleskově rozhodnout o relevanci objektu vzhledem k pozici kamery. Tato trojúrovňová diferenciace metrik dovoluje systému precizně oddělit vizuální věrnost od přísné herní logiky a efektivně tak alokovat výpočetní prostředky.
== Kamera

Kamera je implementována jako samostatný subsystém tvořený zustand úložištěm `useCamera`, který uchovává hodnoty a logiku kamery mimo renderované komponenty, a aktualizační smyčkou `useFrame` použitou ke tvorbě pohybu a ovládacích prvků. Uživatelský vstup realizovaný klávesami není mapován přímo na kartézskou pozici kamery, ale na parametry orbitálního modelu. Konkrétně se jedná o trojrozměrný vektorový bod `target`, kolem něhož se kamera orientuje, dále o parametry `azimuth`#footnote[úhel reprezentující rotaci kolem vertikální osy], `elevation`#footnote[elevation je veličina určující vertikální náklon pohledu] a  `distance`#footnote[distance vyjadřuje vzdálenost kamery od cílového bodu], který fakticky odpovídá rotaci, náklonu a vzálenosi kamery v tomto pořadí.

V každém vykresleném snímku jsou tyto parametry přepočítány ze sférických souřadnic na kartézskou polohu kamery. Výsledná pozice je následně použita na zajištění konzistentní orientace směrem k cíli. Tento model je stabilnější než přímá translace kamery v prostoru, protože jednoznačně odděluje informaci o tom, kam se kamera dívá, od informace o tom, odkud se dívá. Orientace je tedy vždy determinována vztahem k cílovému bodu, zatímco pozice je definována radiální vzdáleností a úhlovými parametry.

Použití časování `delta` navíc zajišťuje nezávislost pohybu na snímkové frekvenci, což znamená, že rychlost změny parametrů zůstává konzistentní napříč zařízeními s odlišným snímky za vteřinu. Díky tomu nenastávají problémy s optimalizací tvořené mezisnímky a nedokanýlími načteními požadavků ze strany serveru.


== Kontextové menu a dialogy

Dialogový systém je centralizován ve stavovém úložišti `useDialog`, které vytvořeno pomocí knihovny zustand a představuje aplikační vrstvu řízení modálních oken a kontextových panelů. Každý dialog má explicitně definovaný stav otevření či zavření a současně nese vlastní kontext. Otevření dialogu tedy není lokální UI stav konkrétní komponenty, ale doménová událost odvozená z herního modelu.

Vyvolání kontextového menu nad entitou probíhá jako řízený proces. Po kliknutí pravým tlačítkem v rámci 3D scény komponenta reprezentující danou entitu předá identifikátor entity a souřadnice kurzoru do metody openAt v rámci větve useDialog.entityContextMenu. Samotná komponenta EntityContextMenu následně na základě aktuální instance hry a oprávnění hráče dynamicky odvodí množinu povolených akcí. Každá položka menu je podrobena doménové validaci zahrnující kontrolu vzdálenosti, vlastnictví, tahu nebo role typu Master. Teprve po úspěšném vyhodnocení těchto pravidel je možné vyvolat odpovídající aplikační reakci, například otevření inventáře nebo specializovaného dialogu typu odpočinek, obchod či interakce s objektem.

Zásadní je, že vyvolání dialogu není přímým důsledkem samotné UI události, ale sekundárním efektem validovaného herního stavu. Uživatelské rozhraní tak funguje jako projekce oprávnění a pravidel definovaných v doménové vrstvě, čímž se eliminuje možnost otevření nepovolených akcí čistě na základě klientské manipulace.

== Backend komunikace a synchronizace stavu

Síťová komunikace je realizována prostřednictvím knihovny Socket.IO běžící na stejném Node.js serveru jako aplikace postavená na frameworku Next.js. Klient po inicializaci uživatelského kontextu nejprve zavolá endpoint `/api/socket`, čímž zajistí existenci socket serveru, a následně naváže perzistentní spojení.

Po úspěšném připojení klient registruje listenery pro lobby i herní doménu. Vstup do konkrétní herní instance probíhá odesláním události `game:join`, na jejímž základě server přidá klienta do místnosti ve tvaru `game:{id}` a odešle kompletní `game:state`. Tento snapshot je uložen do centrálního úložiště `useGame.instance`, které představuje jediný zdroj pravdy na straně klienta. Z tohoto stavu je následně odvozena jak 3D reprezentace scény, tak veškeré uživatelské rozhraní.

Komunikace je plně událostně orientovaná. Klient odesílá pouze záměry, například požadavek na pohyb postavy, použití schopnosti nebo zahájení obchodní interakce. Server každý záměr nejprve validuje z hlediska oprávnění, pravidel tahu, kolizí a dalších doménových omezení. Při úspěšné validaci je změna aplikována transakčně v databázi a následně je všem klientům v dané místnosti distribuován aktualizovaný `game:state`. Architektura je autoritativní: klient funguje výhradně jako producent vstupů a renderer, zatímco server je jediným kanonickým zdrojem pravdy.

== Anonymizovaný popis komplexního validačního algoritmu

Následující schéma popisuje zobecněný serverový mechanismus validace a aplikace herní akce v autoritativním modelu. Implementace tohoto algoritmu zajišťuje, že všechny akce jsou podrobeny důkladné kontrole před tím, než dojde k jakékoli změně stavu, čímž se minimalizuje riziko nekonzistence nebo zneužití ze strany klienta.

#block(breakable: false)[ ```text
ALGORITHM ValidateAndApplyIntent(principal, intent, snapshot)
  // 1. Existenční a konzistenční kontrola snapshotu
  REQUIRE snapshot exists
  REQUIRE snapshot.version is current or mergeable
  REQUIRE principal is registered member of session

  // 2. Autentizace a autorizace
  REQUIRE principal identity is verified
  REQUIRE principal role permits intent.type
  REQUIRE intent is allowed in current phase of turn-cycle

  // 3. Strukturní validace vstupu a pravidel
  REQUIRE intent payload matches schema(intent.type)
  REQUIRE referenced entities exist in snapshot
  REQUIRE no forbidden cross-session references
  REQUIRE action_points(principal) >= cost(intent)
  REQUIRE cooldowns and temporal constraints satisfied
  REQUIRE spatial constraints satisfied
  REQUIRE no rule-violating conflicts detected

  // 4. Deterministický výpočet výsledků
  candidates := derive_allowed_outcomes(
    snapshot, principal, intent
  )

  // 5. Aplikace změn pomoci tranzakce
  BEGIN TRANSACTION
    lock affected aggregates
    apply state mutation(intent)
    decrement resource counters(principal)
    resolve cascading effects()
    update derived projections()
    increment state version
  COMMIT

  // 6. Post-commit synchronisation
  fresh_snapshot := reload_consistent_state()
  publish_to_session(fresh_snapshot)
END
``` ]

Tento princip je použit napříč všechny typy akcí prováděných v při komunikaci klienta se serverem. Klíčové je, že všechny vrstvy systému jsou navrženy tak, aby respektovaly tento autoritativní model, což zajišťuje konzistentní a bezpečný herní zážitek pro všechny hráče, ve kterém je server jediným zdrojem pravdy. Hráči tak nemají možnost obejít pravidla hry nebo manipulovat s herním stavem prostřednictvím manuálního volání serveru, protože všechny záměry jsou podrobeny validaci na serveru.

== Inicializace WebSocket serveru

Klíčovým architektonickým řešením je způsob, jakým je Socket.IO server inicializován v rámci stejného procesu jako Next.js aplikace. Endpoint `/api/socket` v Pages Routeru funguje jako vstupní bod, který v případě prvního volání vytvoří instanci `Server` z knihovny Socket.IO a napojí ji na nativní Node.js HTTP server přístupný prostřednictvím objektu `res.socket.server` @socketio-docs. Při každém dalším požadavku na tento endpoint server detekuje existující instanci a okamžitě odpovídá, čímž se zabrání duplicitnímu vytváření WebSocket serveru.

Po navázání spojení s klientem server registruje moduly, které jsou organizovány podle doménových oblastí: `lobby` pro správu herních místností, `game-entities` pro správu herních entit, `game-actions` pro herní akce jako pohyb a používání schopností, `inventory` pro správu inventáře, `trading` pro obchodování mezi hráči, `campfire` pro interakce s objekty typu ohniště a `leveling` pro systém postupu na vyšší úrovně. Každý modul přijímá kontextový objekt `SocketContext` obsahující referenci na socket připojeného klienta, globální instanci serveru a sdílenou mapu herních instancí uloženou v operační paměti. Tato mapa slouží jako cache vrstva, která minimalizuje počet dotazů do databáze při opakovaných operacích v rámci jedné herní relace.

Při odpojení klienta server automaticky uklídí prostředky: odebere klienta z příslušných místností a pokud je místnost prázdná, odstraní odpovídající herní instanci z paměťové cache. Tímto mechanismem je zajištěna efektivní správa serverových prostředků bez nutnosti externího procesu pro úklid neaktivních relací.

== Databázové schéma a relační model

Databázové schéma je definováno deklarativně pomocí Drizzle ORM v jazyce TypeScript a představuje centrální doménový model celé aplikace @drizzle-docs. Schéma je rozčleněno do několika logických bloků, které odpovídají klíčovým oblastem systému. Celkový přehled entit a jejich vazeb je znázorněn na diagramu.

#include "assets/database-diagram.typ";

=== Autentizace a uživatelé

Autentizační vrstva je založena na knihovně Better Auth, která poskytuje kompletní řešení pro správu uživatelských účtů, relací a ověřování identity @better-auth-docs. Schéma zahrnuje tabulky `user`, `session`, `account` a `verification`. Tabulka `user` uchovává základní údaje o uživateli včetně jména, emailu a avataru. Tabulka `session` spravuje aktivní relace s podporou expirace a automatické obnovy. Tabulka `account` umožňuje napojení na externí poskytovatele identity, jako jsou GitHub a Google, prostřednictvím protokolu OAuth 2.0#footnote[OAuth 2.0 je autorizační framework umožňující aplikacím třetích stran získat omezený přístup k uživatelským zdrojům bez sdílení přihlašovacích údajů.]. Konfigurace Better Auth zajišťuje šifrování OAuth tokenů, cachování relací v cookies s pětiminutovou platností a sedmidenní session s denní obnovitelností.

=== Herní entity

Herní entity jsou modelovány prostřednictvím polymorfní struktury, kde tabulka `lobby_entity` slouží jako jednotný bod pro všechny typy entit v rámci herní instance. Každý záznam v této tabulce obsahuje referenci na `lobby`, typ entity (postava, monstrum, truhla nebo ohniště), pozici na herní mřížce ve formátu JSONB a volitelné cizí klíče na příslušné detailní tabulky. Tato architektura umožňuje udržovat heterogenní kolekci entit v jedné tabulce s jednotným mechanismem dotazování, a zároveň zachovává relační integritu prostřednictvím cizích klíčů s kaskádovým mazáním.

Tabulka `character` modeluje hráčské postavy s atributy rozdělenými do čtyř kategorií: síla, obratnost, odolnost a inteligence. Statistiky postavy, jako jsou maximální životy, počet akcí za tah, vytrvalost a nosnost, jsou odvozeny z těchto atributů algoritmicky a ukládány do databáze jako denormalizované hodnoty. Důvodem denormalizace je eliminace opakovaného přepočtu v serverových handlerech, kde je rychlost odezvy kritická. Tabulka `monster` modeluje nepřátelské entity s vlastními schopnostmi uloženými ve formátu JSONB pole.

=== Inventář a obchodování

Inventářní systém je implementován prostřednictvím vazební tabulky `inventory` s kompozitním primárním klíčem tvořeným párem `character_id` a `item_id`. Tato struktura zajišťuje, že každá postava může vlastnit jeden záznam pro každý typ předmětu, přičemž množství je evidováno jako celé číslo. Sloupec `equipped` typu boolean určuje, zda je předmět aktivně nasazen. Tabulka `item` definuje katalog předmětů s atributy jako typ, váha, hodnota, brnění a pole schopností. Schopnosti jsou uloženy ve formátu JSON pole, což umožňuje flexibilní definici různých typů útočných a podpůrných efektů bez nutnosti dalších relačních tabulek.

Pro truhly existuje analogická vazební tabulka `chest_inventory` se stejnou strukturou, avšak bez atributu vybavení. Obchodování u ohniště je modelováno tabulkou `campfire_shop_item`, která definuje nabídku předmětů a jejich ceny v herní měně pro konkrétní ohniště.

== Systém tahů a sekvencování

Herní systém střídání tahů je implementován jako deterministický stavový automat, jehož stav je uložen v JSONB sloupci `data` tabulky `lobby`. Tento sloupec obsahuje tři klíčové položky: pole `sequence` definující pořadí entit v kole, index `turn` ukazující na aktuálně aktivní entitu a pole `walls` uchovávající pozice stěn na herní mapě.

Přechod na další tah je serverová operace, při které se inkrementuje index `turn`. Pokud index dosáhne konce sekvence, je nastaven na hodnotu $-1$, což indikuje fázi přípravy, ve které má Dungeon Master výlučnou kontrolu nad správou entit, úpravou sekvence a umisťováním objektů. Při aktivaci nového tahu server automaticky obnoví počet akcí příslušné entity na její maximum, čímž se zajistí konzistentní výchozí stav pro každý tah.

Pořadí v sekvenci je editovatelné Dungeon Masterem v přípravné fázi. Operace přesunu entity v sekvenci je realizována jako atomická záměna dvou prvků v poli, přičemž je ověřeno, že indexy prvků jsou v platném rozsahu. Tato operace je dostupná výhradně v přípravné fázi a výhradně pro Dungeon Mastera, což reflektuje tradiční model řízení stolní hry na hrdiny.

== Pohyb entit na herní mřížce

Pohybový systém je založen na dlaždicové mřížce, kde je prostor diskretizován na celočíselné souřadnice a pohyb je omezen Manhattanovou vzdáleností. Při požadavku na pohyb server nejprve vypočítá množinu dosažitelných polí na základě parametru `stamina` entity. Pro každý potenciální cíl v rozsahu $plus.minus$ stamina od aktuální pozice je ověřena absence kolize se stěnou a obsazenost jiným entitou @aima-book. Pouze pokud požadovaná pozice patří do této množiny, je pohyb proveden.

Pohybová akce spotřebuje jednu akci z disponibilního počtu akcí entity v tomto tahu. Tím je zajištěno, že hráč musí strategicky plánovat, zda své akce využije na pohyb, použití schopností nebo kombinaci obojího. Serverová validace tohoto pravidla zabraňuje situaci, kdy by klient mohl odeslat pohyb s vyčerpaným akčním rozpočtem.

Na klientské straně je pohybová interpolace realizována pomocí knihovny `react-spring`, která zajišťuje plynulý přechod entity mezi dvěma pozicemi na mřížce. Parametry pružinového modelu (tuhost 120, tlumení 14) jsou nastaveny tak, aby výsledný pohyb působil fyzikálně věrohodně, přičemž entity dosáhnou cílové pozice bez oscilace @reactspring-docs.

== Systém schopností a bojová mechanika

Bojový systém je navržen jako automatizovaná verze klasických stolních pravidel. Každá schopnost je definována strukturou obsahující název, cenu v akcích, dosah, cílení a rozsah účinku. Parametr `targeting` určuje, zda schopnost cílí na jednu pozici, oblast efektu kolem cílového bodu, nebo na nejbližší entity v zadaném poloměru. Tento flexibilní model umožňuje modelovat jak jednoduché útoky na jedno pole, tak plošné kouzla ovlivňující více entit současně.

Při použití schopnosti server provádí víceúrovňovou validaci. Nejprve ověří oprávnění — hráč může použít schopnost pouze entity, kterou vlastní, nebo kterou je oprávněn řídit jako Dungeon Master. Následně zkontroluje, zda je schopnost dostupná v arzenálu entity (u postav je odvozena z vybavených zbraní, u monster je přímo součástí definice). Poté ověří dostatečný počet akcí a vzdálenost cíle od pozice útočníka @dnd-srd.

Výpočet poškození je realizován jako náhodný hod v rozsahu definovaném schopností, od jehož výsledku je odečtena hodnota brnění oběti. Celý proces je zabalen do databázové transakce @postgresql-docs, která zajišťuje atomicitu aktualizace životů všech zasažených entit. Pokud monstrum zemře (životy klesnou na nulu), server navíc vyhodnotí odměnu ve formě zkušenostních bodů distribuovaných mezi všechny hráčské postavy v instanci a případný drop předmětů z inventáře monstra.

== Inventářní operace a přenos předmětů

Inventářní systém rozlišuje tři typy operací: přidělení předmětu ze strany Dungeon Mastera, přenos předmětu mezi entitami a vyhození předmětu. Přidělení je výlučná pravomoc Dungeon Mastera a je realizováno jako upsert operace, která v případě existence záznamu zvýší množství, jinak vytvoří nový záznam. Přenos předmětů mezi entitami podléhá pravidlům blízkosti — cílová a zdrojová entita musí být v Manhattanově vzdálenosti menší nebo rovné jedné.

Systém vybavení (equip/unequip) umožňuje hráčům nasazovat a sundávat předměty typu zbraně, přičemž vybavení zbraně automaticky zpřístupní její schopnosti v bojovém systému. Nosnost postavy je odvozena z atributů síly a odolnosti, přičemž překročení maximální nosnosti penalizuje vytrvalost snížením na polovinu, což efektivně omezuje pohybový rozsah přetížené postavy.

== Obchodování mezi hráči

Obchodní systém je implementován jako dvoustranná relace řízená in-memory stavem na serveru. Každá obchodní relace (`TradeSession`) obsahuje identifikátory obou účastníků, jejich aktuální nabídky a stav potvrzení. Nabídky jsou průběžně validovány proti skutečnému inventáři, čímž se zabraňuje nabízení předmětů, které hráč nevlastní v dostatečném množství @gamasutra-trading.

Obchod je dokončen až v okamžiku, kdy oba účastníci potvrdí svou nabídku. V tomto bodě server provede finální validaci obou nabídek, zamkne příslušné inventářní záznamy v rámci databázové transakce a provede atomickou výměnu předmětů a měny. Pokud jakákoliv podmínka není splněna, transakce je zahozena a obchod je označen jako neplatný. Tento přístup eliminuje řadu exploitů, které jsou běžné v systémech bez transakční integrity, jako je duplicitní využití předmětu nebo manipulace s nabídkou v okamžiku potvrzení.

== Interakce s objektem ohniště

Ohniště (`campfire`) je speciální typ entity, která slouží jako servisní bod pro hráčské postavy. Systém poskytuje tři hlavní interakce: odpočinek, obchod a výměnu předmětů. Interakce s ohništěm jsou podmíněny blízkostí — pouze postava v Manhattanově vzdálenosti $<= 1$ od ohniště může provádět tyto akce.

Odpočinkový mechanismus umožňuje hráčské postavě obnovit životy na maximum za cenu herní měny. Výpočet ceny je odvozen z rozdílu aktuálních a maximálních životů, čímž je zajištěno, že hráči s menším poškozením platí méně. Obchodní systém u ohniště funguje jako jednosměrný obchod, kde hráč nakupuje předměty za fixní ceny definované v tabulce `campfire_shop_item`.

== Systém postupu na vyšší úrovně

Systém postupu na vyšší úrovně (leveling) je navržen jako gradientní zlepšování atributů postavy. Při zisku dostatečného počtu zkušenostních bodů může hráč investovat přesně pět atributových bodů do libovolné kombinace čtyř atributů. Server validuje, že celkový součet přidělených bodů je přesně pět a že žádný atribut nemá záporný přírůstek.

Po přidělení bodů jsou statistiky postavy přepočítány na základě nových atributů a aktuálního inventáře. Životy jsou následně obnoveny na nové maximum, což reflektuje tradici stolních RPG systémů, kde postup na vyšší úroveň přináší plné uzdravení @dnd-srd. Celá operace je provedena jako atomická aktualizace databáze, čímž se zabraňuje nekoherentním stavům při souběžných požadavcích.

== Tvorba postavy

Tvůrce postav je implementován jako celoobrazovkový dialog, který provádí hráče procesem definice herní postavy. Proces začíná výběrem rasy z predefinovaného katalogu (trpaslík, elf, člověk, ork), přičemž každá rasa má odlišné základní hodnoty atributů usnadňující specifické herní styly. Po výběru rasy má hráč k dispozici sedm volných atributových bodů, které může distribuovat mezi čtyři atributy s maximálním přídavkem tří bodů na jeden atribut nad základní hodnotu dané rasy.

Součástí tvorby je také nákupní systém, ve kterém má hráč počáteční rozpočet 100 zlatých mincí. Za tyto prostředky si může pořídit výchozí vybavení z katalogu předmětů. Statistiky postavy jsou přepočítávány v reálném čase při každé změně atributů pomocí centrální funkce `calculateCharacterStats`, čímž hráč okamžitě vidí dopad svých rozhodnutí na parametry jako životy, akce za tah nebo nosnost.

== Správa lobby a herních místností

Systém herních místností (lobbies) je implementován jako víceúrovňová struktura, která zajišťuje jak sociální, tak herní aspekty multiplayerové interakce. Každé lobby je vlastněno uživatelem v roli Dungeon Mastera a může obsahovat více členů. Členství je spravováno prostřednictvím vazební tabulky `lobby_member` s evidencí posledního přístupu a posledního přečtení zpráv, což umožňuje implementaci nepřečtených notifikací.

Komunikační systém v rámci lobby zahrnuje textový chat s ukládáním zpráv do databáze a real-time distribucí přes Socket.IO. Zprávy jsou distribuovány výhradně členům příslušné místnosti prostřednictvím mechanismu Socket.IO rooms, čímž je zajištěna izolace komunikace mezi jednotlivými herními sezeními @socketio-docs.

== Autentizace a middleware

Autentizační vrstva využívá knihovnu Better Auth, která je integrována s Drizzle ORM prostřednictvím adaptéru `drizzleAdapter` @better-auth-docs. Konfigurace zahrnuje podporu emailového přihlášení s heslem i přihlášení přes sociální poskytovatele (GitHub, Google). Middleware na úrovni Next.js zajišťuje ochranu cest: nepřihlášení uživatelé jsou přesměrováni na přihlašovací stránku a naopak, přihlášení uživatelé jsou přesměrováni z autentizační stránky na hlavní panel.

Systém relací je konfigurován s sedmidenní platností a denní obnovou, přičemž je využito cachování v cookies s pětiminutovou platností pro snížení zátěže na databázi při opakovaných požadavcích. Tokeny od externích poskytovatelů jsou šifrovány, čímž je minimalizováno riziko úniku citlivých údajů i při kompromitaci databáze.

== Načítání 3D modelů a správa assetů

Systém načítání 3D modelů je postaven na víceúrovňové architektuře, která zajišťuje flexibilitu a odolnost vůči chybám. Každá entita v databázi může volitelně obsahovat cestu k souboru ve formátu GLB nebo glTF#footnote[GL Transmission Format je otevřený standard pro efektivní přenos a rychlé načítání 3D scén a modelů.], který je uložen v adresáři `/public` a servisován jako statický asset @gltf-spec.

Načítání je realizováno lazy inicializací instance `GLTFLoader` z knihovny Three.js, která je volána výhradně na klientské straně, aby nedocházelo k chybám v serverovém prostředí. Načtené modely jsou ukládány do paměťové cache na úrovni modulu, takže opakovaný přístup ke stejnému modelu nevyvolává nový síťový požadavek.

V případě, že model není k dispozici nebo jeho cesta je neplatná, systém automaticky přepne na parametrickou záložní geometrii — sféru pro postavy a monstra, kvádr pro truhly a kužel pro ohniště. Tento fallback mechanismus zajišťuje, že hra zůstane plně funkční i bez vlastních 3D modelů, což je zásadní jak pro vývoj, tak pro scénáře, kdy server s assety není dostupný.

== Optimalizační strategie na klientské straně

Aplikace implementuje několik vrstev optimalizace, které zajišťují plynulý běh i při vysokém počtu entit a složité scéně.

=== Selektory Zustand

Díky nativní podpoře selektorů v knihovně Zustand @zustand-docs jsou komponenty odebírající stav z centrálního úložiště překreslovány pouze při změně konkrétní části stavu, kterou skutečně využívají. Tento princip je aplikován systematicky napříč celou aplikací, například komponenta tlačítka pro ukončení tahu reaguje výhradně na změnu oprávnění `canEndTurn`, nikoliv na každou změnu herního stavu.

=== React.memo a memoizace komponent

Komponenty, které přijívají stabilní vstupní data, jsou obaleny do `React.memo`, čímž React přeskočí jejich vykreslení, pokud se vstupní vlastnosti referenčně nezměnily. Tato technika je využita zejména u vizuálně náročných komponent jako `Floor`, kde by zbytečné překreslení vedlo k rekalkulaci dlaždic, přepočtu viditelnosti stěn a aktualizaci instancované geometrie @react-docs.

=== Render distance a visibility culling

Každá entita a vizuální prvek podléhá kontrole viditelnosti na základě vzdálenosti od kamery. Funkce `isWithinRenderDistance` vyhodnocuje Čebyševovu vzdálenost od pozice kamery a vrací boolean hodnotu, která rozhoduje o tom, zda je prvek zařazen do vykreslovacího průchodu. Tento mechanismus efektivně redukuje počet objektů ve scéně bez nutnosti implementace pokročilého frustum cullingu na úrovni aplikační vrstvy.

== Shrnutí implementace

Projekt Mystique představuje kompletní implementaci webové multiplayerové RPG platformy, která kombinuje moderní webové technologie do koherentního celku. Architektura je navržena s důrazem na autoritativní serverový model, kde je veškerá herní logika validována na serveru a klient funguje výhradně jako prezentační vrstva. Jednotný jazyk TypeScript napříč celým stackem minimalizuje kognitivní zátěž při přechodu mezi klientskou a serverovou částí a umožňuje sdílení typových definic a doménových kontraktů.

Praktická implementace prokázala životaschopnost zvoleného technologického stacku pro vývoj komplexních multiplayerových aplikací. Hybridní přístup kombinující App Router pro serverové vykreslování a Pages Router pro WebSocket komunikaci je efektivním řešením limitací jednotlivých subsystémů, přestože vyžaduje pečlivé oddělení odpovědností. Modulární architektura socket handlerů, deklarativní databázové schéma a komponentový model React Three Fiber vytvářejí základ, který je dobře připraven pro budoucí rozšíření o nové herní mechaniky, typy entit a interakcí.
