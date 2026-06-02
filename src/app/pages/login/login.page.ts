import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthTemplateComponent } from '../../templates/auth-template/auth-template.component';
import { LoginFormComponent } from '../../molecules/login-form/login-form.component';
import { LoginCredentials } from '../../interfaces/user.interface';
import { SocialStore } from '../../store/social.store';

@Component({
  selector: 'app-login-page',
  imports: [AuthTemplateComponent, LoginFormComponent],
  template: `
    <app-auth-template>
      <section class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl sm:p-8">
        <div class="mb-8">
          <div
            class="grid size-12 place-items-center rounded-lg bg-teal-700 text-lg font-bold text-white"
          >
            IR
          </div>
          <h1 class="mt-5 text-2xl font-bold text-slate-950">Iniciar sesión</h1>
          <p class="mt-2 text-sm leading-6 text-slate-500">
            Accedé con credenciales simuladas o con el flujo OAuth mockeado de Google.
          </p>
        </div>

        <app-login-form (login)="login($event)" (googleLogin)="loginWithGoogle()" />
      </section>
    </app-auth-template>
  `,
})
export class LoginPage {
  private readonly router = inject(Router);
  private readonly store = inject(SocialStore);

  login(credentials: LoginCredentials): void {
    this.store.login(credentials);
    void this.router.navigateByUrl('/feed');
  }

  loginWithGoogle(): void {
    this.store.loginWithGoogle();
    void this.router.navigateByUrl('/feed');
  }
}
