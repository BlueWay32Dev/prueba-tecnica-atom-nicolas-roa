export interface AuthResponse {
  credentials: boolean;
  accessToken: string;
  refreshToken: string;
  userId: string;
  email?: string;
}
