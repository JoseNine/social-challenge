import { SocialComment } from './comment.interface';

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarColor: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  likes: number;
  saved: boolean;
  comments: SocialComment[];
}

export interface CreatePostInput {
  content: string;
  imageUrl?: string;
}
