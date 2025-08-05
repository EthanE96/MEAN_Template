import { inject, Injectable } from '@angular/core';
import { environment } from '../../envs/envs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
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
    try {
      const res = await firstValueFrom(
        this.http.get<IApiResponse<Partial<IUser> | null>>(
          `${this.baseURL}/auth/me`,
          { withCredentials: true }
        )
      );

      if (res.success && res.data) {
        this.currentUserSubject.next(res.data);
      }
    } catch (error) {
      this.handleUnauthenticated(error);
    }
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
  async loginWithLocal(email: string, password: string, rememberMe?: boolean) {
    try {
      const res = await firstValueFrom(
        this.http.post<IApiResponse<Partial<IUser> | null>>(
          `${this.baseURL}/auth/login`,
          { email, password, rememberMe },
          { withCredentials: true }
        )
      );

      if (res.success && res.data) {
        this.currentUserSubject.next(res.data);
      }
    } catch (error) {
      this.handleUnauthenticated(error);
    }
  }

  // Local signup
  async signUpWithLocal(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    try {
      const res = await firstValueFrom(
        this.http.post<IApiResponse<Partial<IUser> | null>>(
          `${this.baseURL}/auth/signup`,
          { email, password, firstName, lastName },
          { withCredentials: true }
        )
      );

      if (res.success && res.data) {
        this.currentUserSubject.next(res.data);
      }
    } catch (error) {
      this.handleUnauthenticated(error);
    }
  }

  // Logs the user out
  async logout() {
    try {
      await firstValueFrom(
        this.http.post<IApiResponse<null>>(
          `${this.baseURL}/auth/logout`,
          {},
          { withCredentials: true }
        )
      );

      // Clear the current user subject
      this.currentUserSubject.next(null);
    } catch (error) {
      this.handleUnauthenticated(error);
    }
  }

  //^ User Methods
  // Methods using req.user from the auth middleware
  async updateUser(user: Partial<IUser>) {
    try {
      const res = await firstValueFrom(
        this.http.put<IApiResponse<Partial<IUser> | null>>(
          `${this.baseURL}/user`,
          user,
          { withCredentials: true }
        )
      );

      if (res.success && res.data) {
        this.currentUserSubject.next(res.data);
      }
    } catch (error) {
      this.handleUnauthenticated(error);
    }
  }

  async deleteUser() {
    try {
      const res = await firstValueFrom(
        this.http.delete<IApiResponse<null>>(`${this.baseURL}/user`, {
          withCredentials: true,
        })
      );

      if (res.success) {
        this.currentUserSubject.next(null);
      }
    } catch (error) {
      this.handleUnauthenticated(error);
    }
  }

  //^ Error Handling
  // Updates the currentUserSubject and redirects to the login page
  handleUnauthenticated(error?: unknown): void {
    this.currentUserSubject.next(null);

    // Log the error for debugging
    if (error instanceof HttpErrorResponse) {
      console.warn(
        'HTTP Error:',
        error.status,
        error.name,
        error.message,
        error.error as IApiResponse<null>
      );

      throw error as HttpErrorResponse;
    }
  }
}
