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

  @Input() isDrawerOpen: boolean = false;
  @Output() isDrawerOpenChange = new EventEmitter();
  @Output() currentThemeChange = new EventEmitter();

  currentTheme: string;

  constructor(private router: Router, private themeComponent: ThemeComponent) {
    this.currentTheme = this.themeComponent.currentTheme;
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }
  // Might move to settings component
  onThemeToggle() {
    this.currentTheme = this.themeComponent.toggleTheme();
    this.currentThemeChange.emit(this.currentTheme);
  }

  onLogout() {
    this.router.navigate(['/logout']);
  }

  onApp() {
    this.router.navigate(['/app']);
  }
}
