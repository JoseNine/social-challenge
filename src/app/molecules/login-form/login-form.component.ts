import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IconComponent } from '../../atoms/icon/icon.component';
import { LoginCredentials } from '../../interfaces/user.interface';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, IconComponent],
  template: `
    <form class="space-y-5" [formGroup]="form" (ngSubmit)="submit()">
      <div>
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-slate-500">Email</span>
          <input
            class="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            type="email"
            autocomplete="email"
            formControlName="email"
          />
        </label>
        @if (emailError()) {
          <p class="mt-1 block text-xs text-rose-600">{{ emailError() }}</p>
        }
      </div>

      <div>
        <label class="block">
          <span class="mb-1 block text-xs font-medium text-slate-500">Password</span>
          <input
            class="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20"
            type="password"
            autocomplete="current-password"
            formControlName="password"
          />
        </label>
        @if (passwordError()) {
          <p class="mt-1 block text-xs text-rose-600">{{ passwordError() }}</p>
        }
      </div>

      <button
        type="submit"
        class="h-11 w-full rounded-lg bg-teal-700 text-sm font-semibold text-white transition-colors hover:bg-teal-800"
      >
        Iniciar sesion
      </button>

      <button
        type="button"
        class="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-teal-700 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50"
        (click)="googleLogin.emit()"
      >
        <app-icon [name]="'logo-google'" [ariaHidden]="true" />
        Login con Google
      </button>
    </form>
  `,
})
export class LoginFormComponent {
  login = output<LoginCredentials>();
  googleLogin = output<void>();

  form = new FormBuilder().nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.login.emit(this.form.getRawValue());
  }

  emailError(): string {
    const control = this.form.controls.email;
    if (!control.touched) {
      return '';
    }

    if (control.hasError('required')) {
      return 'El email es requerido.';
    }

    return control.hasError('email') ? 'Ingresá un email válido.' : '';
  }

  passwordError(): string {
    const control = this.form.controls.password;
    return control.touched && control.hasError('required') ? 'La contraseña es requerida.' : '';
  }
}
