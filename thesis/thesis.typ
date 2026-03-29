= Úvod

Stolních hry na hrdiny, zvláště ty pro více hráčů, tvoří vlastní jedinečnou větev herních systémů, kde se kombinuje společné vyprávění, rozhodování na základě předem definovaných pravidel a spolupráce hráčů v jednom sdíleným světě. Nejznámější zástupci tohoto žánru jsou hry jako Dungeons & Dragons, a v českém prostředí pak specificky i Dračí doupě. Nejvýraznější znak je bezesporu jasná separace rolí. Většina hráčů kontroluje svého hrdinu, zatímco vypravěč, též nazývaný _dungeon master_, či v českém překladu _pán jeskyně_, řídí svět, pravidla vykládá a reaguje na to, co ostatní hráči činí.

S vývojem webových technologií a online komunikace se začíná čím dál častěji mluvit o transformaci těchto her do virtuálního prostředí. Do online zpracování hry lze přidat celou řadu výhod, ať již jde o usnadnění organizace hry, nebo možnost hrát i v přímé nepřítemnosti jednoho nebo více hráčů. Většina dostupných řešení však často trpí nutností stahování a instalací programů, což vytvoří bariéru pro nové uživatele.

#set heading(numbering: "1.1")

= Architektura

Pro aplikaci bylo zvoleno schéma klient-server, které je standardem pro vývoj webových aplikací. Daná architektura umožňuje čisté oddělení klientského kódu od serverového, což umožní bezpečnost serveru a jeden zdroj pravdy.

Klientská část aplikace běží přímo v webovém prohlížeči a představuje rozhraní mezi uživatelem a aplikací. Hlavní úlohou je zobrazování uživatelského rozhraní, zpracovávání uživatelských vstupů a zobrazování aktuálního herního stavu. Klientská část aplikace s serverem komunikuje pomocí síťových požadavků a volání událostí při využívání socketů a reaguje v reálném čase na změny.

Části aplikace, které se zabývají logikou hry jsou prováděny na serveru a jsou zde umístěny i rozhodící autoritativní a autentizační části celého systému. Zajišťuje také správu herních stavů, ověřování tahů hráčů, přihlášení a legitimaci uživatele a komunikační funkce s databází. Server navíc zajišťuje komunikační funkce s jednotlivými klienty a provádí synchronizaci dat v reálném čase s cílem zajištění konzistence.

= Programovací jazyky

Výběr programovacího jazyka pro fullstack aplikace je extrémně důležité pro rychlost vývoje i stabilnost takového systému. V tomto projektu bude kombinován moderní standard jazyka JavaScriptu se jeho typovou nadstavbou TypeScriptem za využití knihovny Tailwind CSS pro stylování uživatelského rozhraní.

== JavaScript

JavaScript je hlavním programovací jazykem pro webové prohlížeče a jediným nativním webovým jazykem pro logiku na straně klienta, který je podporován všemi moderními prohlížeči. Pro účely této publikace je jazyk JavaScript velice důležitý, protože se jedná o dynamicky interpretovaný jazyk s asynchronV kontextu této aplikace je jazyk JavaScript využíván hlavně prostřednictvím jeho současného standardu ECMAScript. Ten poskytuje účelnou manipulaci asynchronními proudy dat prostřednictvím konstrukcí async a await, což je nesmírné požadavku pro interakce s serverem i databází. Také kvůli neblokujícím vstupu a výstupu je jazyk JavaScript nejvhodnějším pro aplikace vyžadující vysoké interaktivní hodnoty, jako jsou systémy reálného času, kde je zapotřebí zpracování velké množství vstupů od různých uživatelů současně bez prodlení.

== TypeScript

TypeScript je staticky typovaná nadstavba JavaScriptu . Pro vývoj komplexní multiplayerové platformy je TypeScript zvolen jako klíčový nástroj pro zajištění udržitelnosti a bezpečnosti kódu. TypeScript neexistuje jako samostatný runtime, ale v procesu sestavování aplikace je transpilován do čistého JavaScriptu @typescript-docs.

Hlavním přínosem TypeScriptu je zavedení striktního typového systému. V případš, kde existuje velké množství provázaných entit s různými atributy, umožňuje TypeScript definovat přesné datové kontrakty. Pokud vývojář definuje strukturu, kompilátor během psaní kódu vynucuje správné používání všech parametrů. Tím dochází k eliminaci běžných programátorských chyb již ve fázi vývoje, nikoliv až při běhu aplikace u koncového uživatele.

TypeScript rovněž poskytuje pokročilé funkce, jako jsou rozhraní a generické typy. Ty jsou v projektu využity pro tvorbu znovupoužitelných komponent a funkcí, které mohou pracovat s různými datovými typy při zachování plné typové kontroly. Tato technologie tvoří nezbytný podklad pro fungování knihoven jako Drizzle ORM, které na typové bezpečnosti přímo staví svou architekturu.

#pagebreak()
= Použité technologie

Výběr technologií na vývoj komplexní aplikace s multiplayer podporou je rozhodujícím bodem, který určuje nikoli pouze možnosti dalšího rozvoje, ale také omezení výkonu, bezpečnosti a udržitelnosti vyvinutého kódu. Pro vývoj platformy na bázi hry Dungeons & Dragons byly vybrane technologie, které představují aktuální špičku na poli vývojových technologií webových aplikací. Značný důraz byl kladen na modulárnost, rozšiřitelnost a efektivní zpracování dynam

== Next.JS

Jako základy technologie pro moderne webové aplikace se dnes často používají tzv. meta-frameworky navržené nad knihovnou React. Takové frameworky reagují na omezení klasických přístupů, které se soustředí jenom na Single Page Applications, a rozšiřují ho o pokročilé mechanismy pro renderování, routování a optimalizaci přenosu dat. Cílem takových frameworků je sjednotit vývoj obou částí klienta a serveru jedné aplikace v jediném prostředí a nabídnout flexibilní architekturu, která bude reagovat podle rozdílných potřeb obou částí systému @nextjs-docs.

=== App Router

V rámci App Routeru jsou veškeré komponenty implicitně nastaveny jako serverové. Při zpracování požadavku server provede rendering React stromu, jehož výstupem není prostý HTML řetězec, ale specifický textový formát RSC Payload. Tento stream obsahuje serializovanou reprezentaci UI stromu, odkazy na klientské komponenty a předpočítaná data, na jejichž základě klientský prohlížeč postupně rekonstruuje DOM. Tento mechanismus umožňuje přímý přístup k databázi či souborovému systému pomocí async/await přímo v těle komponenty, bez nutnosti expozice API endpointů.

Pro interaktivní prvky jsou využívány Client Components uvozené direktivou 'use client'. Next.js tyto komponenty izoluje do separátních JavaScriptových balíčků (chunks), které jsou odesílány klientovi k následné hydrataci -- procesu, kdy se na serverem vyrenderované HTML naváže klientská aplikační logika. Tento model zajišťuje, že statické části rozhraní nezatěžují hlavní vlákno prohlížeče, zatímco dynamické segmenty zůstávají plně interaktivní.

Tento model hybridního renderování zajišťuje, že statické části rozhraní nezatěžují hlavní vlákno prohlížeče, zatímco dynamické části zůstávají plně interaktivní.

=== Pages Router

Navzdory pokročilé abstrakci App Routeru, který staví na moderním a standardizovaném Web Request/Response API (kompatibilním s Node.js, Edge i Workers), naráží tato architektura na limity v případě perzistentních připojení. Pro implementaci herního serveru vyžadujícího obousměrnou komunikaci v reálném čase je proto nezbytné využít Pages Router. Serverové handlery v Pages Routeru operují v kontextu nativního Node.js HTTP serveru, což umožňuje techniku tzv. socket hijacking. Tato hybridní strategie dovoluje aplikaci využívat nejnovější optimalizace Reactu pro UI a současně udržovat stabilní komunikační kanál pro herní data bez nutnosti správy separátní serverové infrastruktury.

=== Caching a Data Fetching

Next.js implementuje komplexní vícevrstvý cachovací mechanismus inspirovaný standardy protokolu HTTP, který však rozšiřuje o vysokou míru granularity až na úroveň jednotlivých komponent. První linii této architektury tvoří Request Memoization, jež v rámci jediného renderovacího cyklu eliminuje redundanci datových dotazů tím, že identické volání funkce pro načtení dat provede pouze jednou, čímž efektivně snižuje zátěž navazujících vrstev. Na tuto fázi navazuje Data Cache, kde jsou výsledky požadavků typu fetch perzistentně ukládány přímo v souborovém systému serveru; statická data jsou tak načtena pouze při sestavení aplikace nebo při historicky prvním požadavku a následně jsou distribuována přímo z cache bez nutnosti opětovné komunikace se zdrojem. Klíčovým prvkem pro správu dynamických herních či aplikačních dat je pak mechanismus revalidace, který umožňuje on-demand invalidaci uložených záznamů. Jakákoliv změna stavu, například úprava statistik v administraci, tak skrze serverovou akci zajistí doručení aktuálních dat hned při příštím klientském požadavku, aniž by bylo nutné přistoupit k neefektivnímu globálnímu vypínání cachování.

=== Runtime

Architektura frameworku nabízí vysokou míru flexibility díky možnosti volby specifického běhového prostředí (dále již nazývaného _runtime_) pro každou jednotlivou cestu nebo API endpoint, což vývojářům umožňuje precizně optimalizovat výkon aplikace podle povahy konkrétní úlohy. Dominantním prostředím pro většinu aplikační logiky zůstává Node.js runtime, který poskytuje plnou podporu standardních serverových API a nízkoúrovňových operací. I přes určitou režii spojenou s komplexností Node.js modulů a potenciálně vyšší latencí při studených startech, je toto prostředí nezbytné pro operace vyžadující přímý přístup k systémovým prostředkům. V kontextu herního serveru se Node.js využívá zejména pro obsluhu WebSocket serveru a náročné databázové procesy realizované skrze Drizzle ORM, kde je vyžadována robustní manipulace s daty a stabilní konektivita.

Protiváhu k robustnímu ekosystému Node.js představuje Edge Runtime, který je navržen s důrazem na maximální efektivitu a minimální latenci. Toto prostředí je postaveno na technologii V8 isolation, která je výrazně lehčí než tradiční Node.js kontejnery, což umožňuje bleskové spuštění kódu v datových centrech fyzicky nejbližších uživateli. Vzhledem k vysoké optimalizaci a omezené sadě dostupných API je Edge Runtime ideální volbou pro kritické operace, které nesmí brzdit tok požadavku. Typické nasazení zahrnuje komplexní middleware pro ověřování přístupových práv, dynamické směrování nebo proxy servery zajišťující transparentní autentizaci, kde je prioritou okamžitá odezva systému bez zbytečné režie standardního serverového prostředí.

== Turbopack

Pro efektivní vývoj byla využita nová generace bundleru#footnote[Bundler je nástroj pro spojení vícero zdrojových souborů do jednoho optimalizovaného souboru, který je přenesen na stranu klienta] -- Turbopack. Tento nástroj, napsaný v jazyce Rust, nahrazuje Webpack a řeší problém pomalého startu vývojového serveru u rozsáhlých aplikací. Turbopack využívá inkrementální výpočty -- pamatuje si výsledky předchozích sestavení a přepočítává pouze ty moduly, které byly změněny. V praxi to znamená, že i když aplikace naroste do stovek komponent a tisíců řádků kódu, změna v jedné React komponentě se v prohlížeči projeví v řádu desítek až stovek milisekund.

== React

Zatímco Next.js zajišťuje celkovou architekturu a serverové schopnosti aplikace, samotné uživatelské rozhraní a interaktivita jsou postaveny na knihovně React. V kontextu této práce není React vnímán pouze jako nástroj pro tvorbu šablon a komponent, ale jako komplexní runtime prostředí, které definuje, jakým způsobem jsou data transformována do vizuální podoby a jak aplikace reaguje na vstupy uživatele v čase @react-docs.

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

Logika funkcionálních komponent je řízena pomocí mechanismu Hooků, které umožňují _"napojit se"_ na vnitřní stavy a životní cyklus Reactu. Existují tři typy hooků dělené podle funkcionality.

Stavové hooky Slouží k uchování lokálního stavu komponenty mezi jednotlivými rendery. Standardem ve většině aplikací jsou: useState a useReducer. Zatímco useState je využit pro jednoduché hodnoty, popřípadně vnořené objekty, tak useReducer je implementován pro komplexní logiku, kde jeden akční vstup může ovlivnit více stavových proměnných. Při změně hodnoty hooku vždy nastane aktualizace komponentu ve kterém se hook nachází.

Standardní efektový hook se jmenuje hook _useEffect_ a je používáno jako náhrada pro starší životní cyklus v podobě soběstačné metody. Jedná se o způsob, jak napojit na životní cyklus React komponentu, který se spustí jen v případě, že se hodnota jeho „závislostí“ změní. Pokuď se funkce v _useEffect_ napojuje na DOM strukturu je potřeba vždy vyčistit _"event listenery"_ na konci životního cyklu aplikace.

Referenční hook useRef umožňuje uchovat referenci na hodnotu, která přetrvává mezi rendery, ale jejíž změna nevyvolává nové vykreslení. Využíván je především na reference HTML elementů a udržování více verzí hodnot jednoho parametru.

=== React Server Components

I když Next.js podporuje routing zahrnující server-side komponenty, samotný mechanismus RSC je součástí Reactu. Hlavním odlišným faktorem v porovnání s tradiční SSR je seriazizace. Na serverovém nástroji se totiž komponenty nezpracovávají na různé html prvky, ale dělají to na velmi specifickou strukturu. Takže React na straně klienta sloučí nově doručené serverové informace spolu s údajemi již existujících stavú klientských komponent, velmi praktičtí nástroj na obhospodařovávání komponent a rychlého vykreslování.

=== Immutabilita a referenční ident

Důležitý princip pro efektivní práci s detekcí změn ve Reactu je právě nedokončenost dat. V jazyku JavaScript jsou objektu a rozsahu posílána reference. Kulturní objekt s proměnností veadratickým způsobem přímo na míre-findu několi by bylo ve Reactu

V zařízení React se využívá takzvaný „_Shallow Comparison_“ místo hlubokého rozboru struktur vnořených objektech. Oproti tomu knihovna místo hlubokého rozboru rozdílnou hodnotou jednotlivě srovnávané objekty pouze jejich

Pokud se reference na objekt nezměnila, React uměl progressDialoguecalled zapomenula, že se.data nezměnil内部, a přeskočídifficil获取runtime proces renderování. Pro instance festival.applicative, aby musela měnit komponentu rins, když se aktualizovala.data state Pavel musela vytvořit úplně fresh nový instance objektu, takže by se měnil også reference na objekt. Takhle.aldrin princip Eugineaders_annotations,rectticky

=== React Compiler

Inovací použitou v projektu je nasazení React Compileru. V předchozích verzích Reactu, do verze 19, byla optimalizace renderování z velké části manuální odpovědností vývojáře. Aby se předešlo zbytečnému vytváření nových instancí funkcí a objektů při každém vykreslení, museli vývojáři obalovat kód do hooků useMemo, který slouží pro hodnoty, a useCallback, jenž složí pro funkce.

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

Významnou předností Drizzle ORM je i hluboká integrace s jazykem TypeScript a využití pokročilé _inferované typové kontroly_#footnote[Inferovaný typ je princip typescriptu, díky němuž se typy automaticky odvozují z kontextu nebo předem definované hodnoty]. Tento mechanismus funguje napříč celým procesem práce s databází. Při tvorbě dotazů poskytuje editor přesné napovídání názvů sloupců i jejich datových typů a zároveň umožňuje odhalit typové nesrovnalosti již v době kompilace. Při získávání dat jsou výsledky dotazů automaticky typovány, takže není nutné ručně definovat rozhraní pro jejich strukturu. Typy jsou odvozeny dynamicky na základě specifikace dotazu, včetně vybraných sloupců a relací.

Pro práci s propojenými daty nabízí Drizzle zjednodušené Relational Query API. To umožňuje vývojářům načítat hierarchická data deklarativně, podobně jako v GraphQL nebo Prisma ORM. Drizzle interně optimalizuje tyto požadavky, aby předešel problému N+1, situaci, kdy aplikace pro každou položku seznamu posílá do databáze samostatný dotaz. Podle struktury dat a použitého databázového ovladače Drizzle buď zkompiluje požadavek do jednoho efektivního SQL dotazu, nebo data načte paralelně v minimálním počtu kroků a spojí je na úrovni aplikace. Tím zajišťuje optimální výkon i při složitých datových strukturách. Součástí ekosystému je nástroj Drizzle Kit, který automatizuje správu změn v databázi. Porovnává aktuální schéma definované v TypeScriptu se snapshotem předchozího stavu a generuje SQL migrační soubory. Tento proces zajišťuje, že vývoj databáze je verzovaný, transparentní a bezpečně replikovatelný napříč vývojovým, testovacím a produkčním prostředím.

== Tailwind CSS

Pro definici vizuální podoby uživatelského rozhraní a tvorbu responzivního designu byla zvolena knihovna Tailwind CSS. Na rozdíl od tradičních CSS knihoven, které nabízejí předpřipravené komponenty @tailwind-docs.

=== Utility-First paradigma

Základem Tailwind CSS je koncept Utility-First. Namísto vytváření sémantických tříd, které v sobě nesou desítky deklarací, framework poskytuje atomické třídy reprezentující jednotlivé CSS vlastnosti. V kontextu aplikace tento přístup přináší několik klíčových výhod. Prnví je eliminace kontextového přepínání, jež umožňuje probíhání stylizace přímo v kódu komponenty, což zrychluje vývojový cyklus. Vývojář definuje vzhled elementů pomocí řetězení tříd pro okraje, barvy a typografii, což výrazně zrychluje iterační cyklus vývoje.

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

Pro vytvoření interaktivního 3D prostředí herního světa je potřeba využit vícevrstvý technologický stack. Na nejnižší úrovni stojí WebGL jako standardizované grafické API pro přístup ke grafické kartě (dále již pouze jako GPU) z prostředí webového prohlížeče. Nad ním je použita knihovna _Three.js_, která abstrahuje nízkoúrovňové operace do objektového modelu scény. Další vrstvu tvoří React Three Fiber, jenž převádí deklarativní paradigma Reactu do správy 3D scény. Sadu specializovaných pomocných komponent poskytuje knihovna _drei_ a plynulé fyzikálně založené animace jsou realizovány pomocí _react-spring_ v integraci _\@react-spring/three_.

=== WebGL

Web Graphics Library (dále již pouze jako WebGL) je JavaScriptové rozhraní vycházející z OpenGL ES#footnote[OpenGL for Embedded Systems je odlehčená specifikace grafického API OpenGL určená pro vestavěná zařízení a mobilní platformy.], které umožňuje provádět grafické operace přímo na grafickém procesoru. Vykreslovací pipeline je programovatelná a skládá se zejména z vertex shaderu a fragment shaderu#footnote[Shader je program spouštěný na GPU. Vertex shader transformuje vrcholy modelu do projekčního prostoru, zatímco fragment shader určuje výslednou barvu fragmentu#footnote[Fragmentem bývá označen sametný pixel nebo vektorová část geometrie meshe.] po rasterizaci.]. Vertex shader zpracovává vrcholy geometrie, aplikuje transformační matice model-view-projection a připravuje data pro rasterizaci. Fragment shader následně určuje výslednou barvu jednotlivých pixelů s ohledem na materiál, textury, osvětlení a případné postprocesní efekty @w3c-webgl @realtime-rendering @pbr-book.

Data jsou do grafické výpočetní jednotky přenášena prostřednictvím bufferů a atributů, zatímco globální parametry scény jako jsou světelné podmínky, transformační matice nebo čas jsou předávány přes uniform proměnné @khronos-webgl. WebGL dále používá depth buffer pro korektní překryv objektů v prostoru, stencil buffer pro maskování a blending pro práci s průhledností. Výkonové limity jsou úzce svázány s počtem draw-call, velikostí geometrií, komplexitou shaderů a šířkou paměťové propustnosti mezi CPU a GPU  @khronos-opengles32.

=== Three.js

Three.js představuje vysokou abstrakční vrstvu nad WebGL @threejs-docs. Místo manuální správy shader programů, bufferů a stavu renderovacího kontextu nabízí scénový graf s entitami jako _Scene_, _Camera_, _Mesh_, _Geometry_, _Material_ a _Light_. Vývojář tak pracuje s doménově srozumitelnými objekty a transformačním stromem, zatímco knihovna interně řeší serializaci dat do GPU, optimalizaci renderovacího průchodu a správu WebGL stavu. @threejs-docs

Klíčovou součástí je renderovací smyčka, kde renderer v každém snímku vyhodnocuje scénu vzhledem ke kameře a generuje výsledný obraz. Three.js zároveň poskytuje nástroje pro raycasting, načítání externích assetů, práci s PBR materiály#footnote[Physically Based Rendering je model materiálů založený na fyzikálních vlastnostech povrchu.] a správu stínování. V praxi to umožňuje vytvářet komplexní 3D rozhraní bez nutnosti psát nízkoúrovňový grafický kód od začátku.

=== React Three Fiber

React Three Fiber (dále již pouze jako R3F) je vlastní renderer pro React, který mapuje JSX prvky na objekty Three.js @r3f-docs. Nejedná se o nadstavbu typu „wrapper komponent“, ale o plnohodnotný React reconciler#footnote[Reconciler je interní mechanismus Reactu, který porovnává předchozí a nový stav stromu komponent a provádí pouze minimální sadu změn potřebných pro aktualizaci výstupu.]. To znamená, že životní cyklus 3D objektů je řízen stejným principem diffingu a reconciliace jako běžné DOM komponenty: při změně stavu React vypočítá minimální nutné změny a aplikuje je do scénového grafu Three.js.

Architektonicky je zásadní komponenta _Canvas_, která inicializuje renderer, scénu, kameru a interní loop. Hook _useFrame_ umožňuje registrovat per-frame logiku#footnote[Per-frame logika je kód spouštěný při každém vykresleném snímku.] s přesným časovým krokem, například pro aktualizaci pozic, simulaci projektilů nebo interpolaci síťových snapshotů. R3F také podporuje řízení renderování v režimu _always_ i _demand_, což umožňuje cíleně snižovat výpočetní zátěž v okamžicích, kdy se scéna nemění.

Významnou výhodou je přímá integrace s React ekosystémem. Stav aplikace lze sdílet přes stejné mechanismy jako ve 2D UI (například Zustand), a 3D komponenty tak mohou reagovat na stejné doménové události jako zbytek aplikace. Tento jednotný datový model redukuje architektonickou složitost a usnadňuje údržbu rozsáhlého projektu.

=== React Three Drei

Knihovna _drei_ poskytuje množinu předpřipravených utilit a komponent nad R3F, které řeší opakující se technické úlohy @drei-docs. Patří sem například orbitální ovládání kamery (_OrbitControls_), načítání modelů a textur (_useGLTF_, _useTexture_), environment mapy, helpery světel, předkonfigurované geometrie a komponenty pro text nebo postprocessing.

Hlavní přínos _drei_ spočívá v redukci boilerplate kódu a ve standardizaci osvědčených implementačních vzorů. Tím se zkracuje čas vývoje, snižuje riziko chyb při konfiguraci scény a zlepšuje čitelnost komponentové vrstvy. V kontextu maturitní práce je důležité, že _drei_ neomezuje přístup k nízkoúrovňovým mechanismům Three.js; pouze poskytuje ergonomičtější vstupní bod pro běžné scénáře.

=== React Spring

Knihovna _react-spring_ v kombinaci s modulem _\@react-spring/three_ realizuje animace na bázi pružinového modelu, nikoliv na pevných časových křivkách @reactspring-docs. Pohyb je popsán parametry fyzikální soustavy, kterými jsou: tuhost, tlumení, hmotnost, atd. Využití _react-spring_ vede k přirozenému průběhu změn a stabilnímu chování i při přerušení nebo změně cílového stavu během animace.

V prostředí R3F se animované hodnoty přímo mapují na transformace a materiálové vlastnosti objektů. Přesněji se jedná o hodnoty jako pozice, rotace, viditelnost a attributy upravující geometrii. Tento přístup je zásadní pro interaktivní herní UI, kde se stav může měnit asynchronně v závislosti na síťové komunikaci. Oproti klasickým keyframe animacím umožňuje pružinový model kontinuální a vizuálně hladké přechody mezi diskrétními stavy herní logiky.

=== Spolupráce vrstev

Při běhu aplikace probíhá zpracování ve více navazujících vrstvách. React vrstva vyhodnotí změnu stavu #footnote[příkladem jsou pohyby entit, změny iniciativy nebo aktivace schopností]. React Three Fiber tuto změnu promítne do odpovídajících uzlů scénového grafu Three.js. Three.js následně připraví renderovací data pro WebGL a předá je grafickému procesoru. Pokud je změna animovaná, _react-spring_ generuje mezikroky, které jsou v každém snímku aplikovány přes R3F do scény.

Tento model poskytuje jasné oddělení odpovědností: WebGL řeší nízkoúrovňové vykreslení, Three.js správu 3D domény, R3F integraci s React architekturou, _drei_ produktivitu vývoje a _react-spring_ fyzikálně konzistentní přechody stavů. Výsledkem je škálovatelné řešení, které je vhodné pro multiplayerovou RPG aplikaci s důrazem na plynulost, čitelnost kódu a dlouhodobou udržitelnost.

#pagebreak()

= Vývoj aplikace

Následující část práce se zaměřuje na reálné fungování implementace v rámci projektu, nikoli pouze na výčet použitých technologií. Analyzuje procesy probíhající při vykreslování 3D scény, interakci uživatele se systémem, otevírání dialogových oken a komunikaci mezi klientskou a serverovou částí aplikace.

== Postup vývoje aplikace

Vývoj aplikace probíhal iterativním způsobem. První etapou bylo vytvoření stabilního datového a aplikačního základu, tedy návrh databázového schématu, autentizační vrstvy a základních serverových operací pro práci s uživateli, lobby a ostatními herními prvky. Teprve po ověření těchto částí následovala implementace komunikace v reálném čase a 3D zobrazování na straně klienta. Tento postup se v praxi ukázal jako vhodný, protože umožnil oddělit základní strukturu od prezentační vrstvy a minimalizoval riziko, že by se grafické rozhraní vyvíjelo nad neustále se měnícím modelem dat.

=== Využití Socket.IO při vývoji multiplayeru

Knihovna Socket.IO byla do projektu zařazena, jelikož bylo potřeba zajistit obousměrnou komunikaci mezi klientem a serverem bez neustálého opakování klasických dotazů. Praktická implementace je založena na tom, že klient po přihlášení nejprve aktivuje endpoint `/api/socket`, čímž je zajištěna inicializace socket serveru v rámci stejného Node.js procesu jako samotná aplikace. Následně dojde k navázání perzistentního spojení a registraci posluchačů pro lobby i herní vrstvu. Tento přístup umožnil zachovat jednotné nasazení aplikace bez nutnosti provozovat samostatný realtime server @socketio-docs @nextjs-docs.

Při návrhu komunikační vrstvy bylo důležité nerozlišovat klienta jako zdroj pravdy, ale pouze jako zdroj vstupů. Klient proto neodesílá hotový nový stav hry, nýbrž pouze záměr provést konkrétní akci, například vstoupit do hry, přesunout entitu nebo otevřít obchodní interakci. Server tento záměr ověří, aplikuje změnu do autoritativního stavu a teprve poté rozešle aktualizovaný snapshot nebo patch ostatním klientům v příslušné místnosti. Takový model odpovídá doporučením pro síťové hry, kde je potřeba předcházet nekonzistenci a současně omezit možnost klientské manipulace s pravidly @multiplayer-game-programming @socketio-docs.

Praktickým přínosem Socket.IO v této aplikaci nebyla pouze rychlost přenosu, ale i jasná organizace komunikace. Události byly rozděleny do doménových skupin `lobby:*` a `game:*`, díky čemuž bylo možné jednoduše oddělit sociální část systému od samotné herní logiky. Současně se v implementaci osvědčilo využití místností (rooms), protože server mohl rozesílat změny pouze těm klientům, kterých se konkrétní herní instance skutečně týká. Tím se snižuje objem přenášených dat a celý systém je lépe škálovatelný i při souběhu více aktivních herních relací @socketio-docs.

=== Využití React Three Fiber při návrhu 3D bojiště

Po stabilizaci síťové a datové vrstvy následoval vývoj samotného herního rozhraní. Pro zobrazení herního plánu bylo zvoleno řešení založené na knihovně React Three Fiber, která umožňuje vytvářet 3D scénu deklarativním způsobem přímo v ekosystému Reactu. V praxi to znamená, že komponenty jako podlaha, entity, světla nebo kamera mohou být navrženy stejně jako běžné React komponenty, přestože se jejich výsledkem nestává HTML strom, ale scénový graf knihovny Three.js @r3f-docs @threejs-docs.

Tento přístup se během vývoje ukázal jako velmi přínosný zejména proto, že 3D zobrazovací vrstva nemusela být oddělena od zbytku aplikace. Stav herní instance je uložen v centrálním úložišti Zustand a stejná data jsou současně využívána jak pro klasické uživatelské rozhraní, tak pro vykreslení 3D objektů. Pokud například server odešle aktualizaci pozice entity, projeví se tatáž změna ve stavovém úložišti a následně se bez duplicitní logiky promítne do seznamu akcí, dialogových oken i do pozice objektu ve scéně. Tím bylo dosaženo jednotného datového modelu a výrazně jednodušší údržby klientské části @zustand-docs @r3f-docs.

Při vývoji 3D části bylo zároveň nutné počítat s tím, že ne všechny entity budou mít vždy připravený finální model. Z tohoto důvodu byla implementována záložní geometrie, která je vykreslena v případě, že model ve formátu glTF nebo GLB není dostupný nebo se nepodaří načíst. Tento mechanismus se ukázal jako důležitý nejen pro odolnost aplikace za běhu, ale i pro samotný vývoj, protože umožnil testovat herní logiku a interakce ještě před dokončením všech grafických assetů @gltf-spec @threejs-docs.

=== Praktické využití hlavních technologií

Z praktického hlediska se v projektu nejedná o soubor izolovaných knihoven, ale o navazující vrstvy, z nichž každá řeší jiný typ problému. Framework Next.js tvoří aplikační kostru celého systému: pomocí App Routeru jsou realizovány běžné stránky aplikace, dashboard a herní rozhraní, zatímco Pages Router je využit pro endpoint `/api/socket`, jehož prostřednictvím se inicializuje realtime komunikační vrstva. Toto rozdělení se v praxi ukázalo jako účelné, protože umožnilo zachovat komfort moderního React frameworku a současně obejít omezení, která jsou spojena s nasazením WebSocket serveru přímo v čistě server-component architektuře @nextjs-docs @socketio-docs.

Na klientské straně plní React Three Fiber roli integrační vrstvy mezi Reactem a 3D scénou. Knihovna Three.js zde zůstává nízkoúrovňovým základem, který poskytuje scénový graf, kameru, světla, materiály a načítání modelů pomocí _GLTFLoader_, zatímco React Three Fiber převádí tyto koncepty do deklarativních komponent. Knihovna _\@react-three/drei_ doplňuje pomocné mechanismy, v této implementaci zejména adaptivní obsluhu událostí, a balík _\@react-three/postprocessing_ zajišťuje finální obrazovou stylizaci. Stavová knihovna Zustand centralizuje herní stav, socket připojení, dialogy i parametry kamery, takže data nejsou roztříštěna mezi mnoho lokálních komponent. Knihovna _react-spring_ pak řeší problém vizuální diskontinuity při síťové synchronizaci tím, že interpoluje změny pozic entit mezi dvěma snapshoty @r3f-docs @threejs-docs @zustand-docs @reactspring-docs.

V serverové vrstvě je zásadní role knihovny Drizzle ORM, která poskytuje typově bezpečnou práci s relační databází a současně usnadňuje transakční zápisy v situacích, kde se mění více tabulek naráz, například při obchodování, přesunu inventáře, odpočinku nebo levelování. Nad touto datovou vrstvou je postavena autentizace přes Better Auth, která zajišťuje relace uživatelů a jednotné přihlášení. Praktickým přínosem tohoto spojení je především to, že herní operace mohou vycházet z již ověřené identity uživatele a navazovat na ni další autorizaci, například rozlišení, zda jde o běžného hráče nebo Dungeon Mastera @drizzle-docs @better-auth-docs.

=== Praktické zhodnocení zvoleného postupu

Z pohledu vývoje se jako nejvhodnější ukázalo pořadí, v němž byla nejprve vytvořena autoritativní serverová logika, poté realtime synchronizace a až následně pokročilé 3D rozhraní. Díky tomu bylo možné každou vrstvu ověřovat samostatně a průběžně kontrolovat, zda klient pouze korektně zobrazuje stav, který vznikl na serveru. Současně se potvrdilo, že propojení Next.js, Socket.IO, Zustand a React Three Fiber tvoří funkční celek: Next.js poskytuje aplikační rámec, Socket.IO zajišťuje událostní komunikaci, Zustand drží sdílený klientský stav a React Three Fiber převádí tento stav do prostorové vizualizace @nextjs-docs @socketio-docs @zustand-docs @r3f-docs.

Tento způsob vývoje odpovídá požadavkům na moderní multiplayerovou webovou aplikaci, v níž je třeba současně řešit konzistenci dat, interaktivitu uživatelského rozhraní i výkon 3D vykreslování. V kontextu maturitní práce je podstatné, že zvolený technologický stack nebyl využit samoúčelně, ale vždy s ohledem na konkrétní problém: Socket.IO pro synchronizaci herního stavu v reálném čase, React Three Fiber pro přehlednou správu 3D scény a Zustand pro propojení herních dat s uživatelským rozhraním. Výsledkem je aplikace, která je rozšiřitelná, srozumitelná při další údržbě a současně dostatečně robustní pro provoz víceuživatelské hry.

== Kompozice scény a odpovědnosti jednotlivých vrstev

Herní stránka je složena jako kompozice několika navzájem oddělených vrstev. Vrstva _GameProvider_ zajišťuje napojení na multiplayer instanci a životní cyklus připojení. Vrstva _Main_ nejprve rozhoduje, zda je zařízení pro tuto část aplikace podporováno; při přístupu z mobilního zařízení je zobrazena náhradní informační obrazovka, zatímco na desktopu komponenta vytvoří _Canvas_ s výchozí kamerou a poskytne prostor pro všechny R3F komponenty. V tomto kontextu jsou umístěny:
- entity čítající charaktery, monstra a specifické interaktivní objekty
- podlaha a interaktivní vrstvy pro zvýraznění dosažitelných polí a detekci kliknutí
- světla a kamera pro zajištění správného osvětlení a pohledu na scénu

Z pohledu systémové správy je implementován hybridní provozní model, který odděluje vykreslovací odpovědnosti od řízení aplikačního stavu a současně zachovává jednotné doménové kontrakty.

Technicky je tok operací realizován jako deterministický příkaz. Uživatelský vstup ve 3D scéně je serializován do doménové akce, akce je validována proti aktuálnímu snapshotu, následně je odeslána na backend přes socket kanál a po serverovém ověření a potvrzení je promítnuta do centrálního uložiště na klientské straně. Tím je zajištěno, že změna vzniklá interakcí s 3D entitou se konzistentně projeví v obou prezentačních vrstvách i ve sdíleném synchronizovaném stavu celého lobby. Prakticky je důležité i to, že stejný snapshot používají souběžně komponenty scény, dialogové panely i kamera, takže nedochází k rozpojení vizuální a logické vrstvy.

Renderovací subsystém je navržen modulárně, tudíž každý typ objektu má samostatnou komponentu, vlastní datový vstup a optimalizační strategii. Tím je dosaženo vysoké čitelnosti vykreslovacího řetězece i predikovatelného výkonového chování.

=== Podlaha a interakční vrstvy

Komponenta _Floor_ představuje translační vrstvu mezi diskrétním herním modelem (dlaždicová mřížka) a spojitým 3D prostorem. Jejím úkolem není pouze vykreslení povrchu, ale zejména projekce herních pravidel do vizuálních interakčních markerů. Teoreticky jde o dvoufázové zpracování. Prvním je výpočet doménových kandidátů (viable tiles, impact tiles, area of effect) na základě aktuálního stavu hry a pravidel pro danou akci. Druhým je samotná vizualizace těchto kandidátů, která je podmíněna lokální viditelností a render distance. Tím se zajišťuje, že hráč vidí pouze relevantní informace, které odpovídají jeho aktuálnímu pohledu na herní svět. Tato separace výpočtu a vykreslení je zásadní pro determinismus: stejná pravidla mohou být použita jak pro UI feedback, tak pro serverovou validaci akce.

=== Entity

Vrstva _Entities_ realizuje render herních aktérů i statických interaktivních objektů pomocí jednotného kontraktu entity. Rendering je založen na principu „model-first. Avšak pro zkrácení načítací doby byl přidán fallback s parametrickou geometrii, která slouží jako záložní varianta, když se něco pokazí. Součástí je i časově spojitá interpolace pozice pomocí spring-based smoothing (dále již pouze jako SbM), která filtruje síťovou diskretizaci a redukuje vizuální sekání při příjmu a vykreslování nových dat. Dále je aplikována selektivní viditelnost odvozená od vzdálenosti vykreslování od pozice kamery, čímž se omezuje počet objektů zařazených do render pass v každém snímku.

=== Stěny jako instancované objekty

Stěny jsou implementovány jako instance jediné geometrie a společného materiálu s per-instancí transformační maticí. Z teoretického hlediska jde o klasickou GPU strategii, která minimalizuje vytížení na CPU straně a snižuje počet draw-call#footnote[Jednotlivé příkazy pro grafickou jednotku nutící vykreslení specifické instance] za obnovení. V praxi to znamená, že všechny stěny jsou reprezentovány jako jedna geometrie, která je duplikována a transformována pomocí shaderu. Tento přístup umožňuje efektivní vykreslení velkého množství stěn bez nutnosti vytvářet samostatné objekty pro každou z nich, což výrazně zlepšuje výkon a škálovatelnost scény. Problém tvoří maximální velikost bufferu pro instancované objekty, která je omezena na specifický počet sub-instancí. V daném případě je využit manager pro rozdělení stěn do skupin, které nepřekračují tento limit. Ačkoliv tento přístup přidává určitou komplexitu do správy stěn, výsledkem je výrazné zlepšení výkonu při zachování vizuální kvality.

=== Postprocessing

Postprocessing je v rámci projektu realizován jako samostatná komponenta vložená přímo do renderovacího stromu React Three Fiber. Praktická implementace je záměrně úsporná: využívá _EffectComposer_ z balíku _\@react-three/postprocessing_, na který je navázán efekt _Pixelation_ s nízkou granularitou. Výsledkem není fotorealistické vyhlazení obrazu, ale stylizace, která podporuje herní atmosféru a současně snižuje vizuální nároky na jemné detaily modelů. Vedle toho je aktivována komponenta _AdaptiveEvents_ z knihovny _\@react-three/drei_, která pomáhá udržet interakci se scénou i v situacích, kdy se mění zatížení vykreslování @r3f-docs @threejs-docs.

Z návrhového hlediska je důležité, že tato vrstva nijak nezasahuje do doménové logiky hry. Postprocessing pracuje až nad hotovým obrazem, a proto neovlivňuje výpočet tahu, kolize, vzdálenosti ani pravidla schopností. Jeho úkolem je výhradně upravit výsledné zobrazení tak, aby byla scéna vizuálně konzistentní a čitelná.

== Metriky vzdálenosti v distribuovaném systému

Klíčovým prvkem pro řízení prostorové logiky a optimalizaci vykreslování je centrální utilitární funkce _Render.distance()_. Tato funkce v závislosti na kontextu volání počítá vzdálenost mezi dvěma body pomocí tří rozdílných matematických metrik, z nichž každá hraje specifickou roli v interpretaci herního prostoru.


První z nich, Eukleidovská vzdálenost, představuje geometricky nejkratší přímou spojnici dvou bodů ve vektorovém prostoru, definovanou vztahem $d(x, y) = sqrt(sum_(i=1)^n (x_i - y_i)^2)$. V systému je využívána primárně pro definici parametrů viditelnosti, neboli render distance, kde její lineární charakter poskytuje uživateli nejpřirozenější vizuální vjem hloubky.

Naproti tomu Manhattanská vzdálenost definuje prostor jako součet absolutních rozdílů souřadnic podél os mřížky, tedy $d_1(x, y) = sum_(i=1)^n |x_i - y_i|$. Tato metrika je nezbytná pro výpočet interakčního dosahu a zobrazení dosažitelných polí, neboť její ortogonální povaha přesně koresponduje s pravidly pohybu po čtvercové či krychlové mřížce herního plánu.

Poslední aplikovanou metodou je Čebyševova vzdálenost, která je určena jako maximum z rozdílů v jednotlivých dimenzích, formálně $L_infinity = max_i (|x_i - y_i|)$. Své uplatnění nachází především v algoritmech pro render culling a definici čtvercových výřezových oblastí, kde umožňuje bleskově rozhodnout o relevanci objektu vzhledem k pozici kamery. Tato trojúrovňová diferenciace metrik dovoluje systému precizně oddělit vizuální věrnost od přísné herní logiky a efektivně tak alokovat výpočetní prostředky.
== Kamera

Kamera je implementována jako samostatný subsystém tvořený zustand úložištěm _useCamera_, který uchovává hodnoty a logiku kamery mimo renderované komponenty, a aktualizační smyčkou _useFrame_ použitou ke tvorbě pohybu a ovládacích prvků. Uživatelský vstup realizovaný klávesami není mapován přímo na kartézskou pozici kamery, ale na parametry orbitálního modelu. Konkrétně se jedná o trojrozměrný vektorový bod _target_, kolem něhož se kamera orientuje, dále o parametry _azimuth_#footnote[úhel reprezentující rotaci kolem vertikální osy], _elevation_#footnote[elevation je veličina určující vertikální náklon pohledu] a  _distance_#footnote[distance vyjadřuje vzdálenost kamery od cílového bodu], který fakticky odpovídá rotaci, náklonu a vzálenosi kamery v tomto pořadí.

#figure(
  image("assets/camera.png"),
  caption: [ Schéma modulu kamery a jeho parametrů.
  ],
)

V každém vykresleném snímku jsou tyto parametry přepočítány ze sférických souřadnic na kartézskou polohu kamery. Výsledná pozice je následně použita na zajištění konzistentní orientace směrem k cíli. Tento model je stabilnější než přímá translace kamery v prostoru, protože jednoznačně odděluje informaci o tom, kam se kamera dívá, od informace o tom, odkud se dívá. Orientace je tedy vždy determinována vztahem k cílovému bodu, zatímco pozice je definována radiální vzdáleností a úhlovými parametry.

Použití časování _delta_ navíc zajišťuje nezávislost pohybu na snímkové frekvenci, což znamená, že rychlost změny parametrů zůstává konzistentní napříč zařízeními s odlišným snímky za vteřinu. Díky tomu nenastávají problémy s optimalizací tvořené mezisnímky a nedokanýlími načteními požadavků ze strany serveru.


== Kontextové menu a dialogy

Dialogový systém je centralizován ve stavovém úložišti _useDialog_, které vytvořeno pomocí knihovny zustand a představuje aplikační vrstvu řízení modálních oken a kontextových panelů. Každý dialog má explicitně definovaný stav otevření či zavření a současně nese vlastní kontext. Otevření dialogu tedy není lokální UI stav konkrétní komponenty, ale doménová událost odvozená z herního modelu.

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

Klíčovým architektonickým řešením je způsob, jakým je Socket.IO server inicializován v rámci stejného procesu jako Next.js aplikace. Endpoint `/api/socket` v Pages Routeru funguje jako vstupní bod, který v případě prvního volání vytvoří instanci `Server` z knihovny Socket.IO a napojí ji na nativní Node.js HTTP server přístupný prostřednictvím objektu `res.socket.server`. Při každém dalším požadavku na tento endpoint server detekuje existující instanci a okamžitě odpovídá, čímž se zabrání duplicitnímu vytváření WebSocket serveru.

Po navázání spojení s klientem server registruje moduly, které jsou organizovány podle doménových oblastí: `lobby` pro správu herních místností, `game-entities` pro správu herních entit, `game-actions` pro herní akce jako pohyb a používání schopností, `inventory` pro správu inventáře, `trading` pro obchodování mezi hráči, `campfire` pro interakce s objekty typu ohniště a `leveling` pro systém postupu na vyšší úrovně. Každý modul přijímá kontextový objekt `SocketContext` obsahující referenci na socket připojeného klienta, globální instanci serveru a sdílenou mapu herních instancí uloženou v operační paměti. Tato mapa slouží jako cache vrstva, která minimalizuje počet dotazů do databáze při opakovaných operacích v rámci jedné herní relace.

Při odpojení klienta server automaticky uklídí prostředky: odebere klienta z příslušných místností a pokud je místnost prázdná, odstraní odpovídající herní instanci z paměťové cache. Tímto mechanismem je zajištěna efektivní správa serverových prostředků bez nutnosti externího procesu pro úklid neaktivních relací.

== Databázové schéma a relační model

Databázové schéma je definováno deklarativně pomocí Drizzle ORM v jazyce TypeScript a představuje centrální doménový model celé aplikace @drizzle-docs. Schéma je rozčleněno do několika logických bloků, které odpovídají klíčovým oblastem systému. Celkový přehled entit a jejich vazeb je znázorněn na diagramu.

#include "assets/database-diagram.typ";

=== Autentizace a uživatelé

Autentizační vrstva je založena na knihovně Better Auth, která poskytuje kompletní řešení pro správu uživatelských účtů, relací a ověřování identity. Schéma zahrnuje tabulky `user`, `session`, `account` a `verification`, přičemž tabulka `user` uchovává základní údaje o uživateli včetně jména, emailu a avataru. Tabulka `session` spravuje aktivní relace s podporou expirace a automatické obnovy. V tabulkce `account` jsou uložena data umožňující napojení na externí poskytovatele identity, v případě této aplikace se jedná o přihlášení od služby Google, prostřednictvím protokolu OAuth 2.0#footnote[OAuth 2.0 je autorizační framework umožňující aplikacím třetích stran získat omezený přístup k uživatelským zdrojům bez sdílení přihlašovacích údajů.] @google-oauth2. Konfigurace Better Auth zajišťuje šifrování OAuth tokenů, cachování relací v cookies s pětiminutovou platností a sedmidenní session s denní obnovitelností.

== Autentizace a middleware

Autentizační vrstva využívá knihovnu Better Auth, která je integrována s Drizzle ORM prostřednictvím adaptéru `drizzleAdapter`. Konfigurace zahrnuje podporu emailového přihlášení s heslem i přihlášení přes sociální poskytovatele (GitHub, Google). Middleware na úrovni Next.js zajišťuje ochranu cest: nepřihlášení uživatelé jsou přesměrováni na přihlašovací stránku a naopak, přihlášení uživatelé jsou přesměrováni z autentizační stránky na hlavní panel.

Systém relací je konfigurován s sedmidenní platností a denní obnovou, přičemž je využito cachování v cookies s pětiminutovou platností pro snížení zátěže na databázi při opakovaných požadavcích. Tokeny od externích poskytovatelů jsou šifrovány, čímž je minimalizováno riziko úniku citlivých údajů i při kompromitaci databáze.

=== Herní entity

Herní entity jsou modelovány prostřednictvím polymorfní struktury, kde tabulka `lobby_entity` slouží jako jednotný bod pro všechny typy entit v rámci herní instance. Každý záznam v této tabulce obsahuje referenci na `lobby`, typ entity (postava, monstrum, truhla nebo ohniště), pozici na herní mřížce ve formátu JSONB a volitelné cizí klíče na příslušné detailní tabulky. Tato architektura umožňuje udržovat heterogenní kolekci entit v jedné tabulce s jednotným mechanismem dotazování, a zároveň zachovává relační integritu prostřednictvím cizích klíčů s kaskádovým mazáním.

Tabulka `character` modeluje hráčské postavy s atributy rozdělenými do čtyř kategorií: síla, obratnost, odolnost a inteligence. Statistiky postavy, jako jsou maximální životy, počet akcí za tah, vytrvalost a nosnost, jsou odvozeny z těchto atributů algoritmicky a ukládány do databáze jako denormalizované hodnoty. Důvodem denormalizace je eliminace opakovaného přepočtu v serverových handlerech, kde je rychlost odezvy kritická. Tabulka `monster` modeluje nepřátelské entity s vlastními schopnostmi uloženými ve formátu JSONB pole.

== Tvorba postavy

Tvůrce postav je implementován jako celoobrazovkový dialog, který provádí hráče procesem definice herní postavy. Proces začíná výběrem rasy z predefinovaného katalogu tvořeného trpaslíkem, elfem, člověkem a orkem, přičemž každá rasa má odlišné základní hodnoty atributů usnadňující specifické herní styly. Po výběru rasy má hráč k dispozici sedm volných atributových bodů, které může distribuovat mezi čtyři atributy s maximálním přídavkem tří bodů na jeden atribut.

Součástí tvorby je také nákupní systém, ve kterém má hráč počáteční rozpočet 100 zlatých mincí. Za tyto prostředky si může pořídit výchozí vybavení z katalogu předmětů. Statistiky postavy jsou přepočítávány v reálném čase při každé změně atributů pomocí centrální funkce `calculateCharacterStats`, čímž hráč okamžitě vidí dopad svých rozhodnutí na parametry jako životy, akce za tah nebo nosnost.

#block(breakable: false)[ ```text
ALGORITHM calculateCharacterStats(character, inventory = {weight: 0, armor: 0})
  max_hp := floor(character.attributes.constitution + character.attributes.strength / 2 + 5)
  max_actions := floor(
    character.level / 4 + character.attributes.dexterity / 8 + character.attributes.intelligence / 8
  )
  max_weight := floor(10 + character.attributes.strength + character.attributes.constitution / 2)
  max_memory := floor(character.attributes.intelligence / 2 + character.level + 1)
  IF max_weight < inventory.weight THEN
    stamina_divisor := 2
  ELSE
    stamina_divisor := 1
  END IF
  stamina := floor((character.attributes.dexterity / 2 + 5) / stamina_divisor)
  RETURN {
    max_hp,
    max_actions,
    stamina,
    weight = inventory.weight,
    max_weight,
    max_memory,
    armor = inventory.armor
  }
END
``` ]

=== Inventář a obchodování

Inventářní systém je implementován prostřednictvím vazební tabulky `inventory` s kompozitním primárním klíčem tvořeným párem `character_id` a `item_id`. Tato struktura zajišťuje, že každá postava může vlastnit jeden záznam pro každý typ předmětu, přičemž množství je evidováno jako celé číslo. Sloupec `equipped` typu boolean určuje, zda je předmět aktivně nasazen. Tabulka `item` definuje katalog předmětů s atributy jako typ, váha, hodnota, brnění a pole schopností. Schopnosti jsou uloženy ve formátu JSON pole, což umožňuje flexibilní definici různých typů útočných a podpůrných efektů bez nutnosti dalších relačních tabulek.

Pro truhly existuje analogická vazební tabulka `chest_inventory` se stejnou strukturou, avšak bez atributu vybavení. Obchodování u ohniště je modelováno tabulkou `campfire_shop_item`, která definuje nabídku předmětů a jejich ceny v herní měně pro konkrétní ohniště.

== Systém tahů a pořadí

Herní mechanika střídání tahů je navržena jako řízený sekvenční systém, který uchovává stav aktuálního kola a pořadí jednotlivých entit. Tento systém sleduje tři hlavní informace: pořadí entit v kole#footnote[Sekvence uložena jakožto jednorozmorně pole typu string], aktuálně aktivní entitu#footnote[Intex `turn` udržující numerickou hodnotu pořadí entity v sekvenci].

Přechod na další tah je serverová operace, při které se inkrementuje index `turn`. Pokud index dosáhne konce sekvence, je nastaven na hodnotu $-1$, což indikuje fázi přípravy, ve které má Dungeon Master výlučnou kontrolu nad správou entit, úpravou sekvence a umisťováním objektů. Při aktivaci nového tahu server automaticky obnoví počet akcí příslušné entity na její maximum, čímž se zajistí konzistentní výchozí stav pro každý tah.

Pořadí v sekvenci je editovatelné Dungeon Masterem v přípravné fázi. Operace přesunu entity v sekvenci je realizována jako atomická záměna dvou prvků v poli, přičemž je ověřeno, že indexy prvků jsou v platném rozsahu. Tato operace je dostupná výhradně v přípravné fázi a výhradně pro Dungeon Mastera, což reflektuje tradiční model řízení stolní hry na hrdiny.

== Pohyb entit na herní mřížce

Pohybový systém je založen na dlaždicové mřížce, kde je prostor diskretizován na celočíselné souřadnice a pohyb je omezen Manhattanovou vzdáleností#footnote[Manhattanová vzdálenost je součet absolutních rozdílů souřadnic mezi dvěma body v soustavě.]. Při požadavku na pohyb server nejprve vypočítá množinu dosažitelných polí na základě parametru `staminy`, jež je dostupná pro entity typu `Character` a `Monster`. Pro každý potenciální cíl v rozsahu staminy od aktuální pozice je ověřena absence kolize se stěnou a obsazenost jiným entitou. Pouze pokud požadovaná pozice patří do této množiny, je pohyb proveden.

Pohybová akce spotřebuje jednu akci z maximálního počtu akcí dané entity v tomto tahu. Tím je zajištěno, že hráč musí strategicky plánovat, zda své akce využije na pohyb, použití schopností nebo kombinaci obojího. Serverová validace tohoto pravidla zabraňuje situaci, kdy by klient mohl odeslat pohyb s vyčerpaným akčním rozpočtem.

Na klientské straně je pohybová interpolace entit realizována prostřednictvím knihovny _react-spring_, která umožňuje plynulé přechody mezi dvěma pozicemi na herní mřížce. Tento přístup využívá princip pružinového modelu, kdy jsou parametry optimalizovány tak, aby pohyb entity působil věrohodně. Model zajišťuje vizuálně konzistentní interakci hráče s herní mapou a podporuje intuitivní vnímání pohybu, přičemž každá změna pozice je animována postupně, namísto okamžitého skoku mezi pozicemi.

== Systém schopností a bojová mechanika

Bojový systém je navržen jako automatizovaná verze klasických stolních pravidel. Každá schopnost je definována strukturou obsahující název, počet akcí na seslání, speciální effekty, dosah, cílení a rozsah účinku. Parametr `targeting` určuje typ útoku, přičemž záporné číslo znamená útok na konkrétní cíle a kladné číslo označuje plošný efekt. Tento flexibilní model umožňuje modelovat jak jednoduché útoky na jedno pole, tak plošné kouzla ovlivňující více entit současně.

Při použití schopnosti server provádí víceúrovňovou validaci. Nejprve ověří oprávnění daného uživatele a postavy. Následně zkontroluje, zda je schopnost dostupná v arzenálu entity. Poté ověří dostatečný počet akcí, platnost a vzdálenost cíle od pozice útočníka.

Výpočet poškození je realizován jako generování náhodného čísla v rozsahu definovaném schopností, od jehož výsledku je odečtena hodnota brnění zasažené entity. Celý proces je zabalen do `databázové transakce`#footnote[Sada operací, která je poslána do databáze v jednom kroku.], která zajišťuje atomicitu aktualizace životů všech zasažených entit. Pokud monstrum zemře, server navíc vyhodnotí odměnu ve formě zkušenostních bodů distribuovaných mezi všechny hráčské postavy v instanci a případný drop předmětů z inventáře monstra.

== Inventářní operace a přenos předmětů

Inventářní subsystém je ve skutečné implementaci rozdělen do více socket operací: `grant`, `transfer`, `delete`, `drop` a `equip`. Přidělení i mazání jsou vyhrazeny Dungeon Masterovi a slouží zejména pro správu scénáře, odměn nebo testování herního stavu. Přidělení je realizováno jako upsert#footnote[Operace přidávající nebo aktualizující existující záznam v databázi, pokuď již existuje.] nad inventářem postavy nebo truhly, takže při opakovaném předání stejného předmětu nevznikají duplicitní řádky, ale pouze se navyšuje množství. Po každé úspěšné změně server znovu načte instanci a rozešle aktualizovanou část dat všem klientům v daném lobby.

Při přenosu předmětů server nejprve ověří existenci zdrojové a cílové entity a zároveň zakáže operace s neplatnými typy entit. Běžný hráč může bez role Master přesouvat předměty pouze mezi vlastní postavou a truhlou; přímé přesuny mezi cizími postavami nebo jinými kombinacemi entit povoleny nejsou. Samotné odečtení množství ze zdroje a připsání do cíle probíhá v databázové transakci, takže nevzniká mezistav, ve kterém by předmět dočasně zmizel nebo byl naopak zdvojen. Operace `drop` pak slouží k bezpečnému odebrání části inventáře z postavy. Pokud je předmět právě nasazený, server nedovolí odhodit poslední aktivně vybavený kus, čímž brání vzniku nekonzistentního stavu. Samostatná operace `equip` přepíná stav vybavení a současně kontroluje omezení vybavení.

#block(breakable: false)[ ```text
ALGORITHM TransferInventoryItem(user, lobby, source, target, item, qty)
  REQUIRE lobby exists and user is member
  REQUIRE source != target
  REQUIRE source and target are character or chest
  IF user is not Master
    REQUIRE move is own_character <-> chest
  BEGIN TRANSACTION
    debit(source, item, qty)
    credit(target, item, qty)
  COMMIT
  refresh_and_broadcast(lobby)
END
``` ]

== Obchodování mezi hráči

Obchodní systém je implementován jako dvoustranná relace řízená in-memory stavem na serveru. Aktivní relace jsou uloženy v mapě `activeTradeSessions`, přičemž každá relace obsahuje dvojici účastníků, jejich nabídky, příznaky potvrzení a čas poslední změny. Prakticky významná je pomocná funkce `sanitizeOffer`, která každou přijatou nabídku okamžitě normalizuje podle skutečného inventáře postavy. Pokud tedy klient pošle vyšší množství, než skutečně vlastní, nebo neexistující předmět, server nabídku automaticky ořízne na bezpečnou hodnotu. Stejný princip je použit i pro herní měnu reprezentovanou atributem _coins_ charakteru.

Změna nabídky automaticky ruší předchozí potvrzení obou účastníků. Tím se zamezí situaci, kdy jeden hráč potvrdí obchod a druhý následně skrytě upraví svou část nabídky. K finálnímu vypořádání dochází až ve chvíli, kdy oba účastníci relace potvrdí aktuální stav. Server pak v rámci funkce `settleTrade` spustí databázovou transakci, odečte všechny nabízené předměty a měnu z inventáře prvního účastníka a připíše je druhému, a poté analogicky obráceně. Pokud se kdykoliv ukáže, že některý předmět již není dostupný v požadovaném množství, transakce skončí chybou, potvrzení se vynulují a relace zůstane otevřená pro další úpravy. Součástí modulu jsou také operace `cancel` a `list`, takže obchod může být bezpečně zrušen nebo znovu načten po obnovení klienta.

#block(breakable: false)[ ```text
ALGORITHM ConfirmTrade(user, lobby, session, actor)
  REQUIRE session belongs to lobby
  REQUIRE actor participates in session
  REQUIRE user controls actor
  mark actor as confirmed
  IF not both_confirmed(session)
    publish_session(session)
    RETURN
  BEGIN TRANSACTION
    exchange_items_and_currency(session)
  COMMIT
  close_session(session, "completed")
  refresh_and_broadcast(lobby)
END
``` ]

== Interakce s objektem ohniště

Ohniště (`campfire`) je v implementaci vytvořen jako dvojitý subsystém. V přípravné fázi kola, může _Dungeon Master_ ohniště volně přidávat, mazat a přesouvat. Při vytvoření nového ohniště server zároveň vygeneruje základní obchodní nabídku z katalogu všech předmětů a nastaví ceny podle jejich evidované hodnoty. Při přesunu je navíc kontrolováno, zda cílové pole neobsahuje stěnu, takže ohniště nelze umístit do blokované pozice.

V samotné hře plní ohniště servisní roli. Operace `rest` umožňuje řízené léčení postavy, ale ne za cenu měny. Místo toho spotřebovává zvolený počet zbývajících akcí postavy a podle pomocné funkce `calculateRestHealing` z nich odvozuje množství obnovených životů. Úprava životů i počtu zbývajících akcí probíhá v jedné transakci. Vedle toho lze přes `shop:setup` přepsat nabídku předmětů konkrétního ohniště a přes `shop:buy` nakupovat položky za `Gold Coin`. V serverové vrstvě je zde tedy hlavním validovaným kritériem oprávnění hráče, fáze hry a dostupnost měny; vzdálenost od ohniště není v této části implementace vynucována na úrovni handleru, ale může být omezena již na úrovni uživatelského rozhraní.

#block(breakable: false)[ ```text
ALGORITHM RestCharacter(user, lobby, character, actions)
  REQUIRE user controls character or is Master
  REQUIRE actions <= character.remaining_actions
  healing := calculate_rest_healing(character, actions)
  BEGIN TRANSACTION
    set character.hp := min(character.max_hp, character.hp + healing)
    set character.remaining_actions := character.remaining_actions - actions
  COMMIT
  refresh_and_broadcast(lobby)
END
``` ]

== Systém postupu na vyšší úrovně

Systém postupu na vyšší úrovně je v socket vrstvě tvořen trojicí operací `xp:info`, `xp:award` a `levelup`. Handler `xp:info` vrací klientovi informace o současné úrovni, aktuálním množství zkušeností a hranici pro další úroveň. Tato hranice je počítána vztahem `floor(100 * 1.1^(level - 1))`, takže požadavek na další úroveň postupně roste. Handler `xp:award` je vyhrazen Dungeon Masterovi a slouží k řízenému přidělení zkušeností konkrétní postavě. Tím je zachována autoritativní kontrola nad tempem postupu celé kampaně.

Samotný `levelup` může vyvolat vlastník postavy nebo Dungeon Master. Server nejprve ověří, že struktura vstupu dává smysl a že součet investovaných bodů je přesně pět. Následně z nových atributů a z aktuálního inventáře odvodí všechny sekundární statistiky pomocí funkce `calculateCharacterStats`. Prakticky je důležité, že se nepřepočítávají pouze atributy, ale také hodnoty jako maximální počet akcí, nosnost nebo odvozené maximum životů. Po úspěšném přepočtu server zvýší úroveň postavy o jedna, uloží nové statistiky a současně nastaví aktuální životy na nové maximum, takže hráč ihned vstupuje do další fáze hry se stabilním a konzistentním stavem.

#block(breakable: false)[ ```text
ALGORITHM levelUpCharacter(user, lobby, character, points)
  REQUIRE user owns character or is Master
  REQUIRE all assigned points are non-negative
  REQUIRE sum(points) = 5
  new_attributes := character.attributes + points
  stats := recalculate_stats(new_attributes, inventory)
  update character(level + 1, new_attributes, stats, hp = stats.max_hp)
  refresh_and_broadcast(lobby)
END
``` ]
#block(breakable: false)[ ```text
ALGORITHM calculateRestHealing(character, actions_spent_resting)
  base_healing := actions_spent_resting
  constitution_bonus := floor(
    (base_healing * (character.attributes.constitution * 0.15)) / 100
  )
  level_bonus := floor(base_healing * (character.level - 1) * 0.05)
  max_healing_per_action := ceil(character.max_hp * 0.2)
  total_healing := base_healing + constitution_bonus + level_bonus
  RETURN min(total_healing, actions_spent_resting * max_healing_per_action)
END
``` ]

== Správa lobby a herních místností

Systém herních místností (lobbies) je implementován jako víceúrovňová struktura, která zajišťuje jak sociální, tak herní aspekty multiplayerové interakce. Každé lobby je vlastněno uživatelem v roli Dungeon Mastera a může obsahovat více členů. Členství je spravováno prostřednictvím vazební tabulky `lobby_member` s evidencí posledního přístupu a posledního přečtení zpráv, což umožňuje implementaci nepřečtených notifikací. Na úrovni Socket.IO je tento model rozveden do šesti základních operací: `get`, `create`, `join`, `leave`, `send` a `markRead`. Díky tomu může klient po přihlášení nejprve načíst seznam svých lobby a současně se automaticky připojit do všech odpovídajících komunikačních místností `lobby:{id}`.

Komunikační systém v rámci lobby zahrnuje textový chat s ukládáním zpráv do databáze a real-time distribucí přes Socket.IO. Prakticky je důležité, že operace `join` a `send` nevracejí výsledek pouze jednomu klientovi, ale publikují jej celé místnosti pomocí _io.to(room).emit(...)_. Všichni členové tak dostávají synchronní informaci o připojení nového hráče i o nových zprávách. Naopak operace `markRead` je lokálnější povahy a potvrzuje klientovi, kdy byla jeho četba zpráv zaevidována. Tato kombinace broadcastových a lokálních událostí umožňuje oddělit sociální komunikaci od herního snapshotu a současně zachovat izolaci mezi jednotlivými relacemi.

#block(breakable: false)[ ```text
ALGORITHM SendLobbyMessage(user, lobby, content)
  REQUIRE user is member of lobby
  message := persist_message(user, lobby, content)
  publish_to_room("lobby:" + lobby.id, "lobby:send", message)
END
``` ]

== Načítání 3D modelů a správa assetů

Systém načítání 3D modelů je postaven na víceúrovňové architektuře, která zajišťuje flexibilitu a odolnost vůči chybám. Každá entita v databázi může volitelně obsahovat cestu k souboru ve formátu GLB nebo glTF#footnote[GL Transmission Format je otevřený standard pro efektivní přenos a rychlé načítání 3D scén a modelů.], který je uložen v adresáři _/public_ a servisován jako statický asset.

Načítání je realizováno lazy inicializací instance _GLTFLoader_ z knihovny Three.js, která je volána výhradně na klientské straně, aby nedocházelo k chybám v serverovém prostředí. Načtené modely jsou ukládány do paměťové cache na úrovni modulu, takže opakovaný přístup ke stejnému modelu nevyvolává nový síťový požadavek.

V případě, že model není k dispozici nebo jeho cesta je neplatná, systém automaticky přepne na parametrickou záložní geometrii — sféru pro postavy a monstra, kvádr pro truhly a kužel pro ohniště. Tento fallback mechanismus zajišťuje, že hra zůstane plně funkční i bez vlastních 3D modelů, což je zásadní jak pro vývoj, tak pro scénáře, kdy server s assety není dostupný.

#pagebreak()

= Optimalizace

Aplikace implementuje několik vrstev optimalizace, které zajišťují plynulý běh i při vysokém počtu entit a složité scéně.

== Selektory Zustand

Díky nativní podpoře selektorů v knihovně Zustand jsou komponenty odebírající stav z centrálního úložiště překreslovány pouze při změně konkrétní části stavu, kterou skutečně využívají. Tento princip je aplikován systematicky napříč celou aplikací, například komponenta tlačítka pro ukončení tahu reaguje výhradně na změnu oprávnění _canEndTurn_, nikoliv na každou změnu herního stavu.

== Memorizace komponent

Komponenty, které přijívají stabilní vstupní data, jsou obaleny do _React.memo_, čímž React přeskočí jejich vykreslení, pokud se vstupní vlastnosti referenčně nezměnily. Tato technika je využita zejména u vizuálně náročných komponent jako _Floor_, kde by zbytečné překreslení vedlo k rekalkulaci dlaždic, přepočtu viditelnosti stěn a aktualizaci instancované geometrie @react-docs.

== Visibility culling

Každá entita a vizuální prvek podléhá kontrole viditelnosti na základě vzdálenosti od kamery. Funkce _isWithinRenderDistance_ vyhodnocuje čtvercovvou vzdálenost od pozice kamery a vrací boolean hodnotu, která rozhoduje o tom, zda je prvek zařazen do vykreslovacího průchodu. Tento mechanismus efektivně redukuje počet objektů ve scéně bez nutnosti implementace pokročilého systému culling#footnote[Culling je proces odstranění objektů ze zobrazovacího bufferu, které nejsou aktuálně vidět.] na úrovni aplikační vrstvy.

#pagebreak()
#heading(numbering: none, [Závěr])

Stanovené cíle práce byly v úvodních pasážích analyzovány specifika stolních her na hrdiny a principy jejich přenosu do digitálního prostoru, přičemž tyto teoretické poznatky byly následně aplikovány pro návrh a rozvoj komplexní multiplayerové platformy. Webová aplikace byla vyvinuta jakožto zcela nový projekt, využívající moderní technologie a modulární architekturu. Nasazení projektu bylo provedeno na VPS platformy Digital Ocean zapomocí _Docker application image_ s reverse proxy _Nginx_. Aplikace se poté prokálaza dostatečně optimalizována navzdory využívání socketů na synchronizaci dat.


#heading(numbering: none, outlined: false, [Hodnocení použitých technologií], level: 2)

V rámci volby použitých technologií se jako zásadní problém ukázala volba meta-frameworku. Přestože Next.js dominuje v poli běžných webových aplikací, v kontextu vysoce dynamického serveru se v mnoha ohledech tento framework ukázal jako nevhodná primární volba. Jeho architektura, ktérá je silně orientovaná na bezstavové operace a HTTP, popřípadně HTTPs , request/response cyklus, naráží na své limity. Aplikace vyžaduje perzistentní obousměrné spojení a nízkou latenci, kterou Next.Js není schopno dodat. Vrozená omezení standardního App Routeru při správě WebSocketů si vynutila hybridní přístup a částečný návrat k nízkoúrovňovým mechanismům Node.js, které značně spomalily a znepříjemnili vývoj.
