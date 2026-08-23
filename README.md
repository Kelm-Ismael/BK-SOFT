# BK Soft

Sistema de gestión de turnos para peluquería/barbería — reservas online, panel de administración, agenda por profesional y gestión de recepción.

Proyecto para la materia [nombre de tu materia], desarrollado siguiendo metodología Scrum.

## Stack tecnológico

- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL (SQL crudo con `pg`, sin ORM)

## Documentación del proyecto

- [`docs/backlog-final.md`](docs/backlog-final.md) — Backlog completo (67 escenarios, 5 actores)
- [`docs/historias-usuario.md`](docs/historias-usuario.md) — 67 historias de usuario
- [`docs/epicas.md`](docs/epicas.md) — 13 épicas agrupando las historias
- [`docs/plan-sprints-y-estructura.md`](docs/plan-sprints-y-estructura.md) — Plan de sprints y estructura del proyecto
- [`docs/api.md`](docs/api.md) — Documentación de endpoints
- [`docs/schema.md`](docs/schema.md) — Diccionario de datos (tablas y relaciones)
- [`docs/decisiones.md`](docs/decisiones.md) — Decisiones técnicas relevantes

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- npm

## Instalación

```bash
# Clonar el repo
git clone <url-del-repo>
cd bk-soft

# Instalar dependencias del backend
cd backend
npm install

# Copiar el archivo de variables de entorno y completar los datos reales
cp .env.example .env
```

## Configurar la base de datos

```bash
# Crear la base (ejemplo con psql)
createdb bksoft

# Correr el schema
psql -d bksoft -f sql/schema.sql
```

## Variables de entorno (`.env`)

```
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/bksoft
```

## Correr el proyecto

```bash
# Backend (desde /backend)
npm run dev

# Frontend
# Abrir frontend/index.html con Live Server, o servirlo con el mismo Express
```

El backend debería levantar en `http://localhost:3000`. Probar que funciona con:

```
GET http://localhost:3000/api/health
```

Debería responder `{ "ok": true }`.

## Estructura del proyecto

```
bk-soft/
├── backend/
│   └── src/
│       ├── config/
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       ├── middlewares/
│       └── utils/
├── frontend/
│   ├── paneles/
│   ├── css/
│   └── js/
├── sql/
│   └── schema.sql
└── docs/
```

Ver detalle completo en [`docs/plan-sprints-y-estructura.md`](docs/plan-sprints-y-estructura.md).

## Roles del sistema

| Rol | Descripción |
|---|---|
| Invitado | Consulta info, reserva/gestiona turnos sin cuenta (vía link con token) |
| Cliente registrado | Panel propio: turnos, historial, favoritos, promociones |
| Profesional | Barbero, Peluquero o Colorista — agenda propia, métricas, clientes atendidos |
| Recepcionista | Atención de mostrador: turnos, clientes, cobros, inventario |
| Administrador | Control total: precios, empleados, permisos, reportes financieros |

## Estado del proyecto

En desarrollo — ver [`docs/plan-sprints-y-estructura.md`](docs/plan-sprints-y-estructura.md) para el sprint actual.
