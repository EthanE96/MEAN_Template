import { NgClass, NgIf } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

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
  error: string = '';

  @Output() stepChange = new EventEmitter<number>();
  @Output() errorChange = new EventEmitter<string>();

  constructor(private authService: AuthService) {}

  async onSubmit() {
    if (this.step === 1) {
      this.step = 2;
      this.stepChange.emit(this.step);
    } else {
      try {
        this.error = ''; // Clear any previous errors
        await this.authService.signUpWithLocal(
          this.email,
          this.password,
          this.firstName,
          this.lastName
        );
      } catch (error: any) {
        this.error = error.error.error;
        console.log(this.error);
        this.errorChange.emit(this.error);
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
