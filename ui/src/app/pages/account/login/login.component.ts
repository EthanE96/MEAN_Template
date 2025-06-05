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
  error: string = '';

  constructor(
    private theme: ThemeComponent,
    private authService: AuthService,
    private validatorService: ValidatorService,
    private router: Router
  ) {
    this.logo = this.theme.logo;
  }

  async ngOnInit() {
    if (await this.authService.isAuthenticated()) {
      this.router.navigate(['/app']);
    }
  }

  loginWithGoogle() {
    this.authService.authWithGoogle();
  }

  loginWithGithub() {
    this.authService.authWithGitHub();
  }

  async loginWithLocal() {
    try {
      this.error = '';

      // Validate all fields
      if (!this.validatorService.validateFields(this.email, this.password)) {
        throw new Error('Missing fields.');
      }

      // Validate email
      if (!this.validatorService.validateEmail(this.email)) {
        throw new Error('Invalid email format.');
      }

      await this.authService.loginWithLocal(
        this.email,
        this.password,
        this.rememberMe
      );
    } catch (error) {
      this.handleErrorChange(error as string);
    }
  }

  handleErrorChange(error: string) {
    this.error = error;

    setTimeout(() => {
      this.error = '';
    }, 5000);
  }
}
