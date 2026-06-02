import { Component, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonIcon, IonInput, IonNote } from '@ionic/angular/standalone';
import { LoginCredentials } from '../../interfaces/user.interface';

@Component({
    selector: 'app-login-form',
    imports: [ReactiveFormsModule, IonButton, IonIcon, IonInput, IonNote],
    template: `
    <form class="space-y-5" [formGroup]="form" (ngSubmit)="submit()">
      <div>
        <ion-input
          class="rounded-lg border border-slate-200 bg-white px-3"
          label="Email"
          label-placement="stacked"
          type="email"
          autocomplete="email"
          formControlName="email"
        />
        @if (emailError()) {
          <ion-note class="mt-1 block text-xs" color="danger">{{ emailError() }}</ion-note>
        }
      </div>

      <div>
        <ion-input
          class="rounded-lg border border-slate-200 bg-white px-3"
          label="Password"
          label-placement="stacked"
          type="password"
          autocomplete="current-password"
          formControlName="password"
        />
        @if (passwordError()) {
          <ion-note class="mt-1 block text-xs" color="danger">{{ passwordError() }}</ion-note>
        }
      </div>

      <ion-button class="h-11 w-full" type="submit" expand="block">
        Iniciar sesion
      </ion-button>

      <ion-button class="h-11 w-full" type="button" fill="outline" expand="block" (click)="googleLogin.emit()">
        <ion-icon name="logo-google" slot="start" aria-hidden="true" />
        Login con Google
      </ion-button>
    </form>
  `
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
