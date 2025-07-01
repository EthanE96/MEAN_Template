import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-theme',
  imports: [],
  templateUrl: './theme.component.html',
})
export class ThemeComponent implements OnInit {
  defaultTheme: string = 'dark'; // change default daisyui theme
  alternateTheme: string = 'night'; // change alternate daisyui theme

  currentTheme: string = this.defaultTheme;
  logo: string = this.currentLogo();

  ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.currentTheme = savedTheme;
    }
    this.setTheme(this.currentTheme);
    this.logo = this.currentLogo();
  }

  setTheme(theme: string): void {
    const htmlElement = document.querySelector('html') || document.body;
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.currentTheme =
      this.currentTheme === this.defaultTheme
        ? this.alternateTheme
        : this.defaultTheme;

    this.setTheme(this.currentTheme);
    this.logo = this.currentLogo();
    return this.currentTheme;
  }

  // Update to accommodate multiple logo themes
  currentLogo() {
    return `/logo/logo.png`;
  }
}
