# Mystique

Interaktivní webová aplikace pro hraní her s real-time multiplayer prvky. Systém je postavený na Next.js 16 s React 19, Socket.IO pro real-time komunikaci, PostgreSQL databází a MinIO pro ukládání souborů.

## Tech Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **Stav aplikace:** Zustand
- **Real-time komunikace:** Socket.IO
- **Databáze:** PostgreSQL + Drizzle ORM
- **Úložiště souborů:** MinIO (S3-kompatibilní)
- **UI komponenty:** Radix UI + Tailwind CSS 4
- **3D rendering:** Three.js + React Three Fiber
- **Autentifikace:** Better Auth

## Instalace

### Předpoklady

- Node.js 18+ nebo Bun
- Docker a Docker Compose (pro databázi a MinIO)
- Git

### Kroky instalace

1. **Instalujte závislosti:**

```bash
# Pokud používáte Bun (doporučeno)
bun install

# Nebo npm (platí i pro následující příkazy)
npm install
```

2. **Zkopíruje konfigurační soubor `.env.example` do `.env`**

```bash
cp .env.example .env
```

3. **Spusťe Docker:**

```bash
docker compose up -d
```

4. **Inicialisujte databázi:**

```bash
# Aplikujte Drizzle schéma
bun run db:push
# Naplňte databázi testovacími daty
bun run db:seed
```

5. **Sestavte server**

```bash
bun run build
```

6. **Spusťe server**

```bash
bun run start
```

Server se spustí na `http://localhost:3000`

## Použití

### Základní navigace

1. **Přihlášení:** Navštivte `http://localhost:3000/auth` a přihlaste se nebo si vytvořte nový účet
2. **Dashboard:** Po přihlášení vidíte přehled vašich postav a dostupných her
3. **Hra:** Klikněte na postavu a vstupte do herního světa

### Hlavní funkce

- **Správa postav:** Vytváření, úpravy a mazání herních postav
- **Inventář:** Správa předmětů a vybavení
- **Lobby:** Vytváření a připojování se k herním sezením
- **Real-time hra:** Live multiplayer hrání se synchronizací stavů
- **Nastavení:** Úprava profilu, e-mailu a avataru

## Struktura projektu

```
src/
├── app/              # Next.js stránky a layouty
├── components/       # React komponenty (UI, hra, inventář, layout)
├── hooks/            # Custom React hooks (Zustand stores)
├── lib/              # Business logika (hra, databáze, autentifikace)
├── pages/api/        # API routy a Socket.IO handlers
└── socket/           # Real-time event handlery
db/                   # Drizzle schéma a seed skripty
public/               # Statické assety (textury, 3D modely)
```

