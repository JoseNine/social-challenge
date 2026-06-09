import { DatePipe } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CommentFormComponent } from '../../molecules/comment-form/comment-form.component';
import { SocialPost } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe, IconComponent, AvatarComponent, CommentFormComponent],
  host: { class: 'block' },
  template: `
    <article class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="flex gap-3 p-4">
        <app-avatar [name]="post().authorName" [color]="post().authorAvatarColor" />
        <div class="min-w-0 flex-1">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 class="text-sm font-semibold text-slate-950">{{ post().authorName }}</h2>
              <time class="text-xs text-slate-500" [dateTime]="post().createdAt">
                {{ post().createdAt | date: 'medium' }}
              </time>
            </div>
          </div>
          <p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">
            {{ post().content }}
          </p>
        </div>
      </div>

      @if (post().imageUrl) {
        <div class="relative aspect-video max-h-[26.25rem] overflow-hidden bg-slate-100">
          <div
            class="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 to-slate-200 transition-opacity duration-300"
            [class.opacity-0]="imageLoaded()"
            aria-hidden="true"
          ></div>
          <img
            class="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-300"
            [class.opacity-100]="imageLoaded()"
            [src]="post().imageUrl"
            alt="Imagen del post"
            loading="eager"
            (load)="imageLoaded.set(true)"
          />
        </div>
      }

      <div class="flex flex-wrap items-center gap-2 border-y border-slate-100 px-3 py-2">
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-slate-100"
          [class.text-slate-600]="!likedByMe()"
          [class.hover:text-slate-900]="!likedByMe()"
          [class.text-rose-600]="likedByMe()"
          [class.hover:text-rose-700]="likedByMe()"
          [attr.aria-pressed]="likedByMe()"
          (click)="like.emit(post().id)"
        >
          <app-icon [name]="likedByMe() ? 'heart' : 'heart-outline'" [ariaHidden]="true" />
          {{ post().likedBy.length }}
        </button>
        <button
          type="button"
          class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors hover:bg-slate-100"
          [class.text-slate-600]="!post().saved"
          [class.hover:text-slate-900]="!post().saved"
          [class.text-teal-700]="post().saved"
          (click)="save.emit(post().id)"
        >
          <app-icon [name]="post().saved ? 'bookmark' : 'bookmark-outline'" [ariaHidden]="true" />
          Guardar
        </button>
        <span class="ml-auto text-xs text-slate-500">{{ post().comments.length }} comentarios</span>
      </div>

      <div class="space-y-3 p-4">
        @for (comment of post().comments; track comment.id) {
          <div class="rounded-lg bg-slate-50 px-3 py-2">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-semibold text-slate-900">{{ comment.authorName }}</p>
              <time class="text-[0.6875rem] text-slate-400" [dateTime]="comment.createdAt">
                {{ comment.createdAt | date: 'short' }}
              </time>
            </div>
            <p class="mt-1 text-sm leading-5 text-slate-700">{{ comment.content }}</p>
          </div>
        }
        <app-comment-form
          [postId]="post().id"
          (createComment)="comment.emit({ postId: post().id, content: $event })"
        />
      </div>
    </article>
  `,
})
export class PostCardComponent {
  post = input.required<SocialPost>();
  currentUserId = input<string | null>(null);
  like = output<string>();
  save = output<string>();
  comment = output<{ postId: string; content: string }>();
  readonly imageLoaded = signal(false);

  readonly likedByMe = computed(() => {
    const userId = this.currentUserId();
    return userId ? this.post().likedBy.includes(userId) : false;
  });
}
