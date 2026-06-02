import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonTextarea } from '@ionic/angular/standalone';
import { CreatePostInput } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post-composer',
  imports: [FormsModule, IonButton, IonIcon, IonInput, IonTextarea],
  template: `
    <form class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" (ngSubmit)="submit()">
      <ion-textarea
        class="min-h-28 rounded-lg border border-slate-200 px-3"
        label="Nuevo post"
        label-placement="stacked"
        placeholder="Compartí una actualización..."
        [(ngModel)]="content"
        name="content"
        [autoGrow]="true"
      />

      <div class="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
        <ion-input
          class="rounded-lg border border-slate-200 px-3"
          label="Imagen opcional"
          label-placement="stacked"
          placeholder="https://..."
          [(ngModel)]="imageUrl"
          name="imageUrl"
        />
        <ion-button class="h-12 self-end" type="submit" [disabled]="!content.trim()">
          <ion-icon name="send-outline" slot="start" aria-hidden="true" />
          Publicar
        </ion-button>
      </div>
    </form>
  `,
})
export class PostComposerComponent {
  createPost = output<CreatePostInput>();
  content = '';
  imageUrl = '';

  submit(): void {
    const content = this.content.trim();
    if (!content) {
      return;
    }

    this.createPost.emit({ content, imageUrl: this.imageUrl.trim() || undefined });
    this.content = '';
    this.imageUrl = '';
  }
}
