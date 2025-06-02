import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ThemeComponent } from '../../../shared/theme/theme.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-signup',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  logo: string;

  constructor(private authService: AuthService, private theme: ThemeComponent) {
    this.logo = this.theme.logo;
  }

  signupWithGoogle() {
    this.authService.loginWithGoogle();
  }

  // signupWithLocal() {
  //   this.authService.loginWithLocal();
  // }
}
