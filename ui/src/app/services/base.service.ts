import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../envs/envs';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T = any> {
  protected baseURL = environment.apiUrl;
  protected endpoint = ''; // Override this in derived classes

  // The userId to use for all requests (must be set by consumer)
  userId: string | null = null;

  // BehaviorSubject to hold the current list of items
  protected itemsSubject = new BehaviorSubject<T[] | T | null>(null);
  items$ = this.itemsSubject.asObservable();

  constructor(protected http: HttpClient) {}

  // GET all items for user
  getAll(): Observable<T[]> {
    if (!this.userId) throw new Error('userId is required');
    const params = new HttpParams().set('userId', this.userId);
    return this.http.get<T[]>(`${this.baseURL}${this.endpoint}`, {
      withCredentials: true,
      params,
    });
  }

  // GET item by ID for user
  getById(id: string): Observable<T> {
    if (!this.userId) throw new Error('userId is required');
    const params = new HttpParams().set('userId', this.userId);
    return this.http.get<T>(`${this.baseURL}${this.endpoint}/${id}`, {
      withCredentials: true,
      params,
    });
  }

  // POST - Create new item for user
  create(item: Partial<T>): Observable<T> {
    if (!this.userId) throw new Error('userId is required');
    // Attach userId to body if not present
    const body = { ...item, userId: this.userId };
    return this.http
      .post<T>(`${this.baseURL}${this.endpoint}`, body, {
        withCredentials: true,
      })
      .pipe(tap((created) => this.updateSubjectWithItem(created)));
  }

  // PUT - Update item for user
  update(id: string, item: Partial<T>): Observable<T> {
    if (!this.userId) throw new Error('userId is required');
    // Attach userId to body if not present
    const body = { ...item, userId: this.userId };
    return this.http
      .put<T>(`${this.baseURL}${this.endpoint}/${id}`, body, {
        withCredentials: true,
      })
      .pipe(tap((updated) => this.updateSubjectWithItem(updated)));
  }

  // DELETE - Remove item for user
  delete(id: string): Observable<void> {
    if (!this.userId) throw new Error('userId is required');
    const params = new HttpParams().set('userId', this.userId);
    return this.http
      .delete<void>(`${this.baseURL}${this.endpoint}/${id}`, {
        withCredentials: true,
        params,
      })
      .pipe(tap(() => this.removeItemFromSubject(id)));
  }

  // PATCH - Partial update for user
  patch(id: string, item: Partial<T>): Observable<T> {
    if (!this.userId) throw new Error('userId is required');
    // Attach userId to body if not present
    const body = { ...item, userId: this.userId };
    return this.http.patch<T>(`${this.baseURL}${this.endpoint}/${id}`, body, {
      withCredentials: true,
    });
  }

  // Helper to update the subject with a new/updated item
  protected updateSubjectWithItem(item: T) {
    const current = this.itemsSubject.value;
    if (Array.isArray(current)) {
      // Replace or add the item in the array
      const idx = current.findIndex((i: any) => i._id === (item as any)._id);
      if (idx !== -1) {
        const updated = [...current];
        updated[idx] = item;
        this.itemsSubject.next(updated);
      } else {
        this.itemsSubject.next([...current, item]);
      }
    } else {
      this.itemsSubject.next(item);
    }
  }

  // Helper to remove an item from the subject
  protected removeItemFromSubject(id: string) {
    const current = this.itemsSubject.value;
    if (Array.isArray(current)) {
      this.itemsSubject.next(current.filter((i: any) => i._id !== id));
    } else if (current && (current as any)._id === id) {
      this.itemsSubject.next(null);
    }
  }
}
