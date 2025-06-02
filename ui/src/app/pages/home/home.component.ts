import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ThemeComponent } from '../../shared/theme/theme.component';
import { DrawerComponent } from '../../shared/drawer/drawer.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NgIf, HeaderComponent, FooterComponent, DrawerComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  currentTheme: string;
  isDrawerOpen: boolean = false;

  constructor(private theme: ThemeComponent) {
    this.currentTheme = this.theme.currentTheme;
  }
}
