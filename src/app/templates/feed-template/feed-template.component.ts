import { Component, input, output } from '@angular/core';
import { AppHeaderComponent } from '../../organisms/app-header/app-header.component';
import { AuthUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-feed-template',
  imports: [AppHeaderComponent],
  template: `
    <app-header [user]="user()" (logout)="logout.emit()" />
    <main class="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <section class="min-w-0">
        <ng-content select="[feed-main]" />
      </section>
      <aside class="space-y-4 lg:sticky lg:top-6 lg:self-start">
        <ng-content select="[feed-side]" />
      </aside>
    </main>
  `,
})
export class FeedTemplateComponent {
  user = input<AuthUser | null>(null);
  logout = output<void>();
}
