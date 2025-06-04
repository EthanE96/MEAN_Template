import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
export class SignupComponent {
  logo: string;
  currentStep: number = 1;
  error: string = '';

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

  handleErrorChange(error: string) {
    this.error = error;

    setTimeout(() => {
      this.error = '';
    }, 3000);
  }
}
