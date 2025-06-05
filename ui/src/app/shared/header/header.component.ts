import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, PanelLeftOpen, Settings } from 'lucide-angular';
import { ThemeComponent } from '../theme/theme.component';
import { IUser } from '../../models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, AsyncPipe, NgIf],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Settings = Settings;

  @Input() isDrawerOpen: boolean = false;
  @Input() currentUser$ = new Observable<Partial<IUser> | null>();
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

  onProfile() {
    this.router.navigate(['/profile']);
  }

  onApp() {
    this.router.navigate(['/app']);
  }
}
