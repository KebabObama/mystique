#let thesis = (
  name: "Webová hra na hrdiny pro více hráčů",
  major: "Informační technologie",
  class: "ITB4",
  year: "2025/2026",
  author: "Lukáš Pražák",
  abstract-cs: par([
    Práce se zabývá tvorbou webové aplikace, jejímž cílem je přivést zpět herní mechaniky nejen z první edice, ale i z původních plánovacích herních systémů, do současné edice hry D&D. Teoretická část obsahuje porovnání a shrnutí her žánru RPG a jejich herních mechanik, se zaměřením na tvorbu postav a statistická schémata doprovázející charaktery pomocí předmětů, schopností a dočasných bonusů. Praktická část se věnuje návrhu a implementaci webové hry využívající moderní webové technologie. Důraz je kladen na tvorbu herního jádra podporujícího real-time komunikaci mezi hráči, správu kampaní a flexibilitu systému.
  ]),
  abstract-en: par([
    This thesis deals with the creation of a web application, whose goal is to bring back game mechanics, not only from the first edition, but also from the original planning game systems, to the current edition of D&D. The theoretical part contains a comparison and summary of RPG games and their game mechanics, focusing on character creation and statistical schemes accompanying characters using items, abilities, and temporary bonuses. The practical part is devoted to the design and implementation of a web game using modern web technologies. Emphasis is placed on the creation of a game core that supports real-time communication between players, campaign management, and system flexibility.
  ]),
  keywords-cs: par([
    Dungeons & Dragons, hra pro více hráčů, komunikace v reálném čase, webová aplikace, videohra
  ]),
  keywords-en: par([
    Dungeons & Dragons, multiplayer, real-time communication, webová application, videogame
  ]),
  acknowledgements: par([
  ]),
  assignment: par([
    Cílem práce je návrh a implementace webové aplikace umožňující hraní multiplayerové hry na hrdiny inspirované systémem Dračím doupětem. Hlavní součástí aplikace bude správa herních entit (např. tříd, kouzel a předmětů) a podpora herního režimu, v němž jeden hráč zastává roli tzv. Dungeon Mastera, zatímco ostatní hráči představují jeho družinu.
    Frontend aplikace bude realizován v prostředí React s využitím knihovny Tailwind CSS, pro vizualizaci trojrozměrných prvků bude nasazen framework React Three Fiber. Serverová část bude vybudována na platformě Next.js a Node.js. Komunikace mezi klientem a serverem v reálném čase bude zajištěna pomocí knihovny Socket.IO. Data budou ukládána do databázového systému PostgreSQL a statické soubory (3D modely, obrázky) budou spravovány prostřednictvím objektového úložiště MinIO S3.
    Součástí aplikace bude modul pro tvorbu a správu postav, které si hráči mohou definovat na základě dostupných tříd, kouzel a předmětů. Dále bude implementována funkce tvorby multiplayerových lobby, kde se hráči sdružují do skupin a jeden z nich přebírá roli Dungeon Mastera. Aplikace bude podporovat tahový boj i interakce v reálném čase a zajistí plynulý průběh herních sezení.
  ]),
)

#set par(first-line-indent: (amount: 2em, all: true))

= Úvod

S popularitou digitálních zábav stále více proniká využívání herních principů i jinde než v čistě herních prostředích. 
Jedním z příkladů posledních let je přenos prvků stolních her, zejména systému Dungeons & Dragons, do videohry. @rpg-growth 
Tyto aplikace normálně usnadňují hráčům sdílet herní zkušenosti on-line přes internet, 
provádět automatizaci u konkrétních herních metod a sjednotit kreativní vyprávění hráčů s již hotovým herním prvkem.

Spolu s rozšiřováním online komunity žánru her na hrdiny (dále ji budu označovat jako RPG) narůstá i poptávka po nástrojích a hrách, které by ji podporovaly. 
Tradiční „papírové“ hraní se tak přirozeně transformuje do digitálního formátu. S tímto fenoménem však nastává problém, který většina vývojářů ignoruje, 
a tím je vytrácení ducha a mechanické hloubky první edice Dungeons & Dragons a dalších původně deskových her.

Cílem této práce je navrhnout a implementovat webovou aplikaci, 
která se pokusí tato původní pravidla a zapomenuté nápady vrátit zpět do hry. Aplikace bude tvořena ve frameworku Next.JS, 
za pomocí React Three fiber a má sloužit jako platforma pro tvorbu postavy a následné hraní s ní ve hře. 
Během hraní v partiích od tří do osmi hráčů, kde jeden z hráčů bude znít role tzv. "dungeon mastera", 
jehož úkolem je vytvářet prostředí pro hráče a má ovlivňovat všechny aspekty hry.

Účelem teoretické části je zkoumat raný vývoj edic Dungeons & Dragons pro jejich porovnání s moderními přístupy a analyzovat motivace pro opuštění určitých konceptů. 
Praktická část se bude věnovat návrhu a vývoji samotné webové aplikace a jejímu testování a ověření přínosu pro dosažení stanovených cílů.

#pagebreak()
