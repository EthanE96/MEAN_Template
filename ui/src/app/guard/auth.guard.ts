import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  // Inject services inside the function
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is authenticated via cache / behavior subject
  if (authService.isAuthenticated()) return true;

  // Check if the user is authenticated via session
  await authService.getSession().catch(() => {});
  if (authService.isAuthenticated()) return true;

  // Redirect to home page if not authenticated
  await router.navigate(['/']);
  return false;
};
