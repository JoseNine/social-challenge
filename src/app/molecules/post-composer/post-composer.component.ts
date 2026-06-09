import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../atoms/icon/icon.component';
import { CreatePostInput } from '../../interfaces/post.interface';

@Component({
  selector: 'app-post-composer',
  imports: [FormsModule, IconComponent],
  host: { class: 'block' },
  template: `
    <form class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm" (ngSubmit)="submit()">
      <label class="block">
        <span class="mb-1 block text-xs font-medium text-slate-500">Nuevo post</span>
        <textarea
          class="min-h-28 w-full resize-y rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
          placeholder="Compartí una actualización..."
          [(ngModel)]="content"
          name="content"
        ></textarea>
      </label>

      <div class="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_auto]">
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-slate-500">Imagen opcional</span>
          <input
            class="h-12 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            placeholder="https://..."
            [(ngModel)]="imageUrl"
            name="imageUrl"
          />
        </label>
        <button
          type="submit"
          class="inline-flex h-12 items-center justify-center gap-2 self-end rounded-lg bg-teal-700 px-5 text-sm font-semibold text-white transition-colors hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
          [disabled]="!content.trim()"
        >
          <app-icon [name]="'send-outline'" [ariaHidden]="true" />
          Publicar
        </button>
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
