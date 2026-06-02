import { Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <div
      class="grid size-11 shrink-0 place-items-center rounded-full text-sm font-semibold text-white shadow-sm"
      [style.background]="color()"
      [attr.aria-label]="name()"
    >
      {{ initials() }}
    </div>
  `,
})
export class AvatarComponent {
  name = input.required<string>();
  color = input<string>('#0f766e');

  initials(): string {
    return this.name()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }
}
