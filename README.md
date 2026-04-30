# Scout Panel LDP

Aplicación full stack para scouting de futbolistas. Incluye una API REST con Node.js, Express, TypeScript, Prisma y PostgreSQL, más un cliente web hecho con Next.js, React y Tailwind CSS.

El panel permite buscar jugadores, aplicar filtros, revisar datos principales y comparar métricas por temporada en una escala normalizada.

## Contenido

- [Features](#features)
- [Stack](#stack)
- [Arquitectura](#arquitectura)
- [Requisitos](#requisitos)
- [Variables de entorno](#variables-de-entorno)
- [Instalación](#instalación)
- [Credenciales demo](#credenciales-demo)
- [Endpoints](#endpoints)
- [Scripts](#scripts)
- [Problemas comunes](#problemas-comunes)
- [Verificación](#verificación)

## Features

| Área | Incluye |
| --- | --- |
| API | Endpoints REST para jugadores, equipos, temporadas y autenticación |
| Base de datos | PostgreSQL con Docker y Prisma Migrate |
| Datos iniciales | Seed con 30 jugadores, equipos, temporadas y estadísticas |
| Búsqueda | Filtros por texto, posición, nacionalidad, país del club y edad |
| Jugadores | Vista de listado y detalle individual |
| Comparación | Selección de 1 a 3 jugadores por temporada |
| Visualización | Métricas normalizadas y gráficos comparativos |
| Seguridad | JWT para proteger las rutas del panel |

## Stack

| Backend | Frontend | Infra / tooling |
| --- | --- | --- |
| Node.js | Next.js | Docker Desktop |
| Express | React | PostgreSQL |
| TypeScript | Tailwind CSS | Prisma |
| Zod | lucide-react | Vitest |
| JWT | | npm |

## Arquitectura

### Backend

El backend está organizado con una idea cercana a arquitectura hexagonal, sin aplicarla de forma rígida para no sobredimensionar el challenge.

```bash
server/
  prisma/       # Schema, migraciones y seed
  src/
    config/     # Configuración de entorno
    lib/        # Clientes compartidos
    middlewares/
    modules/    # Dominios de negocio
    shared/     # Utilidades y errores reutilizables
```

La separación principal es:

| Capa | Responsabilidad |
| --- | --- |
| `routes` | Definir endpoints HTTP |
| `schemas` | Validar inputs con Zod |
| `controllers` | Recibir la request y delegar |
| `services` | Concentrar reglas de aplicación |
| `repositories` | Encapsular el acceso a Prisma |
| `mappers` | Transformar modelos de base de datos en respuestas de API |
| `shared` | Reutilizar utilidades, errores y helpers |

Esta estructura evita mezclar reglas de negocio con Express o Prisma. Si mañana cambia la persistencia o se agregan nuevos endpoints, el impacto queda más acotado.

### Modelado y seed

El schema usa relaciones claras entre `Team`, `Player`, `Season` y `PlayerStats`.

Se separan temporadas y estadísticas para que un jugador pueda tener datos en distintos años sin duplicar su información base. El seed carga jugadores con clubes, nacionalidades permitidas y estadísticas en varias temporadas para probar filtros, detalle y comparación de forma realista.

El seed también valida casos que podrían generar errores silenciosos:

- jugadores sin equipo existente;
- equipos sin jugadores;
- nacionalidades fuera del conjunto esperado;
- roles o posiciones inválidas;
- overrides apuntando a jugadores inexistentes.

### Frontend

El hook principal del panel se divide en piezas chicas dentro de `client/src/hooks/scoutPanel`:

| Hook / módulo | Responsabilidad |
| --- | --- |
| `usePlayerCatalog` | Carga jugadores, temporadas, filtros y paginación |
| `usePlayerDetail` | Maneja el jugador activo |
| `usePlayerComparison` | Maneja selección, comparación y errores de métricas |
| `scoutPanelFilters` | Contiene lógica pura de filtrado |
| `compareMetrics` | Deriva métricas y scores normalizados |
| `useScoutPanel` | Expone una fachada única para los componentes |

Con esto se evita mezclar lógica pura, reglas de negocio y renderizado dentro de un mismo componente.

### Comparación de métricas

Las estadísticas crudas no siempre son comparables directamente. Por ejemplo, un jugador puede acumular muchos pases completados por haber jugado más minutos, mientras otro puede destacar en eficacia o acciones por 90 minutos.

Por eso las métricas se transforman a una escala de `0` a `100`, donde `100` representa el máximo esperado para esa habilidad. Esta normalización permite que el radar y la tabla comparen dimensiones distintas sin que una métrica de volumen rompa la lectura visual.

La lógica vive en:

```bash
client/src/hooks/scoutPanel/compareMetrics.js
```

Durante la actualización de comparaciones, la UI mantiene visible el último gráfico con una transición suave y un indicador `Actualizando`, para conservar contexto mientras se recalculan los datos.

## Requisitos

Instalar previamente:

| Herramienta | Versión recomendada |
| --- | --- |
| Node.js | 20 o superior |
| npm | Incluido con Node |
| Docker Desktop | Versión estable |
| Git | Versión estable |

Verificación rápida:

```bash
node -v
npm -v
docker -v
git --version
```

## Estructura del proyecto

```bash
scout-panel-ldp/
  client/   # Aplicación web con Next.js
  server/   # API, Prisma, Docker y base de datos
```

## Variables de entorno

El proyecto no sube los archivos `.env` reales. En su lugar incluye archivos `.example` como plantilla.

### Server

Desde `server`:

```powershell
Copy-Item .env.example .env
```

Contenido esperado:

```bash
DATABASE_URL="postgresql://scout:scout123@localhost:5432/scout_panel?schema=public"
PORT=4000
NODE_ENV=development
JWT_SECRET="dev-secret-change-before-production"
JWT_EXPIRES_IN="8h"
```

### Client

Desde `client`:

```powershell
Copy-Item .env.local.example .env.local
```

Contenido esperado:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Instalación

Abrir una terminal en la raíz del proyecto.

### 1. Levantar PostgreSQL

```bash
cd server
docker compose up -d
docker ps
```

El contenedor usa:

| Dato | Valor |
| --- | --- |
| Usuario | `scout` |
| Password | `scout123` |
| Base de datos | `scout_panel` |
| Puerto local | `5432` |

### 2. Preparar el backend

```bash
npm install
npm run db:migrate
npm run db:generate
npm run db:seed
npm run dev
```

La API queda disponible en:

```bash
http://localhost:4000
```

Health check:

```bash
http://localhost:4000/health
```

### 3. Preparar el frontend

Abrir otra terminal desde la raíz del proyecto:

```bash
cd client
npm install
npm run dev
```

El cliente queda disponible en:

```bash
http://localhost:3000
```

## Arranque rápido

Terminal 1:

```bash
cd server
docker compose up -d
npm install
npm run db:migrate
npm run db:generate
npm run db:seed
npm run dev
```

Terminal 2:

```bash
cd client
npm install
npm run dev
```

Abrir:

```bash
http://localhost:3000
```

## Credenciales demo

El seed crea un usuario para probar el panel:

| Campo | Valor |
| --- | --- |
| Email | `scout@ldp.test` |
| Password | `Scout1234` |

## Endpoints

| Método | Ruta | Auth | Descripción |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Estado de la API |
| `POST` | `/api/auth/register` | No | Registro de usuario |
| `POST` | `/api/auth/login` | No | Login y obtención de token |
| `GET` | `/api/auth/me` | Sí | Usuario autenticado |
| `GET` | `/api/players` | Sí | Listado y filtros de jugadores |
| `GET` | `/api/players/:id` | Sí | Detalle de jugador |
| `GET` | `/api/players/compare` | Sí | Comparación de jugadores |
| `GET` | `/api/teams` | Sí | Listado de equipos |
| `GET` | `/api/teams/:id` | Sí | Detalle de equipo |
| `GET` | `/api/seasons` | Sí | Listado de temporadas |
| `GET` | `/api/seasons/latest` | Sí | Última temporada disponible |

Header para rutas protegidas:

```bash
Authorization: Bearer <token>
```

Ejemplo de filtro:

```bash
GET /api/players?nationality=Argentina&position=Delantero&minAge=20&maxAge=30&page=1&limit=10
```

Ejemplo de comparación:

```bash
GET /api/players/compare?ids=<id1>,<id2>,<id3>&seasonId=<seasonId>
```

## Scripts

### Server

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Levanta la API en desarrollo |
| `npm run build` | Compila TypeScript |
| `npm run start` | Ejecuta la API compilada |
| `npm run test` | Corre tests |
| `npm run db:generate` | Genera el cliente de Prisma |
| `npm run db:migrate` | Ejecuta migraciones |
| `npm run db:seed` | Carga datos de prueba |

### Client

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Levanta Next.js en desarrollo |
| `npm run build` | Genera build de producción |
| `npm run start` | Ejecuta el build |
| `npm test` | Corre tests del cliente |

## Problemas comunes

### El puerto 5432 está ocupado

Puede pasar si ya tenés PostgreSQL instalado localmente. Podés detener tu Postgres local o cambiar el puerto en `server/docker-compose.yml`.

```yaml
ports:
  - "5433:5432"
```

Si cambiás el puerto, también actualizá `server/.env`:

```bash
DATABASE_URL="postgresql://scout:scout123@localhost:5433/scout_panel?schema=public"
```

### La API no conecta con la base

Revisá que el contenedor esté activo:

```bash
docker ps
```

También confirmá que exista `server/.env` y que `DATABASE_URL` coincida con `.env.example`.

### El seed no encuentra el cliente de Prisma

Generar el cliente antes de sembrar datos:

```bash
npm run db:generate
npm run db:seed
```

### El frontend no muestra datos

Confirmá que la API responda:

```bash
http://localhost:4000/health
```

Revisá que `client/.env.local` tenga:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Reiniciar datos

Desde `server`:

```bash
npm run db:seed
```

El seed borra y vuelve a cargar los datos base.

## Notas sobre Docker

Docker se usa para levantar PostgreSQL. El backend y el frontend se corren con npm desde la máquina local.

La base de datos está dockerizada, pero la aplicación completa no corre dentro de Docker.

## Mejoras pendientes

- Dockerizar también backend y frontend para levantar todo el stack con un solo `docker compose up`.
- Agregar tests de integración contra una base PostgreSQL real de test.
- Agregar tests de componentes para validar interacciones principales del frontend.
- Mejorar el modelo estadístico con datos reales o una fuente externa confiable.
- Incorporar cache o paginación remota completa si el dataset creciera.
- Agregar constraints adicionales en Prisma, como nombres de equipo únicos o temporadas únicas por año.
- Mejorar accesibilidad con pruebas de teclado y lectores de pantalla.
- Agregar Storybook o una galería de componentes para documentar la UI.

## Verificación

Desde `server`:

```bash
npm run build
npm run test
```

Desde `client`:

```bash
npm run build
npm test
```
