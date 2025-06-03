import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { LandingHeaderComponent } from '../../landing/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/landing-footer/landing-footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, LandingHeaderComponent, LandingFooterComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  logo: string;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(private theme: ThemeComponent, private authService: AuthService) {
    this.logo = this.theme.logo;
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithGithub() {
    // TODO: Implement GitHub login
    // this.authService.loginWithGithub();
  }

  loginWithLocal() {
    this.authService.loginWithLocal(this.email, this.password);
  }
}
