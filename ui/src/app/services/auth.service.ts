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
  private currentUserSubject = new BehaviorSubject<Partial<IUser> | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  // Updates the currentUserSubject
  async checkAuth(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .get<{ authenticated: boolean; user: Partial<IUser> }>(
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
              reject(response);
            }
          },
          error: (err) => {
            this.handleUnauthenticated();
            reject(err);
          },
        });
    });
  }

  // Redirects to the google login page, then to the callback URL
  loginWithGoogle(): void {
    window.location.href = `${this.baseURL}/auth/google`;
  }

  // Local login
  async loginWithLocal(email: string, password: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.http
        .post<{
          authenticated: boolean;
          message: string;
          user: Partial<IUser>;
        }>(
          `${this.baseURL}/auth/local/login`,
          { email, password },
          { withCredentials: true }
        )
        .subscribe({
          next: (response) => {
            if (response.authenticated) {
              this.currentUserSubject.next(response.user);
              resolve();
            } else {
              reject(response);
            }
          },
          error: (err) => {
            this.handleUnauthenticated();
            reject(err);
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
            } else {
              reject(response.message);
            }
          },
          error: (err) => {
            this.handleUnauthenticated();
            reject(err);
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
  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }
}
