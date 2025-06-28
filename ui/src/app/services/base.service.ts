import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../envs/envs';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T = any> {
  protected baseURL = environment.apiUrl;
  protected endpoint = ''; // Override this in derived classes

  // BehaviorSubject to hold the current list of items
  protected itemsSubject = new BehaviorSubject<T[] | T | null>(null);
  items$ = this.itemsSubject.asObservable();

  constructor(protected http: HttpClient) {}

  // GET all items for user (userId from session)
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseURL}${this.endpoint}`, {
      withCredentials: true,
    });
  }

  // GET item by ID for user (userId from session)
  getById(id: string): Observable<T> {
    return this.http.get<T>(`${this.baseURL}${this.endpoint}/${id}`, {
      withCredentials: true,
    });
  }

  // POST - Create new item for user (userId from session)
  create(item: Partial<T>): Observable<T> {
    return this.http
      .post<T>(`${this.baseURL}${this.endpoint}`, item, {
        withCredentials: true,
      })
      .pipe(tap((created) => this.updateSubjectWithItem(created)));
  }

  // PUT - Update item for user (userId from session)
  update(id: string, item: Partial<T>): Observable<T> {
    return this.http
      .put<T>(`${this.baseURL}${this.endpoint}/${id}`, item, {
        withCredentials: true,
      })
      .pipe(tap((updated) => this.updateSubjectWithItem(updated)));
  }

  // DELETE - Remove item for user (userId from session)
  delete(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.baseURL}${this.endpoint}/${id}`, {
        withCredentials: true,
      })
      .pipe(tap(() => this.removeItemFromSubject(id)));
  }

  // PATCH - Partial update for user (userId from session)
  patch(id: string, item: Partial<T>): Observable<T> {
    return this.http.patch<T>(`${this.baseURL}${this.endpoint}/${id}`, item, {
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
