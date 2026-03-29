#import "template.typ": thesis;

#thesis(
  name: "Návrh a implementace multiplayerové RPG webové aplikace",
  major: "Informační technologie",
  class: "ITB4",
  year: 2025,
  author: "Lukáš Pražák",
  date: datetime.today().display("[day]. [month padding:none]. [year]"),
  abstract-cs: [
    Práce se zaměřuje na návrh a implementaci webové aplikace pro hraní multiplayerové hry na hrdiny. Řešení kombinuje moderní webové technologie na straně klienta i serveru, podporuje správu herních entit, tvorbu postav a synchronizaci herního stavu v reálném čase.
  ],
  abstract-en: [
    The thesis focuses on the design and implementation of a web application for playing a multiplayer role-playing game. The solution combines modern web technologies on both client and server sides, supports game entity management, character creation, and real-time game state synchronization.
  ],
  keywords-cs: [
    multiplayer, webová aplikace, RPG, Next.js, TypeScript
  ],
  keywords-en: [
    multiplayer, web application, RPG, Next.js, TypeScript
  ],
  body: [
    #include "thesis.typ";
  ],
  assignment: [
    Cílem práce je návrh a implementace webové aplikace umožňující hraní multiplayerové hry na hrdiny inspirované systémem Dračím doupětem. Hlavní součástí aplikace bude správa herních entit (např. tříd, kouzel a předmětů) a podpora herního režimu, v němž jeden hráč zastává roli tzv. Dungeon Mastera, zatímco ostatní hráči představují jeho družinu.

    Frontend aplikace bude realizován v prostředí React s využitím knihovny Tailwind CSS, pro vizualizaci trojrozměrných prvků bude nasazen framework React Three Fiber. Serverová část bude vybudována na platformě Next.js a Node.js. Komunikace mezi klientem a serverem v reálném čase bude zajištěna pomocí knihovny Socket.IO. Data budou ukládána do databázového systému PostgreSQL a statické soubory (3D modely, obrázky) budou spravovány prostřednictvím objektového úložiště MinIO S3.

    Součástí aplikace bude modul pro tvorbu a správu postav, které si hráči mohou definovat na základě dostupných tříd, kouzel a předmětů. Dále bude implementována funkce tvorby multiplayerových lobby, kde se hráči sdružují do skupin a jeden z nich přebírá roli Dungeon Mastera. Aplikace bude podporovat tahový boj i interakce v reálném čase a zajistí plynulý průběh herních sezení.
  ],
  acknowledgements: [
    Rád bych poděkoval vedoucímu své maturitní práce Mgr. Matěji Brožkovi za odborné vedení, připomínky a pomoc při jejím zpracování.
  ],
  declaration: [
    Prohlašuji, že jsem tuto práci vypracoval/a samostatně a uvedl/a v ní všechny prameny, literaturu a ostatní zdroje, které jsem použil/a. Při tvorbě této práce jsem použil GitHub Copilot (#link("https://github.com/features/copilot")). Po použití těchto nástrojů jsem provedl kontrolu obsahu a přebírám za něj plnou odpovědnost.
  ],
)
