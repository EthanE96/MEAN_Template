import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  // Inject services inside the function
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is already authenticated
  if (authService.isAuthenticated()) {
    return true;
  }

  // If not authenticated, check API authentication status
  await authService.checkAuth();

  if (authService.isAuthenticated()) {
    return true;
  } else {
    // If still not authenticated, redirect to login page
    router.navigate(['/login']);
    return false;
  }
};
