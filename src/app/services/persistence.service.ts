import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { SocialState } from '../interfaces/social-state.interface';

const STORAGE_KEY = 'it-rock-social-state';

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  private readonly platformId = inject(PLATFORM_ID);

  load(): Partial<SocialState> | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const rawState = localStorage.getItem(STORAGE_KEY);
    if (!rawState) {
      return null;
    }

    try {
      return JSON.parse(rawState) as Partial<SocialState>;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  save(state: SocialState): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentUser: state.currentUser,
        posts: state.posts,
        hydrated: true,
      }),
    );
  }

  clear(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
