import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { LandingHeaderComponent } from '../../landing/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/landing-footer/landing-footer.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-signup',
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    LandingFooterComponent,
    LandingHeaderComponent,
    SignupFormComponent,
  ],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  logo: string;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  currentStep: number = 1;

  constructor(private authService: AuthService, private theme: ThemeComponent) {
    this.logo = this.theme.logo;
  }

  signupWithGoogle() {
    this.authService.loginWithGoogle();
  }

  signupWithGithub() {
    // TODO: Implement GitHub login
    // this.authService.loginWithGithub();
  }

  handleStepChange(step: number) {
    this.currentStep = step;
  }
}
