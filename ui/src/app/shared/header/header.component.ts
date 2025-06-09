import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, PanelLeftOpen, Settings } from 'lucide-angular';
import { ThemeComponent } from '../theme/theme.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, NgIf],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Settings = Settings;

  @Input() isDrawerOpen: boolean = true;
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

  onApp() {
    this.router.navigate(['/app']);
  }
}
