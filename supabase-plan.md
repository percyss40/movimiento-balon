# Movimiento Balon - plan de publicacion gratis

## Stack recomendado

- Hosting: Netlify o Vercel, plan gratis.
- Base de datos: Supabase, plan gratis.
- Login: Supabase Auth con email y contrasena.
- Imagenes: por ahora archivos estaticos en `assets/`; mas adelante Supabase Storage si queres subir fotos desde admin.

## Tablas iniciales

### players

- id text primary key
- nickname text
- position text
- foot text
- photo text
- photo_focus text
- overall integer
- pace integer
- shooting integer
- passing integer
- dribbling integer
- defense integer
- physical integer

### matches

- id text primary key
- date date
- venue text
- score_a integer
- score_b integer
- mvp text references players(id)
- comment text

### match_players

- id bigint generated always as identity primary key
- match_id text references matches(id)
- player_id text references players(id)
- team text

### goals

- id bigint generated always as identity primary key
- match_id text references matches(id)
- player_id text references players(id)

### gallery_images

- id bigint generated always as identity primary key
- src text
- alt text
- sort_order integer

## Permisos simples

- Lectura publica para todos.
- Escritura solo para usuarios logueados.
- Al principio puede haber un solo usuario admin: tu email.

## Pasos

1. Crear proyecto gratis en Supabase.
2. Crear las tablas.
3. Activar Auth por email.
4. Crear tu usuario.
5. Conectar la app con `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
6. Importar el backup JSON exportado desde la app.
7. Publicar en Netlify o Vercel.
