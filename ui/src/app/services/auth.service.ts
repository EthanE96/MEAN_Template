import { inject, Injectable } from '@angular/core';
import { environment } from '../../envs/envs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/user.model';
import { IApiResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private baseURL = `${environment.apiUrl}`;
  currentUserSubject = new BehaviorSubject<Partial<IUser> | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  constructor() {}

  //^ Auth Methods
  // Updates the currentUserSubject with session user data
  async getSession(): Promise<void> {
    this.http
      .get<IApiResponse<Partial<IUser>>>(`${this.baseURL}/auth/me`, {
        withCredentials: true,
      })
      .subscribe({
        next: (res) => {
          if (res.success) {
          }
        },
        error: (error) => {},
      });

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
              this.currentUserSubject.next(response.user);
              resolve(response.user);
            } else {
              this.handleUnauthenticated();
              resolve(null);
            }
          },
          // Handle error with 4xx or 5xx status
          error: (error) => {
            this.handleUnauthenticated();
            reject(error);
          },
        });
    });
  }

  // Redirects to the google login page, then to the callback URL, sets session
  authWithGoogle(): void {
    window.location.href = `${this.baseURL}/auth/google`;
  }

  // Redirects to the google login page, then to the callback URL, sets session
  authWithGitHub(): void {
    window.location.href = `${this.baseURL}/auth/github`;
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
          `${this.baseURL}/auth/login`,
          { email, password, rememberMe },
          { withCredentials: true }
        )
        .subscribe({
          next: () => {
            resolve();
          },
          // Handle error with 4xx or 5xx status
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
        .post(
          `${this.baseURL}/auth/signup`,
          {
            email,
            password,
            firstName,
            lastName,
          },
          { withCredentials: true }
        )
        .subscribe({
          next: () => {
            resolve();
          },
          // Handle error with 4xx or 5xx status
          error: (error) => {
            this.handleUnauthenticated();
            reject(error);
          },
        });
    });
  }

  // Logs the user out
  logout() {
    this.http
      .post(`${this.baseURL}/auth/logout`, {}, { withCredentials: true })
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

  //^ User Methods
  updateUser(user: Partial<IUser>): Observable<Partial<IUser>> {
    return this.http.put<Partial<IUser>>(`${this.baseURL}/user`, user, {
      withCredentials: true,
    });
  }
}
