# Martina Store — Portfolio & E-commerce

Portfolio y tienda para Martina Gorozo — tatuadora y artista digital.

## Stack

- **Next.js 16** + React 19 (App Router)
- **Drizzle ORM** + NeonDB (PostgreSQL serverless)
- **MercadoPago** — método principal de pago
- **PostgreSQL + bcrypt + JWT** — acceso administrativo con contraseña y sesión HttpOnly
- **viem** — interacción on-chain para pagos cripto (USDC/USDT)
- **Vercel Blob** — almacenamiento de imágenes
- **Framer Motion** — animaciones
- **Tailwind CSS v4**

## Variables de entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
# Base de datos (NeonDB)
DATABASE_URL=postgresql://...

# Admin (sesión propia)
ADMIN_SESSION_SECRET=            # 32+ caracteres aleatorios, secreto de servidor
ADMIN_SETUP_TOKEN=               # secreto temporal para crear/restablecer la cuenta admin

# MercadoPago
MERCADO_PAGO_ACCESS_TOKEN=APP_USR-...
MERCADO_PAGO_WEBHOOK_SECRET=  # Opcional — firma de webhooks (recomendado en prod)

# URL base del sitio
NEXT_PUBLIC_BASE_URL=https://tudominio.com
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Base de datos
npm run db:generate   # Generar migraciones
npm run db:migrate    # Aplicar migraciones
npm run db:push       # Push directo (dev)
npm run db:studio     # Drizzle Studio (UI de la DB)

# Tests
npm test
```

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Home con scroll horizontal (portfolio, tattoos, journal) |
| `/portfolio` | Galería de arte digital con compra |
| `/portfolio/[id]` | Detalle de obra + checkout MP o cripto |
| `/tattoos` | Galería de tatuajes |
| `/blog` | Journal / entradas del blog |
| `/reservations` | Formulario de reserva de sesión de tatuaje |
| `/about` | Sobre Martina |
| `/admin` | Panel de administración (requiere sesión segura) |
| `/login` | Login admin con correo y contraseña |

## Pagos

### MercadoPago (principal)
- Flujo: `/api/checkout` → MercadoPago → `/success` o `/failure` o `/pending`
- Webhook en `/api/webhooks/mercadopago` — verifica firma y actualiza estado
- Configurar el webhook en el panel de MP apuntando a `https://tudominio.com/api/webhooks/mercadopago`

### Cripto

El checkout cripto está deliberadamente desactivado hasta tener una integración revisada. No debe activarse para ventas reales sin validación completa de importe, token y liquidación.

## DB Schema

9 tablas: `users`, `wallet_users`, `artworks`, `categories`, `blog_posts`, `shipping_addresses`, `crypto_orders`, `mercadopago_orders`, `reservations`

## Admin

Acceso vía `/login` con correo y contraseña. La contraseña se guarda con hash bcrypt; el navegador recibe únicamente una cookie HttpOnly firmada. Las rutas administrativas no confían en localStorage.

Para crear o restablecer la primera cuenta, usa `POST /api/auth/setup` con el header `x-admin-setup-token` igual a `ADMIN_SETUP_TOKEN`; después elimina o rota esa variable.

Secciones del panel:
- **Artworks** — CRUD de arte digital
- **Tattoos** — CRUD de trabajos de tatuaje  
- **Journal** — CRUD del blog con drafts
- **Sales** — Dashboard de ventas (cripto + MercadoPago)
- **Reservations** — Gestión de solicitudes de reserva de sesión
