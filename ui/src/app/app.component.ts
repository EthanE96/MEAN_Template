import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from './shared/theme/theme.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  ngOnInit() {
    // Clarity.init(projectId);
    console.log('AppComponent initialized');
  }
}
