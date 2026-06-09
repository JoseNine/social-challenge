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
npx netlify dev
```

Luego abrir:

```text
http://localhost:8888
```

Netlify Dev ejecuta la aplicacion usando la misma integracion Angular SSR utilizada durante el deploy.

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
