import { Injectable } from '@angular/core';
import { environment } from '../../envs/envs';
import Clarity from '@microsoft/clarity';

@Injectable({
  providedIn: 'root',
})
export class ClarityService {
  // Clarity project ID, should be injected at build time
  private projectId = `${environment.clarityProjectId}`;

  constructor() {}

  initializeClarity(): void {
    if (!environment.production || !this.projectId || this.projectId === '') {
      console.log(
        'Clarity not initialized in non-production environment or missing project ID.'
      );
      return;
    }

    Clarity.init(this.projectId);
  }
}
