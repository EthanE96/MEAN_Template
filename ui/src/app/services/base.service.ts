import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { environment } from '../../envs/envs';
import { IApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  private http = inject(HttpClient);
  protected baseURL = `${environment.apiUrl}`;
  protected endpoint = ''; // Override this in derived classes

  // BehaviorSubject to hold the current list of items
  itemsSubject = new BehaviorSubject<T[] | T | null>(null);
  items$ = this.itemsSubject.asObservable();

  constructor() {}

  //^ CRUD Methods
  // GET all items for user (userId from session)
  async getAll(): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<IApiResponse<T[] | T | null>>(
          `${this.baseURL}${this.endpoint}`,
          { withCredentials: true }
        )
      );
      if (res.success && res.data) {
        this.updateSubjectWithItem(res.data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // GET item by ID for user (userId from session)
  async getById(id: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.get<IApiResponse<T>>(
          `${this.baseURL}${this.endpoint}/${id}`,
          { withCredentials: true }
        )
      );
      if (res.success && res.data) {
        this.updateSubjectWithItem(res.data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // POST - Create new item for user (userId from session)
  async create(item: Partial<T>): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.post<IApiResponse<T>>(
          `${this.baseURL}${this.endpoint}`,
          item,
          { withCredentials: true }
        )
      );
      if (res.success && res.data) {
        this.updateSubjectWithItem(res.data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // PUT - Update item for user (userId from session)
  async update(id: string, item: Partial<T>): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.put<IApiResponse<T>>(
          `${this.baseURL}${this.endpoint}/${id}`,
          item,
          { withCredentials: true }
        )
      );
      if (res.success && res.data) {
        this.updateSubjectWithItem(res.data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // DELETE - Remove item for user (userId from session)
  async delete(id: string): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.delete<IApiResponse<null>>(
          `${this.baseURL}${this.endpoint}/${id}`,
          { withCredentials: true }
        )
      );
      if (res.success) {
        this.removeItemFromSubject(id);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  // PATCH - Partial update for user (userId from session)
  async patch(id: string, item: Partial<T>): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.http.patch<IApiResponse<T>>(
          `${this.baseURL}${this.endpoint}/${id}`,
          item,
          { withCredentials: true }
        )
      );
      if (res.success && res.data) {
        this.updateSubjectWithItem(res.data);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  //^ Helper Methods
  // Helper to update the subject with a new/updated item or items
  protected updateSubjectWithItem(item: T | T[] | null) {
    if (item === null) {
      this.itemsSubject.next(null);
      return;
    }
    const current = this.itemsSubject.value;
    if (Array.isArray(item)) {
      // If item is an array, replace the subject value
      this.itemsSubject.next(item);
    } else if (Array.isArray(current)) {
      // Replace or add the item in the array
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.itemsSubject.next(current.filter((i: any) => i._id !== id));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } else if (current && (current as any)._id === id) {
      this.itemsSubject.next(null);
    }
  }

  //^ Error handling
  private handleError(error: unknown): void {
    this.itemsSubject.next(null);

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
