import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EmptyStateComponent } from '../../atoms/empty-state/empty-state.component';
import { PostComposerComponent } from '../../molecules/post-composer/post-composer.component';
import { PostCardComponent } from '../../organisms/post-card/post-card.component';
import { FeedTemplateComponent } from '../../templates/feed-template/feed-template.component';
import { CreatePostInput } from '../../interfaces/post.interface';
import { SocialStore } from '../../store/social.store';

@Component({
    selector: 'app-feed-page',
    imports: [EmptyStateComponent, PostComposerComponent, PostCardComponent, FeedTemplateComponent],
    template: `
    <app-feed-template [user]="store.currentUser()" (logout)="logout()">
      <div feed-main class="space-y-5">
        <app-post-composer (createPost)="createPost($event)" />

        @if (store.posts().length) {
          @for (post of store.posts(); track post.id) {
            <app-post-card
              [post]="post"
              (like)="store.toggleLike($event)"
              (save)="store.toggleSaved($event)"
              (comment)="store.createComment($event.postId, $event.content)"
            />
          }
        } @else {
          <app-empty-state
            title="No hay publicaciones"
            description="Creá el primer post para iniciar el timeline."
          />
        }
      </div>

      <div feed-side class="space-y-4">
        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-950">Resumen</h2>
          <dl class="mt-4 grid grid-cols-3 gap-2 text-center">
            <div class="rounded-lg bg-slate-50 p-3">
              <dt class="text-xs text-slate-500">Posts</dt>
              <dd class="mt-1 text-xl font-semibold text-slate-950">{{ store.posts().length }}</dd>
            </div>
            <div class="rounded-lg bg-slate-50 p-3">
              <dt class="text-xs text-slate-500">Likes</dt>
              <dd class="mt-1 text-xl font-semibold text-slate-950">{{ store.totalLikes() }}</dd>
            </div>
            <div class="rounded-lg bg-slate-50 p-3">
              <dt class="text-xs text-slate-500">Comentarios</dt>
              <dd class="mt-1 text-xl font-semibold text-slate-950">{{ store.totalComments() }}</dd>
            </div>
          </dl>
        </section>

        <section class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h2 class="text-sm font-semibold text-slate-950">SSR</h2>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            Las rutas <span class="font-medium text-slate-900">/login</span> y
            <span class="font-medium text-slate-900">/feed</span> renderizan con Angular Universal.
          </p>
        </section>
      </div>
    </app-feed-template>
  `
})
export class FeedPage {
  readonly store = inject(SocialStore);
  private readonly router = inject(Router);

  createPost(input: CreatePostInput): void {
    this.store.createPost(input);
  }

  logout(): void {
    this.store.logout();
    void this.router.navigateByUrl('/login');
  }
}
