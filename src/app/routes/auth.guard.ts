import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SocialStore } from '../store/social.store';

export const authGuard: CanActivateFn = () => {
  const store = inject(SocialStore);
  const router = inject(Router);

  store.hydrate();

  return store.isAuthenticated() || router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const store = inject(SocialStore);
  const router = inject(Router);

  store.hydrate();

  return store.isAuthenticated() ? router.createUrlTree(['/feed']) : true;
};
