import { AsyncPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ThemeComponent } from '../theme/theme.component';
import { LucideAngularModule, PanelLeftOpen, Settings } from 'lucide-angular';
import { IUser } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [LucideAngularModule, NgIf, AsyncPipe],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  private router = inject(Router);
  private themeComponent = inject(ThemeComponent);
  private authService = inject(AuthService);

  readonly PanelLeftOpen = PanelLeftOpen;
  readonly Settings = Settings;

  @Input() isDrawerOpen: boolean = true;
  @Output() isDrawerOpenChange = new EventEmitter();
  @Output() currentThemeChange = new EventEmitter();

  currentUser$ = new Observable<Partial<IUser> | null>();
  currentTheme: string;

  constructor() {
    this.currentTheme = this.themeComponent.currentTheme;
    this.currentUser$ = this.authService.currentUser$;
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

  onProfile() {
    this.router.navigate(['/app/profile']);
  }

  onApp() {
    this.router.navigate(['/app']);
  }
}
