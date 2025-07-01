import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  // Inject services inside the function
  const authService = inject(AuthService);

  // Check if the user is authenticated via cache / behavior subject
  if (authService.isAuthenticated()) return true;

  // Check if the user is authenticated via session
  await authService.getSession().catch(() => {});
  if (authService.isAuthenticated()) return true;

  return false;
};
