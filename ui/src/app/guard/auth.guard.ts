import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  // Inject services inside the function
  const authService = inject(AuthService);
  const router = inject(Router);

  if (await authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
