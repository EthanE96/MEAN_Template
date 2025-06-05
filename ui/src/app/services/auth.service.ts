import { Injectable } from '@angular/core';
import { environment } from '../../envs/envs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<Partial<IUser> | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Updates the currentUserSubject
  async checkAuth(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .get<{ authenticated: boolean; user: Partial<IUser>; error: any }>(
          `${this.baseURL}/auth/me`,
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              this.currentUserSubject.next(response.user);
              resolve();
            } else {
              this.handleUnauthenticated();
              reject(response.error);
            }
          },
          error: (error) => {
            this.handleUnauthenticated();
            reject(error);
          },
        });
    });
  }

  // Redirects to the google login page, then to the callback URL
  authWithGoogle(): void {
    window.location.href = `${this.baseURL}/auth/google`;
  }

  // Redirects to the google login page, then to the callback URL
  authWithGitHub(): void {
    window.location.href = `${this.baseURL}/auth/github`;
  }

  // Local login
  async loginWithLocal(
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post<{
          authenticated: boolean;
          message: string;
          user: Partial<IUser>;
        }>(
          `${this.baseURL}/auth/login`,
          { email, password, rememberMe },
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              this.currentUserSubject.next(response.user);
              // Redirect to the home page after successful login
              window.location.href = '/app';
              resolve();
            }
            // Handle non auth with 200 status
            else {
              reject(response.message || 'Login failed');
            }
          },
          error: (error) => {
            this.handleUnauthenticated();
            reject(error.error.message || 'Login failed');
          },
        });
    });
  }

  // Local signup
  async signUpWithLocal(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post<{
          authenticated: boolean;
          message: string;
          user: Partial<IUser>;
        }>(
          `${this.baseURL}/auth/register`,
          { email, password, firstName, lastName },
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              this.currentUserSubject.next(response.user);
              resolve();
            }
            // Handle non auth with 200 status
            else {
              reject(response.message || 'Registration failed');
            }
          },
          // Handle error with 4xx or 5xx status
          error: (error: any) => {
            this.handleUnauthenticated();
            reject(error.error.message || 'Registration failed');
          },
        });
    });
  }

  // Logs the user out
  async logout() {
    this.http
      .get(`${this.baseURL}/auth/logout`, { withCredentials: true })
      .subscribe(() => {
        this.currentUserSubject.next(null);
      });
  }

  // Updates the currentUserSubject and redirects to the login page
  handleUnauthenticated(): void {
    // Update the currentUserSubject
    this.currentUserSubject.next(null);
  }

  // Checks if the user is authenticated
  async isAuthenticated(): Promise<boolean> {
    // Check if currentUserSubject has a value
    if (this.currentUserSubject.value) {
      return true;
    }
    try {
      await this.checkAuth();
      return true;
    } catch {
      return false;
    }
  }
}
