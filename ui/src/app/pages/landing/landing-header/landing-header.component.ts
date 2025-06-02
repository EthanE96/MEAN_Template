import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  PanelLeftOpen,
  Settings,
  LogIn,
  Sun,
  Moon,
} from 'lucide-angular';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-landing-header',
  imports: [NgIf, LucideAngularModule],
  templateUrl: './landing-header.component.html',
})
export class LandingHeaderComponent {
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Settings = Settings;
  readonly LogIn = LogIn;
  readonly Sun = Sun;
  readonly Moon = Moon;

  @Input() isHomeMode: boolean = true;
  @Input() isThemeDisabled: boolean = false;
  @Output() currentThemeChange = new EventEmitter();

  currentTheme: string;
  imgTheme: any;
  logo: string;

  constructor(private router: Router, private themeComponent: ThemeComponent) {
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

  onApp() {
    this.router.navigate(['/app']);
  }

  onHome() {
    this.router.navigate(['/']);
  }
}
