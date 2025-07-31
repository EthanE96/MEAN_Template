import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeComponent } from './shared/theme/theme.component';
import { ClarityService } from './services/clarity.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  private clarityService = inject(ClarityService);

  ngOnInit() {
    this.clarityService.initializeClarity();
  }
}
