# adspot-backend — mono-repo

Sistema de gestión de Ad Spots compuesto por un backend REST en Go y un frontend en Next.js.

```
.
├── backend/    # API REST en Go + SQLite
└── frontend/   # Panel de administración en Next.js
```

---

## Inicio rápido

### 1. Backend (Go)

```bash
cd backend
make run          # aplica migraciones y levanta el servidor en :8080
```

Requiere Go 1.22+ y GCC (para `go-sqlite3` via CGO).
Ver [`backend/README.md`](./backend/README.md) para documentación completa.

### 2. Frontend (Next.js)

```bash
cd frontend
cp .env.local.example .env.local   # configura la URL del backend
npm install
npm run dev                         # levanta el servidor en :3000
```

Requiere Node.js 20+.
Ver [`frontend/README.md`](./frontend/README.md) para documentación completa.

---

## Estructura del proyecto

| Carpeta | Descripción |
|---|---|
| `backend/` | API REST (Go, chi, SQLite), migraciones, Makefile |
| `frontend/` | Panel admin (Next.js 15, TypeScript, Tailwind CSS) |
| `.github/workflows/` | CI: ejecuta los tests del backend en cada merge a `main` |

---

## Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/adspots` | Crear un nuevo Ad Spot |
| `GET` | `/adspots/{id}` | Obtener un Ad Spot por ID |
| `POST` | `/adspots/{id}/deactivate` | Desactivar un Ad Spot |
| `GET` | `/adspots?placement=...` | Eligible ads agrupados por placement |
| `GET` | `/adspots/all?placement=...` | Todos los Ad Spots (activos e inactivos) |
