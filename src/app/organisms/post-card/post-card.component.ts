import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { IonButton, IonIcon } from '@ionic/angular/standalone';
import { AvatarComponent } from '../../atoms/avatar/avatar.component';
import { CommentFormComponent } from '../../molecules/comment-form/comment-form.component';
import { SocialPost } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post-card',
  imports: [DatePipe, IonButton, IonIcon, AvatarComponent, CommentFormComponent],
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
        <img
          class="max-h-[420px] w-full object-cover"
          [src]="post().imageUrl"
          alt="Imagen del post"
          loading="lazy"
        />
      }

      <div class="flex flex-wrap items-center gap-2 border-y border-slate-100 px-3 py-2">
        <ion-button fill="clear" size="small" (click)="like.emit(post().id)">
          <ion-icon name="heart-outline" slot="start" aria-hidden="true" />
          {{ post().likes }}
        </ion-button>
        <ion-button fill="clear" size="small" (click)="save.emit(post().id)">
          <ion-icon
            [name]="post().saved ? 'bookmark' : 'bookmark-outline'"
            slot="start"
            aria-hidden="true"
          />
          Guardar
        </ion-button>
        <span class="ml-auto text-xs text-slate-500">{{ post().comments.length }} comentarios</span>
      </div>

      <div class="space-y-3 p-4">
        @for (comment of post().comments; track comment.id) {
          <div class="rounded-lg bg-slate-50 px-3 py-2">
            <div class="flex items-center justify-between gap-2">
              <p class="text-xs font-semibold text-slate-900">{{ comment.authorName }}</p>
              <time class="text-[11px] text-slate-400" [dateTime]="comment.createdAt">
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
  like = output<string>();
  save = output<string>();
  comment = output<{ postId: string; content: string }>();
}
