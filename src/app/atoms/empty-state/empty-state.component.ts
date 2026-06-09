import { Component, input } from '@angular/core';
import { IconComponent, IconName } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  imports: [IconComponent],
  template: `
    <section
      class="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center"
    >
      <app-icon class="text-3xl text-slate-400" [name]="icon()" [ariaHidden]="true" />
      <h2 class="mt-3 text-base font-semibold text-slate-900">{{ title() }}</h2>
      <p class="mx-auto mt-1 max-w-sm text-sm leading-6 text-slate-500">{{ description() }}</p>
    </section>
  `,
})
export class EmptyStateComponent {
  icon = input<IconName>('chatbubbles-outline');
  title = input.required<string>();
  description = input.required<string>();
}
