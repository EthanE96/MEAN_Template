import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  LogIn,
  Sun,
  Moon,
  LucideIconData,
} from 'lucide-angular';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-landing-header',
  imports: [NgIf, LucideAngularModule],
  templateUrl: './landing-header.component.html',
})
export class LandingHeaderComponent {
  private router = inject(Router);
  private themeComponent = inject(ThemeComponent);

  readonly LogIn = LogIn;
  readonly Sun = Sun;
  readonly Moon = Moon;

  @Input() isHomeMode: boolean = true;
  @Input() isThemeDisabled: boolean = false;
  @Output() currentThemeChange = new EventEmitter();

  currentTheme: string;
  imgTheme: LucideIconData;
  logo: string;

  constructor() {
    this.currentTheme = this.themeComponent.currentTheme;
    this.imgTheme = this.currentTheme === 'dark' ? Sun : Moon;
    this.logo = this.themeComponent.logo;
  }

  onThemeToggle() {
    this.currentTheme = this.themeComponent.toggleTheme();
    this.logo = this.themeComponent.logo;
    this.imgTheme = this.currentTheme === 'dark' ? Sun : Moon;
    this.currentThemeChange.emit(this.currentTheme);
  }

  onLogin() {
    this.router.navigate(['/login']);
  }

  onSignup() {
    this.router.navigate(['/signup']);
  }

  onLogout() {
    this.router.navigate(['/logout']);
  }

  onHome() {
    this.router.navigate(['/']);
  }
}
