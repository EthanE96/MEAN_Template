import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from './shared/theme/theme.component';
import Clarity from '@microsoft/clarity';
import { environment } from '../envs/envs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // @ts-expect-error: Clarity project ID is not defined in the environment
  private projectId = `${environment.clarityProjectId}`;

  ngOnInit() {
    if (!environment.production || !this.projectId || this.projectId === '') {
      console.log(
        'Clarity not initialized in non-production environment or missing project ID.'
      );
      return;
    }

    Clarity.init(this.projectId);
  }
}
