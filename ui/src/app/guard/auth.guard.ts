import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is authenticated via local cache / behavior subject
  if (authService.currentUserSubject.value) return true;
  else {
    // If no in memory user, fetch session data from API
    await authService.getSession().catch(() => {
      // If session fetch fails, redirect to login
      router.navigate(['/login']);
      return false;
    });

    if (authService.currentUserSubject.value) return true;
  }

  await router.navigate(['/login']);
  return false;
};
