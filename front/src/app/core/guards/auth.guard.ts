import {inject} from "@angular/core";
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import {AuthService} from "@core/services/auth/auth.service";

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = authService.isLoggedIn();

  if(!isLoggedIn){
    return router.createUrlTree(['/login'])
  }

  return true;
};
