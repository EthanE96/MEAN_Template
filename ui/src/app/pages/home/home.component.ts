import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ThemeComponent } from '../../shared/theme/theme.component';
import { DrawerComponent } from '../../shared/drawer/drawer.component';

@Component({
  selector: 'app-home',
  imports: [
    NgIf,
    HeaderComponent,
    FooterComponent,
    DrawerComponent,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private theme = inject(ThemeComponent);

  currentTheme: string;
  isDrawerOpen: boolean = false;

  constructor() {
    this.currentTheme = this.theme.currentTheme;
  }
}
