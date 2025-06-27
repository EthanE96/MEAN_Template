import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { LandingHeaderComponent } from '../../landing/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/landing-footer/landing-footer.component';
import { RouterLink, Router } from '@angular/router';
import { MessageComponent } from '../../../shared/message/message.component';
import { NgIf } from '@angular/common';
import { ValidatorService } from '../../../services/validator.service';

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
    private authService: AuthService,
    private validatorService: ValidatorService,
    private router: Router
  ) {
    this.logo = this.theme.logo;
  }

  async ngOnInit() {
    // Check if user is already authenticated
    if (await this.authService.isAuthenticated())
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
      if (!this.validatorService.validateFields(this.email, this.password)) {
        throw new Error('Missing fields.');
      }

      // Validate email
      if (!this.validatorService.validateEmail(this.email)) {
        throw new Error('Invalid email format.');
      }

      // Login
      await this.authService.loginWithLocal(
        this.email,
        this.password,
        this.rememberMe
      );

      // Redirect to the app
      this.router.navigate(['/app']);
    } catch (error: any) {
      this.handleErrorChange(
        error.error.message || 'An error occurred during login.'
      );
    }
  }

  handleErrorChange(error?: string) {
    this.error = error;

    setTimeout(() => {
      this.error = undefined;
    }, 7000);
  }
}
