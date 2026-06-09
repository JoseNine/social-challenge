import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthUser } from '../../interfaces/user.interface';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-header',
  imports: [RouterLink, AvatarComponent, IconComponent],
  template: `
    <header class="bg-white shadow-sm">
      <div class="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2">
        <a class="flex items-center gap-3" routerLink="/feed" aria-label="Ir al feed">
          <span
            class="grid size-10 place-items-center rounded-lg bg-teal-700 text-lg font-bold text-white"
          >
            IR
          </span>
          <span class="hidden text-left sm:block">
            <span class="block text-sm font-semibold leading-5 text-slate-950">IT Rock Social</span>
            <span class="block text-xs leading-4 text-slate-500">Frontend Challenge</span>
          </span>
        </a>

        @if (user(); as currentUser) {
          <div class="flex items-center gap-3">
            <div class="hidden text-right sm:block">
              <p class="text-sm font-medium leading-5 text-slate-900">{{ currentUser.name }}</p>
              <p class="text-xs leading-4 text-slate-500">
                {{ currentUser.provider === 'google' ? 'Google OAuth mock' : currentUser.email }}
              </p>
            </div>
            <app-avatar [name]="currentUser.name" [color]="currentUser.avatarColor" />
            <button
              type="button"
              class="grid size-10 place-items-center rounded-lg text-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              (click)="logout.emit()"
            >
              <app-icon [name]="'log-out-outline'" [ariaLabel]="'Cerrar sesión'" />
            </button>
          </div>
        }
      </div>
    </header>
  `,
})
export class AppHeaderComponent {
  user = input<AuthUser | null>(null);
  logout = output<void>();
}
