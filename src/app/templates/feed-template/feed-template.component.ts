import { Component, input, output } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { AppHeaderComponent } from '../../organisms/app-header/app-header.component';
import { AuthUser } from '../../interfaces/user.interface';

@Component({
  selector: 'app-feed-template',
  imports: [IonContent, AppHeaderComponent],
  template: `
    <app-header [user]="user()" (logout)="logout.emit()" />
    <ion-content>
      <main class="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <section class="min-w-0">
          <ng-content select="[feed-main]" />
        </section>
        <aside class="space-y-4">
          <ng-content select="[feed-side]" />
        </aside>
      </main>
    </ion-content>
  `,
})
export class FeedTemplateComponent {
  user = input<AuthUser | null>(null);
  logout = output<void>();
}
