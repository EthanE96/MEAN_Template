import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-login',
  imports: [HeaderComponent, FooterComponent],
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
