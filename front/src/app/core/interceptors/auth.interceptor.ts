import { inject } from "@angular/core";
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from "@core/services/auth/auth.service";
import { from, throwError } from "rxjs";
import { catchError, switchMap } from "rxjs/operators";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getAccessToken();

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('CATCH ERROR IN INTERCEPTOR', error);

      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        // Token expirado -> refrescar
        return from(authService.refreshTokens()).pipe(
          switchMap(success => {
            if (success) {
              const newAccessToken = authService.getAccessToken();
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`
                }
              });
              return next(retryReq);
            } else {
              authService.logout();
              return throwError(() => error);
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
};
