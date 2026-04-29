# Scout Panel LDP

Aplicacion full stack para scouting de futbolistas. El proyecto combina una API REST en Express + Prisma con un cliente Next.js orientado a busqueda, filtrado y comparacion de jugadores.

## Puntos fuertes

- Dataset de jugadores normalizado y tipado en `server/prisma/seed.ts`.
- Separacion clara entre datos base, perfiles estadisticos por rol, ajustes individuales y overrides por temporada.
- Filtros combinables por busqueda, posicion, nacionalidad, pais del club y rango de edad.
- Paginacion server-side con limite configurable.
- Comparacion de 2 a 3 jugadores por temporada.
- Validacion de entrada con Zod para queries, parametros y rangos invalidos.
- Manejo centralizado de errores y respuestas consistentes.
- Prisma + PostgreSQL para persistencia relacional.
- Frontend con Tailwind, paleta LDP y flujo de scouting responsive.

## Stack

- Server: Node.js, Express, TypeScript, Prisma, PostgreSQL, Zod, Vitest.
- Client: Next.js, React, Tailwind CSS, lucide-react.

## API

Base local por defecto:

```bash
http://localhost:4000
```

Endpoints principales:

```bash
GET /health
GET /api/players
GET /api/players/:id
GET /api/players/compare?ids=<id1>,<id2>[,<id3>]&seasonId=<seasonId>
GET /api/teams
GET /api/teams/:id
GET /api/seasons
GET /api/seasons/latest
```

Filtros disponibles en `GET /api/players`:

```bash
search
position
nationality
teamCountry
minAge
maxAge
page
limit
```

Ejemplo:

```bash
GET /api/players?nationality=Argentina&position=Delantero&minAge=20&maxAge=30&page=1&limit=10
```

## Instalacion

### Server

```bash
cd server
npm install
docker compose up -d
npx prisma migrate dev
npm run db:seed
npm run dev
```

### Client

```bash
cd client
npm install
npm run dev
```

URL local del cliente:

```bash
http://localhost:3000
```

## Scripts utiles

Server:

```bash
npm run dev
npm run build
npm run test
npm run db:seed
```

Client:

```bash
npm run dev
npm run build
npm test
```

## Variables de entorno

Server:

```bash
DATABASE_URL=postgresql://...
```

Client:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Los archivos `.env.example` quedan versionados como referencia. Los `.env` reales estan ignorados por Git.
