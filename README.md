# Scout Panel LDP

Aplicacion full stack para scouting de futbolistas. Tiene una API REST con Node.js, Express, TypeScript, Prisma y PostgreSQL, mas un cliente web hecho con Next.js, React y Tailwind CSS.

La app permite buscar jugadores, filtrarlos, ver sus datos principales y comparar metricas por temporada.

## Que incluye

- API REST para jugadores, equipos y temporadas.
- Base de datos PostgreSQL levantada con Docker.
- Prisma para crear las tablas y consultar datos.
- Seed con 30 jugadores y estadisticas en varias temporadas.
- Filtros por busqueda, posicion, nacionalidad, pais del club y edad.
- Vista de detalle por jugador.
- Comparacion de 1 a 3 jugadores.
- Graficos y metricas normalizadas para comparar rendimiento.

## Decisiones tecnicas

### Arquitectura del server

El backend esta organizado con una idea cercana a arquitectura hexagonal, sin aplicarla de forma rigida para no sobredimensionar el challenge.

La separacion principal es:

- `routes`: definen los endpoints HTTP.
- `schemas`: validan inputs con Zod.
- `controllers`: reciben la request y delegan.
- `services`: concentran reglas de aplicacion.
- `repositories`: encapsulan el acceso a Prisma.
- `mappers`: transforman modelos de base de datos en respuestas de API.
- `shared`: contiene utilidades y errores reutilizables.

Esta estructura permite que la logica de negocio no dependa directamente de Express ni quede mezclada con detalles de Prisma. Si manana cambia la forma de persistir datos o se agregan nuevos endpoints, el impacto queda mas acotado.

### Modelado y seed

El schema usa relaciones claras entre `Team`, `Player`, `Season` y `PlayerStats`.

Se eligio separar temporadas y estadisticas para que un jugador pueda tener datos en distintos anos sin duplicar su informacion base. El seed carga 30 jugadores con clubes, nacionalidades permitidas y estadisticas en varias temporadas para poder probar filtros, detalle y comparacion de forma realista.

Tambien se agregaron validaciones en el seed para evitar errores silenciosos, por ejemplo:

- jugadores sin equipo existente;
- equipos sin jugadores;
- nacionalidades fuera del conjunto esperado;
- roles o posiciones invalidas;
- overrides apuntando a jugadores que ya no existen.

### Escala 1-100 para metricas

Las estadisticas crudas no siempre son comparables directamente. Por ejemplo, un jugador puede tener muchos pases completados porque jugo mas minutos, mientras otro puede destacar mas en eficacia o acciones por 90 minutos.

Por eso, para la visualizacion se transforman las metricas a una escala de `0` a `100`, donde `100` representa el maximo esperado para esa habilidad. Esta normalizacion permite que el radar y la tabla comparen dimensiones distintas sin que una metrica de volumen rompa la lectura visual.

La logica de normalizacion vive en `client/src/hooks/scoutPanel/compareMetrics.js`, separada del componente visual. De esa forma, `CompareChart` solo se ocupa de renderizar y no de calcular reglas de negocio.

### Transicion al actualizar comparaciones

Antes, al quitar un jugador seleccionado, la seccion de metricas desmontaba el grafico actual y cambiaba de estado de forma brusca. Eso generaba un corte visual y una sensacion de error, aunque la app estuviera funcionando.

Se prefirio mantener el ultimo grafico visible mientras se carga la nueva comparacion, aplicando una transicion suave con opacidad y un indicador `Actualizando`. Este patron mejora la percepcion de continuidad: el usuario entiende que la informacion se esta recalculando sin perder el contexto visual.

### Separacion de responsabilidades en el frontend

El hook principal del panel se separo en piezas mas chicas dentro de `client/src/hooks/scoutPanel`:

- `usePlayerCatalog`: carga jugadores, temporadas, filtros y paginacion.
- `usePlayerDetail`: maneja el jugador activo.
- `usePlayerComparison`: maneja seleccion, comparacion y errores de metricas.
- `scoutPanelFilters`: contiene logica pura de filtrado.
- `compareMetrics`: contiene logica pura para derivar metricas y scores.
- `useScoutPanel`: funciona como fachada para que los componentes consuman una unica API.

Con esto se evita mezclar logica pura, reglas de negocio y renderizado dentro de un mismo componente. Los componentes quedan mas declarativos y los calculos importantes se pueden testear de forma aislada.

## Tecnologias

Backend:

- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- Zod
- Vitest

Frontend:

- Next.js
- React
- Tailwind CSS
- lucide-react

## Requisitos antes de empezar

Instalar estas herramientas:

- Node.js 20 o superior
- npm
- Docker Desktop
- Git

Para verificar si estan instaladas:

```bash
node -v
npm -v
docker -v
git --version
```

## Estructura del proyecto

```bash
scout-panel-ldp/
  client/   # Aplicacion web con Next.js
  server/   # API, Prisma, Docker y base de datos
```

## Variables de entorno

El proyecto no sube los archivos `.env` reales a Git. Por eso hay archivos `.example` que sirven como plantilla.

### Server

Crear el archivo `.env` dentro de `server`:

```bash
cd server
cp .env.example .env
```

En Windows PowerShell tambien podes usar:

```powershell
cd server
Copy-Item .env.example .env
```

Contenido esperado:

```bash
DATABASE_URL="postgresql://scout:scout123@localhost:5432/scout_panel?schema=public"
PORT=4000
NODE_ENV=development
```

### Client

Crear el archivo `.env.local` dentro de `client`:

```bash
cd client
cp .env.local.example .env.local
```

En Windows PowerShell tambien podes usar:

```powershell
cd client
Copy-Item .env.local.example .env.local
```

Contenido esperado:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Como levantar el proyecto desde cero

Abrir una terminal en la raiz del proyecto.

### 1. Levantar la base de datos

```bash
cd server
docker compose up -d
```

Esto crea un contenedor de PostgreSQL con:

- Usuario: `scout`
- Password: `scout123`
- Base de datos: `scout_panel`
- Puerto local: `5432`

Para revisar que el contenedor este activo:

```bash
docker ps
```

### 2. Instalar dependencias del server

```bash
npm install
```

### 3. Crear las tablas en la base

```bash
npm run db:migrate
```

Este comando ejecuta las migraciones de Prisma y crea las tablas necesarias.

### 4. Cargar datos de prueba

```bash
npm run db:seed
```

Este comando carga jugadores, equipos, temporadas y estadisticas.

### 5. Levantar la API

```bash
npm run dev
```

La API queda disponible en:

```bash
http://localhost:4000
```

Probar que funciona:

```bash
http://localhost:4000/health
```

## Levantar el frontend

Abrir otra terminal desde la raiz del proyecto.

```bash
cd client
npm install
npm run dev
```

El cliente queda disponible en:

```bash
http://localhost:3000
```

## Orden recomendado para correr todo

Terminal 1:

```bash
cd server
docker compose up -d
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Terminal 2:

```bash
cd client
npm install
npm run dev
```

Despues abrir:

```bash
http://localhost:3000
```

## Endpoints principales

```bash
GET /health
GET /api/players
GET /api/players/:id
GET /api/players/compare?ids=<id1>[,<id2>,<id3>]&seasonId=<seasonId>
GET /api/teams
GET /api/teams/:id
GET /api/seasons
GET /api/seasons/latest
```

Ejemplo de filtro:

```bash
GET /api/players?nationality=Argentina&position=Delantero&minAge=20&maxAge=30&page=1&limit=10
```

## Scripts utiles

Server:

```bash
npm run dev        # Levanta la API en desarrollo
npm run build      # Compila TypeScript
npm run start      # Ejecuta la API compilada
npm run test       # Corre tests
npm run db:migrate # Ejecuta migraciones
npm run db:seed    # Carga datos de prueba
```

Client:

```bash
npm run dev   # Levanta Next.js en desarrollo
npm run build # Genera build de produccion
npm run start # Ejecuta el build
npm test      # Corre tests del cliente
```

## Problemas comunes

### El puerto 5432 ya esta ocupado

Puede pasar si ya tenes PostgreSQL instalado localmente. Podes detener tu Postgres local o cambiar el puerto en `server/docker-compose.yml`.

Ejemplo:

```yaml
ports:
  - "5433:5432"
```

Si haces eso, tambien cambia el puerto en `server/.env`:

```bash
DATABASE_URL="postgresql://scout:scout123@localhost:5433/scout_panel?schema=public"
```

### La API no conecta con la base

Revisar:

```bash
docker ps
```

Tambien confirmar que existe `server/.env` y que `DATABASE_URL` sea igual al de `.env.example`.

### El frontend no muestra datos

Revisar que la API este corriendo en:

```bash
http://localhost:4000/health
```

Tambien revisar que `client/.env.local` tenga:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Quiero reiniciar los datos

Desde `server`:

```bash
npm run db:seed
```

El seed borra y vuelve a cargar los datos base.

## Notas sobre Docker

Docker se usa para levantar PostgreSQL. El backend y el frontend se corren con npm desde la maquina local.

Esto significa que la base de datos esta dockerizada, pero la aplicacion completa no esta dentro de Docker.

## Que mejoraria con mas tiempo

- Dockerizar tambien backend y frontend para levantar todo el stack con un solo `docker compose up`.
- Agregar tests de integracion contra una base PostgreSQL real de test.
- Agregar tests de componentes para validar interacciones principales del frontend.
- Mejorar el modelo estadistico con datos reales o una fuente externa confiable.
- Agregar autenticacion si la app se orientara a usuarios reales.
- Incorporar cache o paginacion remota completa si el dataset creciera mucho.
- Agregar constraints adicionales en Prisma, como nombres de equipo unicos o temporadas unicas por ano.
- Mejorar accesibilidad con pruebas de teclado y lectores de pantalla.
- Agregar Storybook o una galeria de componentes para documentar la UI.

## Verificacion rapida

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
