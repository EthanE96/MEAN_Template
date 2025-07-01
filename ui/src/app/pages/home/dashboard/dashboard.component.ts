import { Component } from '@angular/core';
import { environment } from '../../../../envs/envs';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private apiURL = environment.apiUrl;

  onGetSourceCode() {
    window.open('https://github.com/EthanE96/MEAN_Template', '_blank');
  }

  onGetDocumentation() {
    window.open(`${this.apiURL}/api-docs/#/`, '_blank');
  }
}
