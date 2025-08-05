import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);

  // Check if the user is authenticated via local cache / behavior subject
  if (authService.currentUserSubject.value) return true;
  else {
    // If no in memory user, fetch session data from API
    await authService.getSession();
    if (authService.currentUserSubject.value) return true;
  }

  return false;
};
