# IT Rock Social Challenge

Aplicacion web tipo red social basica para el challenge Frontend Angular.

## Stack

- Angular 20 LTS con Standalone Components.
- Angular Universal SSR.
- Tailwind CSS 4.
- Signals nativas de Angular para estado global.
- Persistencia local con `localStorage`, protegida para SSR.

## Funcionalidad

- Login con email y password con validaciones requeridas.
- OAuth simulado con boton "Login con Google".
- Feed con posts mockeados inicialmente.
- Creacion de posts con texto e imagen opcional.
- Comentarios sobre posts existentes.
- Likes y guardados como interacciones extra.
- Estado global de usuario, posts y comentarios con signals nativas de Angular.
- Persistencia local de sesion y timeline.
- Logout con redireccion al login.
- Organizacion por Atomic Design.

## Instalacion

```bash
npm install --legacy-peer-deps
```

Se usa `--legacy-peer-deps` para evitar conflictos de peers opcionales o transitivos durante la instalacion. La app configura Tailwind 4 mediante `@tailwindcss/postcss`.

## Desarrollo CSR

```bash
npm start
```

Luego abrir:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

## Ejecucion SSR

```bash
npm run build
npm run serve:ssr:social-challenge
```

Luego abrir:

```text
http://localhost:4000
```

## Docker

Construir y ejecutar la imagen:

```bash
docker build -t social-challenge .
docker run --rm -p 4000:4000 social-challenge
```

Tambien se puede iniciar con Docker Compose:

```bash
docker compose up --build
```

La aplicacion queda disponible en:

```text
http://localhost:4000
```

La imagen usa un build multi-stage con Node 22 Alpine. La etapa final contiene solamente las dependencias de produccion y los artefactos SSR compilados, se ejecuta con un usuario sin privilegios e incluye un health check sobre `/login`.

## Rutas con SSR

Angular Universal prerenderiza y sirve estas rutas:

- `/login`
- `/feed`

La ruta raiz redirige a `/login`. El guard hidrata el servicio de estado con signals antes de resolver la navegacion, y el servicio de persistencia evita acceso a `localStorage` durante renderizado server-side.

## Arquitectura

```text
src/app
  atoms
  molecules
  organisms
  templates
  pages
  interfaces
  services
  store
  routes
```

Las interfaces estan centralizadas en `src/app/interfaces`. El servicio de estado principal esta en `src/app/store/social.store.ts`.

## Deploy

El `Dockerfile` permite desplegar la aplicacion en servicios compatibles con contenedores, como Render, Railway, Fly.io o Google Cloud Run. El contenedor escucha la variable de entorno `PORT`, con `4000` como valor predeterminado.

Para Render:

1. Crear un nuevo Web Service desde el repositorio.
2. Seleccionar el runtime Docker.
3. Usar el `Dockerfile` ubicado en la raiz.
4. Configurar el health check path como `/login`.

Render construye la imagen y asigna automaticamente la variable `PORT`.

Para Netlify:

1. Importar el repositorio desde GitHub.
2. Usar `npm run build` como build command.
3. Mantener la configuracion de `netlify.toml`.

Netlify detecta Angular SSR y genera automaticamente la Edge Function. El proyecto incluye `@netlify/angular-runtime` v4 y fija Node 22.22 para cumplir los requisitos del adaptador.

## Documento del challenge

El PDF original descargado desde el link de Drive esta guardado como:

```text
challenge-frontend-angular.pdf
```
