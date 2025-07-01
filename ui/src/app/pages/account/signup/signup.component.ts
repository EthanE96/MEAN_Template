import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { LandingHeaderComponent } from '../../landing/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/landing-footer/landing-footer.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { MessageComponent } from '../../../shared/message/message.component';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    LandingFooterComponent,
    LandingHeaderComponent,
    SignupFormComponent,
    MessageComponent,
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private theme = inject(ThemeComponent);
  private router = inject(Router);

  logo: string;
  currentStep: number = 1;
  error?: string;

  constructor() {
    this.logo = this.theme.logo;
  }

  async ngOnInit() {
    this.router.navigate(['/app']);
  }

  signupWithGoogle() {
    this.authService.authWithGoogle();
  }

  signupWithGithub() {
    this.authService.authWithGitHub();
  }

  handleStepChange(step: number) {
    this.currentStep = step;
  }

  handleErrorChange(error: string) {
    this.error = error;

    setTimeout(() => {
      this.error = undefined;
    }, 5500);
  }
}
