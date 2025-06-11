import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUser } from '../models/user.model';
import { BaseService } from './base.service';
import { AuthService } from './auth.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override endpoint = '/user';
  currentUserSubject = new BehaviorSubject<Partial<IUser> | null>(null);
  currentUser$ = new Observable<Partial<IUser> | null>();

  constructor(http: HttpClient, private authService: AuthService) {
    super(http);

    this.currentUserSubject = this.authService.currentSessionSubject;
    this.currentUser$ = this.authService.currentSession$;
  }

  // Have to override because not inheriting from BaseService
  override update(id: string, item: Partial<IUser>): Observable<IUser> {
    return super.update(id, item).pipe(
      tap((updatedUser) => {
        // Update the current user subject if the updated user is the current user
        const current = this.currentUserSubject.value;
        if (current && current._id === updatedUser._id) {
          this.currentUserSubject.next({ ...current, ...updatedUser });
        }
      })
    );
  }
}
