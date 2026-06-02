import { Component, input } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
    selector: 'app-empty-state',
    imports: [IonIcon],
    template: `
    <section class="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <ion-icon class="text-3xl text-slate-400" [name]="icon()" aria-hidden="true" />
      <h2 class="mt-3 text-base font-semibold text-slate-900">{{ title() }}</h2>
      <p class="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">{{ description() }}</p>
    </section>
  `
})
export class EmptyStateComponent {
  icon = input('chatbubbles-outline');
  title = input.required<string>();
  description = input.required<string>();
}
