import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { LandingHeaderComponent } from '../../landing/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/landing-footer/landing-footer.component';
import { RouterLink, Router } from '@angular/router';
import { MessageComponent } from '../../../shared/message/message.component';
import { NgIf } from '@angular/common';
import ValidatorUtils from '../../../utils/validator.utils';
import ErrorType from '../../../utils/error-type.utils';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    RouterLink,
    LandingHeaderComponent,
    LandingFooterComponent,
    MessageComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  logo: string;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  error?: string;

  constructor(
    private theme: ThemeComponent,
    private router: Router,
    private authService: AuthService
  ) {
    this.logo = this.theme.logo;
  }

  async ngOnInit() {
    this.router.navigate(['/app']);
  }

  async loginWithGoogle() {
    this.authService.authWithGoogle();
  }

  async loginWithGithub() {
    this.authService.authWithGitHub();
  }

  async loginWithLocal() {
    try {
      // Validate all fields
      if (!ValidatorUtils.isValidFields(this.email, this.password)) {
        throw new Error('Missing fields.');
      }

      // Validate email
      if (!ValidatorUtils.isValidEmail(this.email)) {
        throw new Error('Enter valid email address.');
      }

      // Login
      await this.authService.loginWithLocal(
        this.email,
        this.password,
        this.rememberMe
      );

      // Redirect to the app
      this.router.navigate(['/app']);
    } catch (error) {
      this.handleErrorChange(error);
    }
  }

  handleErrorChange(error?: unknown) {
    this.error = ErrorType.returnErrorMessage(error);

    setTimeout(() => {
      this.error = undefined;
    }, 5500);
  }
}
