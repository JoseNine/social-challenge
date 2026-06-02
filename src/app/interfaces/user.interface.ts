export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: 'credentials' | 'google';
  avatarColor: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
