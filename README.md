# IT Rock Social Challenge

Aplicacion web tipo red social basica para el challenge Frontend Angular.

## Stack

- Angular 20 LTS con Standalone Components.
- Angular Universal SSR.
- Ionic Angular 8.
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

Se usa `--legacy-peer-deps` para conservar Tailwind CSS 4 junto con el stack de Angular/Ionic del challenge cuando npm evalua peers opcionales o transitivos. La app configura Tailwind 4 mediante `@tailwindcss/postcss`.

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

No se incluyo deploy publico en esta entrega local. La configuracion SSR generada por Angular es compatible con servicios que soporten Node/SSR, como Vercel o Netlify con adaptador adecuado.

## Documento del challenge

El PDF original descargado desde el link de Drive esta guardado como:

```text
challenge-frontend-angular.pdf
```
