import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        snackBar.open('Tu sesión expiró. Inicia sesión nuevamente.', 'Cerrar', {
          duration: 3000,
        });
      } else if (error.status >= 500) {
        snackBar.open('Ocurrió un error en el servidor.', 'Cerrar', {
          duration: 3000,
        });
      }

      return throwError(() => error);
    })
  );
};
