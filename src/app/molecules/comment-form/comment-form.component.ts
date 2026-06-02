import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';

@Component({
  selector: 'app-comment-form',
  imports: [FormsModule, IonButton, IonIcon, IonInput],
  template: `
    <form class="grid grid-cols-[1fr_auto] gap-2" (ngSubmit)="submit()">
      <ion-input
        class="rounded-lg border border-slate-200 bg-white px-3"
        label="Comentario"
        label-placement="stacked"
        placeholder="Escribí un comentario"
        [(ngModel)]="content"
        [name]="'comment-' + postId()"
      />
      <ion-button class="h-12 self-end" type="submit" [disabled]="!content.trim()">
        <ion-icon name="chatbubble-outline" slot="icon-only" aria-label="Comentar" />
      </ion-button>
    </form>
  `,
})
export class CommentFormComponent {
  postId = input.required<string>();
  createComment = output<string>();
  content = '';

  submit(): void {
    const content = this.content.trim();
    if (!content) {
      return;
    }

    this.createComment.emit(content);
    this.content = '';
  }
}
