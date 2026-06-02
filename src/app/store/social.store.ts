import { computed, inject, Injectable, signal } from '@angular/core';
import { CreatePostInput, SocialPost } from '../interfaces/post.interface';
import { SocialState } from '../interfaces/social-state.interface';
import { AuthUser, LoginCredentials } from '../interfaces/user.interface';
import { PersistenceService } from '../services/persistence.service';

const seededPosts: SocialPost[] = [
  {
    id: 'post-1',
    authorId: 'seed-ana',
    authorName: 'Ana Torres',
    authorAvatarColor: '#0f766e',
    content:
      'Probando el nuevo timeline interno. La idea es que cada post se actualice al instante y conserve comentarios entre sesiones.',
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-05-27T14:35:00.000Z').toISOString(),
    likes: 8,
    saved: false,
    comments: [
      {
        id: 'comment-1',
        postId: 'post-1',
        authorId: 'seed-marco',
        authorName: 'Marco Ruiz',
        content: 'Quedo muy claro el flujo, especialmente en mobile.',
        createdAt: new Date('2026-05-27T15:10:00.000Z').toISOString(),
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'seed-lucia',
    authorName: 'Lucia Perez',
    authorAvatarColor: '#2563eb',
    content:
      'Checklist para el desafio: SSR activo, estado global con signals de Angular, persistencia local y componentes chicos por responsabilidad.',
    createdAt: new Date('2026-05-28T10:15:00.000Z').toISOString(),
    likes: 14,
    saved: true,
    comments: [],
  },
];

const initialState: SocialState = {
  currentUser: null,
  posts: seededPosts,
  hydrated: false,
};

const avatarColors = ['#0f766e', '#2563eb', '#7c3aed', '#dc2626', '#0891b2', '#4f46e5'];

function id(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function nameFromEmail(email: string): string {
  const localPart = email.split('@')[0] || 'Usuario';
  return (
    localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ') || 'Usuario'
  );
}

function userFromCredentials(credentials: LoginCredentials): AuthUser {
  const colorIndex = credentials.email.length % avatarColors.length;
  return {
    id: `user-${credentials.email.toLowerCase()}`,
    name: nameFromEmail(credentials.email),
    email: credentials.email.toLowerCase(),
    provider: 'credentials',
    avatarColor: avatarColors[colorIndex],
  };
}

function googleUser(): AuthUser {
  return {
    id: 'google-demo-user',
    name: 'Jose Nine',
    email: 'jose.enine@gmail.com',
    provider: 'google',
    avatarColor: '#dc2626',
  };
}

function sortPosts(posts: SocialPost[]): SocialPost[] {
  return [...posts].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
}

@Injectable({ providedIn: 'root' })
export class SocialStore {
  private readonly persistence = inject(PersistenceService);
  private readonly state = signal<SocialState>(initialState);

  readonly currentUser = computed(() => this.state().currentUser);
  readonly posts = computed(() => this.state().posts);
  readonly hydrated = computed(() => this.state().hydrated);
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly totalComments = computed(() =>
    this.posts().reduce((total, post) => total + post.comments.length, 0),
  );
  readonly totalLikes = computed(() => this.posts().reduce((total, post) => total + post.likes, 0));

  hydrate(): void {
    if (this.hydrated()) {
      return;
    }

    const storedState = this.persistence.load();
    this.patchState({
      currentUser: storedState?.currentUser ?? initialState.currentUser,
      posts: sortPosts(storedState?.posts?.length ? storedState.posts : initialState.posts),
      hydrated: true,
    });
  }

  login(credentials: LoginCredentials): void {
    this.patchState({ currentUser: userFromCredentials(credentials), hydrated: true });
    this.persist();
  }

  loginWithGoogle(): void {
    this.patchState({ currentUser: googleUser(), hydrated: true });
    this.persist();
  }

  logout(): void {
    this.patchState({ currentUser: null, hydrated: true });
    this.persist();
  }

  createPost(input: CreatePostInput): void {
    const user = this.currentUser();
    const content = input.content.trim();

    if (!user || !content) {
      return;
    }

    const newPost: SocialPost = {
      id: id('post'),
      authorId: user.id,
      authorName: user.name,
      authorAvatarColor: user.avatarColor,
      content,
      imageUrl: input.imageUrl?.trim() || undefined,
      createdAt: new Date().toISOString(),
      likes: 0,
      saved: false,
      comments: [],
    };

    this.patchState({ posts: sortPosts([newPost, ...this.posts()]) });
    this.persist();
  }

  createComment(postId: string, content: string): void {
    const user = this.currentUser();
    const normalizedContent = content.trim();

    if (!user || !normalizedContent) {
      return;
    }

    const posts = this.posts().map((post) => {
      if (post.id !== postId) {
        return post;
      }

      return {
        ...post,
        comments: [
          ...post.comments,
          {
            id: id('comment'),
            postId,
            authorId: user.id,
            authorName: user.name,
            content: normalizedContent,
            createdAt: new Date().toISOString(),
          },
        ],
      };
    });

    this.patchState({ posts });
    this.persist();
  }

  toggleLike(postId: string): void {
    this.patchState({
      posts: this.posts().map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post,
      ),
    });
    this.persist();
  }

  toggleSaved(postId: string): void {
    this.patchState({
      posts: this.posts().map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post,
      ),
    });
    this.persist();
  }

  private patchState(partialState: Partial<SocialState>): void {
    this.state.update((state) => ({ ...state, ...partialState }));
  }

  private persist(): void {
    this.persistence.save(this.state());
  }
}
