import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ThemeComponent } from '../../shared/theme/theme.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  currentTheme: string;

  constructor(private theme: ThemeComponent) {
    this.currentTheme = this.theme.currentTheme;
  }
}
