import { Injectable } from '@angular/core';
import { environment } from '../../envs/envs';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/user.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseURL = environment.apiUrl;
  private userSubject = new BehaviorSubject<Partial<IUser> | null>(null);
  user$: Observable<Partial<IUser> | null> = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateUser(user: Partial<IUser>): Observable<Partial<IUser>> {
    return this.http
      .put<Partial<IUser>>(`${this.baseURL}/user/${user._id}`, user, {
        withCredentials: true,
      })
      .pipe(
        tap({
          next: (response) => {
            this.userSubject.next(response);
          },
          error: () => {
            this.handleUnauthenticated();
          },
        })
      );
  }

  // Updates the currentUserSubject and redirects to the login page
  handleUnauthenticated(): void {
    // Update the currentUserSubject
    this.userSubject.next(null);
  }
}
