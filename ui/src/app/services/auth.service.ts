import { Injectable } from '@angular/core';
import { environment } from '../../envs/envs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})

// All routing will be handled by the UI, so this service will only handle authentication
export class AuthService {
  private baseURL = `${environment.apiUrl}/auth`;
  currentUserSubject = new BehaviorSubject<Partial<IUser> | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    console.log(this.baseURL);
  }

  // Updates the currentUserSubject with session user data
  async getSession(): Promise<Partial<IUser> | null> {
    return new Promise<Partial<IUser> | null>((resolve, reject) => {
      this.http
        .get<{ authenticated: boolean; user: Partial<IUser>; error: any }>(
          `${this.baseURL}/me`,
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (
              response.authenticated &&
              response.user &&
              Object.keys(response.user).length > 0
            ) {
              this.currentUserSubject.next(response.user);
              resolve(response.user);
            }
          },
          error: (error) => {
            this.handleUnauthenticated();
            reject(error);
          },
        });
    });
  }

  // Redirects to the google login page, then to the callback URL, sets session
  authWithGoogle(): void {
    window.location.href = `${this.baseURL}/google`;
  }

  // Redirects to the google login page, then to the callback URL, sets session
  authWithGitHub(): void {
    window.location.href = `${this.baseURL}/github`;
  }

  // Local login, sets session
  async loginWithLocal(
    email: string,
    password: string,
    rememberMe?: boolean
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post(
          `${this.baseURL}/login`,
          { email, password, rememberMe },
          { withCredentials: true }
        )
        .subscribe({
          next: () => {
            resolve();
          },
          error: (error) => {
            this.handleUnauthenticated();
            reject(error);
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
        }>(`${this.baseURL}/signup`, {
          email,
          password,
          firstName,
          lastName,
        })
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
              reject(response.message || 'Registration failed');
            }
          },
          // Handle error with 4xx or 5xx status
          error: (error: any) => {
            this.handleUnauthenticated();
            reject(error || 'Registration failed');
          },
        });
    });
  }

  // Logs the user out
  logout() {
    this.http
      .post(`${this.baseURL}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        this.handleUnauthenticated();
        console.log('logout successful, service');
      });
  }

  // Updates the currentUserSubject and redirects to the login page
  handleUnauthenticated(): void {
    // Update the currentUserSubject
    this.currentUserSubject.next(null);
  }

  /**
   * Checks if the user is currently authenticated.
   *
   * This method first checks if the `currentUserSubject` has a value,
   * indicating that the user is already authenticated in the current session.
   * If not, it attempts to retrieve the session from the backend by calling `getSession()`.
   * Returns `true` if the user is authenticated, otherwise returns `false`.
   *
   * @returns {Promise<boolean>} A promise that resolves to `true` if the user is authenticated, or `false` otherwise.
   */
  async isAuthenticated(): Promise<boolean> {
    // Check if currentUserSubject has a value
    if (this.currentUserSubject.value) {
      return true;
    }

    try {
      return !!(await this.getSession());
    } catch {
      return false;
    }
  }
}
