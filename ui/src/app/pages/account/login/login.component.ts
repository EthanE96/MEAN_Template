import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { LandingHeaderComponent } from '../../landing/landing-header/landing-header.component';
import { LandingFooterComponent } from '../../landing/landing-footer/landing-footer.component';

@Component({
  selector: 'app-login',
  imports: [LandingHeaderComponent, LandingFooterComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  logo: string;

  constructor(private theme: ThemeComponent, private authService: AuthService) {
    this.logo = this.theme.logo;
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  // loginWithLocal() {
  //   this.authService.loginWithLocal();
  // }
}
