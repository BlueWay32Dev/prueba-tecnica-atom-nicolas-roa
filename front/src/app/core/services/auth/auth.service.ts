import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpErrorResponse } from "@angular/common/http";
import { firstValueFrom, throwError } from "rxjs";
import { environment } from "@environments/environment.development";
import { LoginResponseDto } from "@core/models/login-response.dto";
import { LoginRequestDto } from "@core/models/login-request.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly accessTokenKey = 'access-token';
  private readonly refreshTokenKey = 'refresh-token';

  constructor(private http: HttpClient) {}

  async authenticate(email: string, endpoint: 'login' | 'register'): Promise<boolean> {
    const body: LoginRequestDto = { email };

    const response = await firstValueFrom(
      this.http.post<LoginResponseDto>(`${this.apiUrl}/auth/${endpoint}`, body)
    );

    if (!response.credentials) {
      return false;
    }

    this.storeTokens(response.accessToken, response.refreshToken);
    return true;
  }

  async login(email: string): Promise<boolean> {
    return await this.authenticate(email, 'login');
  }

  async register(email: string): Promise<boolean> {
    return this.authenticate(email, 'register');
  }

  storeTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();

    if (!token) {
      throw new Error("No hay token disponible.");
    }

    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    this.clearTokens();
  }

  async refreshTokens(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      throw new Error('No refresh token available.');
    }

    try {
      const response = await firstValueFrom(
        this.http.post<LoginResponseDto>(`${this.apiUrl}/auth/refresh`, {}, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${refreshToken}`
          })
        })
      );

      if (response.accessToken && response.refreshToken) {
        this.storeTokens(response.accessToken, response.refreshToken);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      this.logout();
      return false;
    }
  }
}
