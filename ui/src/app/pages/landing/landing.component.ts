import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { ArrowRight, LucideAngularModule } from 'lucide-angular';
import { ThemeComponent } from '../../shared/theme/theme.component';
import { LandingFooterComponent } from './landing-footer/landing-footer.component';
import { LandingHeaderComponent } from './landing-header/landing-header.component';

@Component({
  selector: 'app-landing',
  imports: [
    NgClass,
    LucideAngularModule,
    LandingHeaderComponent,
    LandingFooterComponent,
  ],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  private router = inject(Router);
  private theme = inject(ThemeComponent);

  readonly ArrowRight = ArrowRight;
  currentTheme: string;

  constructor() {
    this.currentTheme = this.theme.currentTheme;
  }

  onApp() {
    this.router.navigate(['/login']);
  }

  onGetSourceCode() {
    window.open('https://github.com/EthanE96/MEAN_Template', '_blank');
  }
}
