import { SocialPost } from './post.interface';
import { AuthUser } from './user.interface';

export interface SocialState {
  currentUser: AuthUser | null;
  posts: SocialPost[];
  hydrated: boolean;
}
