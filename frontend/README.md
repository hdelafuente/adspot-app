# adspot-frontend

Panel de administración para gestionar Ad Spots. Construido con **Next.js 15**, **TypeScript** y **Tailwind CSS**.

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20 |
| npm | 10 |
| Backend corriendo | `http://localhost:8080` |

---

## Inicio rápido

```bash
# 1. Configurar variables de entorno
cp .env.local.example .env.local

# 2. Instalar dependencias
npm install

# 3. Levantar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | URL base del backend Go | `http://localhost:8080` |

---

## Comandos

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción (requiere `build` previo) |
| `npm run lint` | Linting con ESLint |

---

## Vistas

### Ad Spots (`/adspots`)

Tabla con todos los anuncios (activos e inactivos).

- **Filtro por placement** (Home Screen / Ride Summary / Map View / Todos).
- **Badge de estado** verde (activo) o rojo (inactivo).
- **Botón Desactivar** disponible solo en filas activas — muestra toast de éxito o error sin recargar la página.
- **Loading skeleton** mientras se cargan los datos.
- **Empty state** si no hay anuncios.

### Crear Ad Spot (`/adspots/create`)

Formulario con validación client-side antes de enviar.

| Campo | Tipo | Requerido | Restricciones |
|---|---|---|---|
| Título | Texto | Sí | Max 255 caracteres |
| URL de imagen | URL | Sí | Debe ser URL válida; preview inline |
| Placement | Select | Sí | `home_screen`, `ride_summary`, `map_view` |
| TTL (minutos) | Número | No | Entre 1 y 10080 (1 semana) |

---

## Estructura del proyecto

```
frontend/
├── app/
│   ├── layout.tsx              # Layout raíz: sidebar + Toaster
│   ├── page.tsx                # Redirect a /adspots
│   └── adspots/
│       ├── page.tsx            # Vista lista
│       └── create/
│           └── page.tsx        # Vista formulario
├── components/
│   ├── Sidebar.tsx             # Navegación lateral
│   ├── AdSpotTable.tsx         # Tabla con filtro y acciones
│   └── CreateAdSpotForm.tsx    # Formulario controlado
└── lib/
    ├── types.ts                # Interfaces TypeScript (espejo de structs Go)
    └── api.ts                  # Wrapper fetch para todos los endpoints
```

---

## Dependencias

| Paquete | Versión | Uso |
|---|---|---|
| `next` | 15.2.1 | Framework React (App Router) |
| `sonner` | ^2.0.1 | Toast notifications |
| `tailwindcss` | ^3.4.17 | Estilos utilitarios |
