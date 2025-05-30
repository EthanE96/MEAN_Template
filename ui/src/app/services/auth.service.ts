import { Injectable } from '@angular/core';

// TODO: How to accommodate staging / prod
import { environment } from '../../envs/envs.local';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseURL = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  checkAuth() {
    this.http.get(`${this.baseURL}/auth/me`, { withCredentials: true });
  }

  loginWithGoogle() {}

  loginWithLocal() {}

  logout() {}

  handleUnauthenticated() {}
}
