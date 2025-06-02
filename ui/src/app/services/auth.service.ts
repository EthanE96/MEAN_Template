import { Injectable } from '@angular/core';
import { environment } from '../../envs/envs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<IUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  //  Updates the currentUserSubject and redirects to the home page
  checkAuth(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.http
        .get<{ authenticated: boolean; user: IUser }>(
          `${this.baseURL}/auth/me`,
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              // Update the currentUserSubject with API response
              this.currentUserSubject.next(response.user);

              // Redirect to the home page if not already (should already)
              if (this.router.url === '/login') {
                this.router.navigate(['/app']);
              }
              resolve();
            } else {
              this.handleUnauthenticated();
              resolve();
            }
          },
          error: () => {
            this.handleUnauthenticated();
            resolve();
          },
        });
    });
  }

  // Redirects to the google login page
  loginWithGoogle(): void {
    window.location.href = `${this.baseURL}/auth/google`;
  }

  // TODO: Implement local login
  loginWithLocal() {
    // auth/login
  }

  // Logs the user out
  logout() {
    this.http
      .get(`${this.baseURL}/auth/logout`, { withCredentials: true })
      .subscribe(() => {
        this.currentUserSubject.next(null);
      });
  }

  // Updates the currentUserSubject and redirects to the login page
  handleUnauthenticated() {
    // Update the currentUserSubject
    this.currentUserSubject.next(null);

    // Redirect to the login page
    if (this.router.url !== '/login') {
      this.router.navigate(['/login']);
    }
  }

  // Checks if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
