import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  PanelLeftOpen,
  Settings,
  Sun,
  Moon,
  LogIn,
} from 'lucide-angular';
import { ThemeComponent } from '../theme/theme.component';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, NgIf],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Settings = Settings;
  readonly Sun = Sun;
  readonly Moon = Moon;
  readonly LogIn = LogIn;

  @Input() isDrawerOpen: boolean = true;
  @Input() isInfoMode: boolean = false;
  @Input() isThemeDisabled: boolean = false;
  @Output() isDrawerOpenChange = new EventEmitter();
  @Output() currentThemeChange = new EventEmitter();

  currentTheme: string;
  imgTheme: any;
  logo: string;

  constructor(private router: Router, private themeComponent: ThemeComponent) {
    this.currentTheme = this.themeComponent.currentTheme;
    this.imgTheme = this.currentTheme === 'dark' ? Sun : Moon;
    this.logo = this.themeComponent.logo;
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
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
