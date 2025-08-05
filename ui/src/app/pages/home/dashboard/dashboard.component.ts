import { Component } from '@angular/core';
import { environment } from '../../../../envs/envs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private apiURL = environment.apiUrl;
  private documentationUrl = `${environment.documentationUrl}`;

  onGetSourceCode() {
    window.open('https://github.com/EthanE96/MEAN_Template', '_blank');
  }

  onGetAPIDocs() {
    window.open(`${this.apiURL}/swagger/docs/`, '_blank');
  }

  onGetDesignDocs() {
    window.open(this.documentationUrl, '_blank');
  }
}
