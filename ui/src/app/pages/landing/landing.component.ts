import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { ArrowRight, LucideAngularModule } from 'lucide-angular';
import { ThemeComponent } from '../../shared/theme/theme.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-landing',
  imports: [NgClass, LucideAngularModule, FooterComponent, HeaderComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  readonly ArrowRight = ArrowRight;
  currentTheme: string;

  constructor(private router: Router, private theme: ThemeComponent) {
    this.currentTheme = this.theme.currentTheme;
  }

  onGetStarted() {
    this.router.navigate(['/app']);
  }

  onGetSourceCode() {
    window.open('https://github.com/EthanE96/MEAN_Template', '_blank');
  }
}
