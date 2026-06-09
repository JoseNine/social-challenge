import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
  selector: 'app-comment-form',
  imports: [FormsModule, IconComponent],
  template: `
    <form class="grid grid-cols-[1fr_auto] items-end gap-2" (ngSubmit)="submit()">
      <label class="block">
        <span class="mb-1 block text-xs font-medium text-slate-500">Comentario</span>
        <input
          class="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          placeholder="Escribí un comentario"
          [(ngModel)]="content"
          [name]="'comment-' + postId()"
        />
      </label>
      <button
        type="submit"
        class="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 text-xl text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
        [disabled]="!content.trim()"
      >
        <app-icon [name]="'chatbubble-outline'" [ariaLabel]="'Comentar'" />
      </button>
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
