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
  currentSessionSubject = new BehaviorSubject<Partial<IUser> | null>(null);
  currentSession$ = this.currentSessionSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Updates the currentSessionSubject
  async checkAuth(): Promise<Partial<IUser> | null> {
    return new Promise<Partial<IUser> | null>((resolve, reject) => {
      this.http
        .get<{ authenticated: boolean; user: Partial<IUser>; error: any }>(
          `${this.baseURL}/auth/me`,
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (
              response.authenticated &&
              response.user &&
              Object.keys(response.user).length > 0
            ) {
              this.currentSessionSubject.next(response.user);
              resolve(response.user);
            } else {
              this.handleUnauthenticated();
              reject(response || 'User is not authenticated');
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
        }>(`${this.baseURL}/auth/login`, { email, password, rememberMe })
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              this.currentSessionSubject.next(response.user);
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
        }>(`${this.baseURL}/auth/signup`, {
          email,
          password,
          firstName,
          lastName,
        })
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              this.currentSessionSubject.next(response.user);
              // Redirect to the home page after successful login
              window.location.href = '/app';
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
      .post(`${this.baseURL}/auth/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.currentSessionSubject.next(null);
        window.location.href = '/app';
      });
  }

  // Updates the currentSessionSubject and redirects to the login page
  handleUnauthenticated(): void {
    // Update the currentSessionSubject
    this.currentSessionSubject.next(null);
  }

  //Checks if the user is authenticated via API
  async isAuthenticated(): Promise<boolean> {
    // Check if currentSessionSubject has a value
    if (this.currentSessionSubject.value) {
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
