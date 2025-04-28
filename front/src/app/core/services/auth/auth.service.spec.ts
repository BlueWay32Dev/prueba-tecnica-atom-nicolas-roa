import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment.development';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.setItem('access-token', 'fake-token');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería hacer login exitosamente', async () => {
    const mockResponse = { credentials: true, accessToken: 'token123', refreshToken: 'refresh123' };

    const promise = service.login('correo@dominio.com');
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(await promise).toBeTrue();
  });

  it('debería almacenar y obtener token', () => {
    service.storeTokens('tokenAcceso', 'tokenRefresco');
    expect(service.getAccessToken()).toBe('tokenAcceso');
  });

  it('debería limpiar tokens en logout', () => {
    service.storeTokens('tokenAcceso', 'tokenRefresco');
    service.logout();
    expect(service.getAccessToken()).toBeNull();
  });
});
