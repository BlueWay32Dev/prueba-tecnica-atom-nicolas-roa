import { TestBed } from '@angular/core/testing';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('debería activar el loading correctamente', (done) => {
    service.setLoading(true);

    service.loading$.subscribe((isLoading) => {
      if (isLoading) {
        expect(isLoading).toBeTrue();
        done();
      }
    });
  });

  it('debería desactivar el loading correctamente', (done) => {
    service.setLoading(false);

    service.loading$.subscribe((isLoading) => {
      if (!isLoading) {
        expect(isLoading).toBeFalse();
        done();
      }
    });
  });
});
