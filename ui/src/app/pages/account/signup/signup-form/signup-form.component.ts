import { NgClass, NgIf } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import ValidatorUtils from '../../../../utils/validator.utils';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgClass],
  templateUrl: './signup-form.component.html',
})
export class SignupFormComponent {
  step: number = 1;
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';
  error?: string;

  @Output() stepChange = new EventEmitter<number>();
  @Output() errorChange = new EventEmitter<string>();

  constructor(private authService: AuthService, private router: Router) {}

  async onSubmit() {
    if (this.step === 1) {
      this.step = 2;
      this.stepChange.emit(this.step);
    } else {
      try {
        // Validate all fields
        if (
          !ValidatorUtils.isValidFields(
            this.email,
            this.password,
            this.firstName,
            this.lastName
          )
        ) {
          throw new Error('Missing fields.');
        }

        // Validate email and password
        if (
          !ValidatorUtils.isValidEmail(this.email) ||
          !ValidatorUtils.isValidPassword(this.password)
        ) {
          throw new Error('Invalid email or password format.');
        }

        await this.authService.signUpWithLocal(
          this.email,
          this.password,
          this.firstName,
          this.lastName
        );

        // Redirect to the app
        this.router.navigate(['/app']);
      } catch (error: any) {
        this.error = error.error.message || 'An error occurred during signup.';
        this.errorChange.emit(this.error);
        this.error = undefined; // Clear error after emitting
      }
    }
  }

  onBack() {
    this.step = 1;
    this.firstName = '';
    this.lastName = '';
    this.stepChange.emit(this.step);
  }
}
