import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-template',
  standalone: true,
  template: `
    <main class="grid min-h-screen bg-slate-950 lg:grid-cols-[0.95fr_1.05fr]">
      <section class="relative hidden overflow-hidden bg-slate-900 lg:block">
        <img
          class="absolute inset-0 h-full w-full object-cover opacity-70"
          src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80"
          alt="Equipo colaborando en una mesa de trabajo"
        />
        <div
          class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent"
        ></div>
        <div class="absolute bottom-0 max-w-xl p-10 text-white">
          <p class="text-sm font-semibold uppercase tracking-wide text-teal-200">
            Angular 20 LTS + Ionic
          </p>
          <h1 class="mt-3 text-4xl font-bold leading-tight">
            Red social básica con SSR y signals de Angular
          </h1>
          <p class="mt-4 text-base leading-7 text-slate-200">
            Login simulado, timeline persistente, posteos, comentarios e interacciones en una
            arquitectura Atomic Design.
          </p>
        </div>
      </section>
      <section class="flex items-center justify-center px-4 py-10">
        <ng-content />
      </section>
    </main>
  `,
})
export class AuthTemplateComponent {}
