# úvod

Žánr deskových her na hrdiny se stal jedinečným typem herových systémů, které spojují prvky vypravěčského vyprávění, strategického rozhodování a pravidelně řízených interakcí mezi hráči. Patří sem nejznámější deskové hry na hrdiny systému Dungeons & Dragons a jeho český analog Dračí doupě, které se staví na spolupráci skupinového hráče se skupinou hráčů řízených jedním hráčem jako Dungeon Masterem. Dungeon Master je odpovědný za řízení herového světa a interpretaci pravidel, zatímco hráči ovládají jednotlivé herové postavy.

S rozvojem aplikací a online prostředí se tyto hry začínají objevovat i v online prostředí. To s sebou přináší řadu výhod, jako je možnost jednodušeji dostupné hry, možnosti hraní na dálku, automatizace provádění pravidel nebo obohacení hry o multimediální prvky. Hraní her tohoto typu ale klade vysoké nároky na konstrukci aplikace, synchronizaci dat mezi hráči a udržení plynulosti hry.

Cílem této práce je návrh a implementace webové aplikace umožňující hraní multiplayerové hry na hrdiny inspirované Dračí doupětem. Aplikace je navržena tak, aby sloužila jako plnohodnotná herní platforma zahrnující správu herních jednotek, tvorbu a úpravu postav, správu multiplayerových utkání a vedení samotné hry. Důraz je kladen na využití moderních technologií pro web a na maximální možnosti dalšího rozšiřování ​‍​‌‍​‍‌aplikace.

# Architektura

Pro aplikaci bylo zvoleno schéma klient-server, které je běžným standardem pro vývoj webových aplikací. Architektura klient-server umožňuje čisté oddělení klientského kódu od serverového, což umožní bezpečnost serveru a jeden zdroj pravdy.

Klientská část aplikace běží přímo v webovém prohlížeči a představuje rozhraní mezi uživatelem a aplikací. Její hlavní úlohou je zobrazování uživatelského rozhraní, zpracovávání uživatelských vstupů a zobrazování aktuálního herního stavu. Klientská část aplikace s serverem komunikuje pomocí síťových požadavků a reaguje v reálném čase na změny.

Části aplikace, které se zabývají jsou prováděny na serveru a jsou zde umístěny rozhodící autoritativní a autentizační část celého systému. Zajišťuje také správu herních stavů, ověřování tahů hráčů, přihlášení a legitimaci uživatele a komunikační funkce s databází. Server také zajišťuje komunikační funkce s jednotlivými klienty a provádí synchronizaci dat v reálném čase s cílem zajištění ​‍​‌‍​‍‌konzistence.

# Programovací jazyky

Výběr programovacího jazyka pro fullstack aplikace je extrémně důležité pro rychlost vývoje i stabilnost takového systému. V tomto projektu bude kombinován moderní standard jazyka JavaScriptu se jeho typovou nadstavbou TypeScriptem.

## JavaScript

JavaScript je hlavním programovací jazykem pro web a jediným nativním webovým jazykem pro logiku na straně klienta, který je podporován všemi moderními prohlížeči. Pro účely této publikace je jazyk JavaScript velice důležitý, protože se jedná o dynamicky interpretovaný jazyk s asynchronV kontextu této aplikace je jazyk JavaScript využíván hlavně prostřednictvím jeho současného standardu ECMAScript. Ten poskytuje účelnou manipulaci asynchronními proudy dat prostřednictvím konstrukcí async a await, což je nesmírné požadavku pro interakce s serverem i databází. Také kvůli neblokujícím vstupu a výstupu je jazyk JavaScript nejvhodnějším pro aplikace vyžadující vysoké interaktivní hodnoty, jako jsou systémy reálného času, kde je zapotřebí zpracování velké množství vstupů od různých uživatelů současně bez prodlení.

## TypeScript

TypeScript je staticky typovaná nadstavba JavaScriptu. Pro vývoj komplexní multiplayerové platformy je TypeScript zvolen jako klíčový nástroj pro zajištění udržitelnosti a bezpečnosti kódu. TypeScript neexistuje jako samostatný runtime, ale v procesu sestavování aplikace je transpilován do čistého JavaScriptu.

Hlavním přínosem TypeScriptu je zavedení striktního typového systému. V případš, kde existuje velké množství provázaných entit s různými atributy, umožňuje TypeScript definovat přesné datové kontrakty. Pokud vývojář definuje strukturu, kompilátor během psaní kódu vynucuje správné používání všech parametrů. Tím dochází k eliminaci běžných programátorských chyb již ve fázi vývoje, nikoliv až při běhu aplikace u koncového uživatele.

TypeScript rovněž poskytuje pokročilé funkce, jako jsou rozhraní a generické typy. Ty jsou v projektu využity pro tvorbu znovupoužitelných komponent a funkcí, které mohou pracovat s různými datovými typy při zachování plné typové kontroly. Tato technologie tvoří nezbytný podklad pro fungování knihoven jako Drizzle ORM, které na typové bezpečnosti přímo staví svou architekturu.

# Použité technologie

Výběr technologií na vývoj komplexní aplikace s multiplayer podporou je rozhodujícím bodem, který určuje nikoli pouze možnosti dalšího rozvoje, ale také omezení výkonu, bezpečnosti a udržitelnosti vyvinutého kódu. Pro vývoj platformy na bázi hry Dungeons & Dragons byly vybrane technologie, které představují aktuální špičku na poli vývojových technologií webových aplikací. Značný důraz byl kladen na modulárnost, rozšiřitelnost a efektivní zpracování dynam

## Next.JS

Jako základy technologie pro moderne webové aplikace se dnes často používají tzv. meta-frameworky navržené nad knihovnou React. Takové frameworky reagují na omezení klasických přístupů, které se soustředí jenom na Single Page Applications, a rozšiřují ho o pokročilé mechanismy pro renderování, routování a optimalizaci přenosu dat. Cílem takových frameworků je sjednotit vývoj obou částí klienta a serveru jedné aplikace v jediném prostředí a nabídnout flexibilní architekturu, která bude reagovat podle rozdílných potřeb obou částí systému

### App Router

Srdcem frameworku je App Router, což je zásadnější změna v architektuře než klasické routing. App Router je založen na specifikaci React Server Components (RSC). Jeho velkou výhodou je možnost definovat komponenty, které se na serveru vykreslí a na klienta nikdy nepostupují ve formě spustitelného JavaScript kódu.

1. Server Components
   - V App Routeru jsou všechny komponenty ve výchozím nastavení serverové. Při požadavku na stránku server provede renderování React stromu. Výsledkem není HTML string (jako u klasického SSR), ale speciální textový formát zvaný RSC Payload. Tento payload obsahuje serializovanou reprezentaci UI stromu, odkazy na klientské komponenty a předpočítaná data. Klient (prohlížeč) tento stream postupně zpracovává a rekonstruuje DOM. Díky tomu je možné přistupovat k databázi nebo souborovému systému přímo v těle komponenty (pomocí async/await), aniž by bylo nutné vytvářet API endpointy.

2. Client Components
   - Pro interaktivní prvky se využívají klientské komponenty označené direktivou 'use client'. Next.js inteligentně odděluje kód těchto komponent a posílá je klientovi jako separátní JavaScriptové balíčky nazývané _"chunks"_. Dochází tak k _"hydrataci"_, kdy se na serverem vyrenderované HTML "naváže" klientská logika.

Tento model hybridního renderování zajišťuje, že statické části rozhraní nezatěžují hlavní vlákno prohlížeče, zatímco dynamické části zůstávají plně interaktivní.

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

Architektura Next.js poskytuje volbu běhového _runtime_ pro keždou danou cestu zvlášť, stejně jako Node.js.

- Node.js
  - Používá se v většině aplikace
  - Hlavním nedostatkem je nižší výkon a závislost na modulech.
  - Využití: WebSocket server, procesy skz Drizzle ORM. Plná podpora server API jako low Level API.

- Edge Runtime
  - Je založen na V8 isolation
  - Vysoce optimalizovaný kód
  - Musí běžet s minimální latencí
  - Využití: middleware pro ověřování přístupů nebo proxy pro ověřování autentizací.

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

Efektový hook se jmenuje hook useEffek a je používáno jako náhrada pro starší životní cyklus v podobě soběstačné metody. Jedná se o způsob, jak napojit na životní cyklus React komponentu, který se spustí jen v případě, že se hodnota jeho „závislostí“ změní. Pokuď se funkce v useEffekt napojuje na DOM strukturu je potřeba vždy vyčistit _"event listenery"_ na konci životního cyklu aplikace.

Referenční hook useRef umožňuje uchovat referenci na hodnotu, která přetrvává mezi rendery, ale jejíž změna nevyvolává nové vykreslení. Využíván je především na reference HTML elementů a udržování více verzí hodnot jednoho parametru.

### React Server Components

I když Next.js podporuje routing zahrnující server-side komponenty, samotný mechanismus RSC je součástí Reactu. Hlavním odlišným faktorem v porovnání s tradiční SSR je seriazizace. Na serverovém nástroji se totiž komponenty nezpracovávají na různé html prvky, ale dělají to na velmi specifickou strukturu. Takže React na straně klienta sloučí nově doručené serverové informace spolu s údajemi již existujících stavú klientských komponent, velmi praktičtí nástroj na obhospodařovávání komponent a rychlého vykreslování.

### Immutabilita a referenční ident

Důležitý princip pro efektivní práci s detekcí změn ve Reactu je právě nedokončenost dat. V jazyku JavaScript jsou objektu a rozsahu posílána reference. Kulturní objekt s proměnností veadratickým způsobem přímo na míre-findu několi by bylo ve Reactu

V zařízení React se využívá takzvaný „_Shallow Comparison_“ místo hlubokého rozboru struktur vnořených objektech. Oproti tomu knihovna místo hlubokého rozboru rozdílnou hodnotou jednotlivě srovnávané objekty pouze jejich

Pokud se reference na objekt nezměnila, React uměl progressDialoguecalled zapomenula, že se.data nezměnil内部, a přeskočídifficil获取runtime proces renderování. Pro instance festival.applicative, aby musela měnit komponentu rins, když se aktualizovala.data state Pavel musela vytvořit úplně fresh nový instance objektu, takže by se měnil også reference na objekt. Takhle.aldrin princip Eugineaders_annotations,rectticky

### React Compiler

Významnou inovací použitou v projektu je nasazení React Compileru. V předchozích verzích Reactu, do verze 19, byla optimalizace renderování z velké části manuální odpovědností vývojáře. Aby se předešlo zbytečnému vytváření nových instancí funkcí a objektů při každém vykreslení, museli vývojáři obalovat kód do hooků useMemo, který slouží pro hodnoty, a useCallback, jenž složí pro funkce.

React Compiler tento proces automatizuje na úrovni sestavování. Analyzuje sémantiku kódu a datové toky uvnitř komponent a automaticky _"memorizuje"_ hodnoty, které nezávisí na změněných vstupech. V praxi to znamená, že pokud se změní data ve vyším komponentu, tak ne všechny _pod-komponenty_ budou muset být znovu sestaveny.

## Databáze

Architektura backendu stojí na robustním řešení pro persistenci a správu dat. Vzhledem ke komplexitě herních mechanik, které vyžadují jak striktní relační vazby , tak flexibilní struktury pro variabilní herní entity, bylo zvoleno spojení osvědčené databáze PostgreSQL a moderní abstraktní vrstvy Drizzle ORM.

### PostgreSQL

Jako primární databázové úložiště byl vybrán PostgreSQL, pokročilý open-source objektově-relační databázový systém. Jeho volba v kontextu vývoje multiplayerové RPG hry vychází z několika klíčových vlastností, které zajišťují stabilitu, integritu a výkon.

Základní kritériem pro databázi je zajištění konzistence dat i při selhání systému nebo více souběžných požadavcích. PostgreSQL plně podporuje ACID model - Atomicity, Consistency, Isolation a Durability. To znamená, že herní operace probíhají jako atomické transakce. Při obchodování mezi hráči, třeba když hráč A dá hráči B předmět výměnou za měnu, databáze zajistí, že odečtení předmětu, přidání předmětu a převod peněz nastanou v jednom kroku. Pokud dojde k selhání kterékoliv části, transakce se vrátí a nedojde k situaci, kdy by zmizel předmět, ale peníze by zůstaly nepřevodné.

Ačkoliv je PostgreSQL relační databází, pro moderní aplikace nabízí silnou podporu pro práci s nestrukturovanými daty pomocí datového typu JSONB. Tento formát umožňuje ukládat JSON dokumenty v binární, indexovatelné podobě přímo do sloupce tabulky. Pro RPG hru je tato vlastnost kritická. Zatímco základní entity mají pevnou strukturu, rozšiřující entity mají mnoho proměných, které mohou, ale nemusí být přístupny pro všechny entity ve stejné tabulce. Místo vytváření desítek sloupců s hodnotami NULL pro každý možný atribut, využívá databáze sloupec metadata typu JSONB. PostgreSQL umožňuje nad klíči uvnitř tohoto JSON objektu vytvářet zobecněnýy převrácený index nazývaný: GIN index, což umožňuje extrémně rychlé vyhledávání s výkonem srovnatelným s NoSQL databázemi.

K tomu využívá také technologii MVCC (Multi-Version Concurrency Control). S její pomocí můžou probíhat čtecí operace i operace zápisu paralelně bez toho, aby se sečetly, a takové operace nezamezují, ani nerozptylují veškerý tok operačního systému. To je nezbytné pro udržení nízké latence, při vícero real-rime připojení.

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

Pro​‍​‌‍​‍‌ práci s propojenými daty nabízí Drizzle zjednodušené Relational Query API. To umožňuje vývojářům načítat hierarchická data deklarativně, podobně jako v GraphQL nebo Prisma ORM. Drizzle interně optimalizuje tyto požadavky, aby předešel problému N+1, situaci, kdy aplikace pro každou položku seznamu posílá do databáze samostatný dotaz.

Podle struktury dat a použitého databázového ovladače Drizzle buď zkompiluje požadavek do jednoho efektivního SQL dotazu, nebo data načte paralelně v minimálním počtu kroků a spojí je na úrovni aplikace. Tím zajišťuje optimální výkon i při složitých datových ​‍​‌‍​‍‌strukturách.

Součástí ekosystému je nástroj Drizzle Kit, který automatizuje správu změn v databázi. Porovnává aktuální schéma definované v TypeScriptu se snapshotem předchozího stavu a generuje SQL migrační soubory. Tento proces zajišťuje, že vývoj databáze je verzovaný, transparentní a bezpečně replikovatelný napříč vývojovým, testovacím a produkčním prostředím.

## Tailwind CSS

Pro definici vizuální podoby uživatelského rozhraní a tvorbu responzivního designu byla zvolena knihovna Tailwind CSS. Na rozdíl od tradičních CSS knihoven, které nabízejí předpřipravené komponenty,

### Utility-First paradigma

Základem Tailwind CSS je koncept Utility-First. Namísto vytváření sémantických tříd, které v sobě nesou desítky deklarací, framework poskytuje atomické třídy reprezentující jednotlivé CSS vlastnosti. V kontextu aplikace tento přístup přináší několik klíčových výhod:

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

Aplikace využívá centrální konfigurační soubor, který umožňuje rozšíření základníh knihovny o specifické prvky. Tento soubor je od verze Tailwind CSS v4 psán v podobě souoru css, ve kterém se pre-definují kaskádové styly. Do konfiguračního souboru jsou zaneseny vlastní barevné palety, specifické fonty a definice animací.Díky integraci s TypeScriptem jsou tyto vlastní třídy plně typované. Pokud vývojář definuje v konfiguraci novou barvu, editor mu ji automaticky nabídne, čímž se minimalizuje riziko vzniku chyb v designu.

## Zustand

Pro​‍​‌‍​‍‌ zacházení s globálním stavem aplikací je použita knihovna Zustand. Jde o moderní a jednoduché řešení pro správu stavů v Reactu, které se vyznačuje tím, že je minimalistické, má nízké režie.

Zustand funguje na principu centrálního úložiště, označovaného jako Store. Na rozdíl od komplexních knihoven, jako je Redux, Zustand nevyžaduje obalování aplikace do mnoha _"kontextových poskytovatelů"_, což eliminuje problém zvaný _"Provider Hell"_ a zjednodušuje celkovou strukturu projektu.

Stav v úložišti je imutabilní a lze jej měnit pouze pomocí definovaných akcí. To zajišťuje, že změny v stavu jsou predikovatelné a snadno sledovatelné.

Úložiště se v komponentách používá formou vlastních React hooků. To umožňuje vývojářům přistupovat k datům i k funkcím pro jejich aktualizaci pomocí intuitivního a čistého zápisu.

Jednou z nejvýznamnějších vlastností knihovny Zustand, která je pro vývoj náročné webové aplikace klíčová, je nativní podpora selektorů. Selektory umožňují komponentám odebírat pouze ty části stavu, které jsou pro jejich funkci nezbytné.

Zustand vyniká svou schopností snadno integrovat asynchronní logiku přímo do akcí úložiště. Toho je v projektu využito především pro synchronizaci s API a real-time aktualizace. Díky podpoře middleware funkcí umožňuje Zustand snadnou implementaci perzistence. Vybrané části stavu, jsou automaticky ukládány do lokálního úložiště prohlížeče.

