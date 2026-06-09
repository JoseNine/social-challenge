import { computed, inject, Injectable, signal } from '@angular/core';
import { CreatePostInput, SocialPost } from '../interfaces/post.interface';
import { SocialState } from '../interfaces/social-state.interface';
import { AuthUser, LoginCredentials } from '../interfaces/user.interface';
import { PersistenceService } from '../services/persistence.service';

// Builds a list of placeholder liker IDs so seeded posts start with a realistic count.
function seedLikers(count: number): string[] {
  return Array.from({ length: Math.max(0, count) }, (_, index) => `seed-liker-${index + 1}`);
}

const seededPosts: SocialPost[] = [
  {
    id: 'post-1',
    authorId: 'seed-ana',
    authorName: 'Ana Torres',
    authorAvatarColor: '#0f766e',
    content:
      '👋 Bienvenido a IT Rock Social. Entrá con credenciales simuladas o con el flujo OAuth mockeado de Google: tu sesión queda guardada y te lleva directo al feed.',
    imageUrl:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-05-27T14:35:00.000Z').toISOString(),
    likedBy: seedLikers(8),
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
      '⚙️ Bajo el capó: renderizado del lado del servidor (SSR) con Angular Universal, estado global con signals y persistencia local. Recargá la página y vas a ver que tus posts, likes y comentarios siguen ahí.',
    createdAt: new Date('2026-05-28T10:15:00.000Z').toISOString(),
    likedBy: seedLikers(14),
    saved: true,
    comments: [],
  },
  {
    id: 'post-3',
    authorId: 'seed-marco',
    authorName: 'Marco Ruiz',
    authorAvatarColor: '#7c3aed',
    content:
      '❤️ Tocá el corazón para dar o quitar tu like: cada usuario tiene su propio estado y el contador se actualiza al instante. ¿Querés volver a un post más tarde? Usá "Guardar" para marcarlo como favorito.',
    createdAt: new Date('2026-05-29T09:05:00.000Z').toISOString(),
    likedBy: seedLikers(5),
    saved: false,
    comments: [
      {
        id: 'comment-2',
        postId: 'post-3',
        authorId: 'seed-ana',
        authorName: 'Ana Torres',
        content: 'Se nota la diferencia, ahora el feed se siente mucho más ágil.',
        createdAt: new Date('2026-05-29T09:40:00.000Z').toISOString(),
      },
    ],
  },
  {
    id: 'post-4',
    authorId: 'seed-lucia',
    authorName: 'Lucia Perez',
    authorAvatarColor: '#0891b2',
    content:
      '💬 Sumá comentarios desde el campo de cada post y compartí tu propia actualización con el compositor de arriba (con imagen opcional). Todo es responsive, accesible y el panel de resumen te sigue mientras scrolleás.',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
    createdAt: new Date('2026-05-30T16:20:00.000Z').toISOString(),
    likedBy: seedLikers(11),
    saved: false,
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

// Older persisted posts stored an aggregate `likes` count and a shared `liked`
// flag instead of a per-user `likedBy` list. Migrate them to the current shape.
type LegacyPost = SocialPost & { likes?: number; liked?: boolean };

function normalizePosts(posts: SocialPost[]): SocialPost[] {
  return posts.map((post) => {
    const { likes, liked, ...rest } = post as LegacyPost;
    const likedBy = Array.isArray(rest.likedBy) ? rest.likedBy : seedLikers(likes ?? 0);
    return { ...rest, likedBy, saved: Boolean(rest.saved) };
  });
}

function mergeWithSeededPosts(storedPosts: SocialPost[] | undefined): SocialPost[] {
  if (!storedPosts?.length) {
    return initialState.posts;
  }

  const normalizedPosts = normalizePosts(storedPosts);
  const storedPostIds = new Set(normalizedPosts.map((post) => post.id));
  const missingSeededPosts = initialState.posts.filter((post) => !storedPostIds.has(post.id));

  return [...normalizedPosts, ...missingSeededPosts];
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
  readonly totalLikes = computed(() =>
    this.posts().reduce((total, post) => total + post.likedBy.length, 0),
  );

  hydrate(): void {
    if (this.hydrated()) {
      return;
    }

    const storedState = this.persistence.load();
    this.patchState({
      currentUser: storedState?.currentUser ?? initialState.currentUser,
      posts: sortPosts(mergeWithSeededPosts(storedState?.posts)),
      hydrated: true,
    });
    this.persist();
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
      likedBy: [],
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
    const user = this.currentUser();
    if (!user) {
      return;
    }

    this.patchState({
      posts: this.posts().map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const liked = post.likedBy.includes(user.id);
        return {
          ...post,
          likedBy: liked
            ? post.likedBy.filter((likerId) => likerId !== user.id)
            : [...post.likedBy, user.id],
        };
      }),
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
