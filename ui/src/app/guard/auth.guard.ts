import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  // Inject services inside the function
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check API authentication status
  await authService.checkAuth();

  // Check if the user is authenticated
  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
