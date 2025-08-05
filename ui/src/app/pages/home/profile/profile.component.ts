import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IUser } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MessageComponent } from '../../../shared/message/message.component';
import ErrorType from '../../../utils/error-type.utils';
import { isValidEmail, isValidFields } from '../../../utils/validator.utils';

@Component({
  selector: 'app-profile',
  imports: [NgIf, FormsModule, MessageComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user: Partial<IUser> | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  ngOnInit() {
    this.user = this.authService.currentUserSubject.value;
  }

  async updateProfile() {
    try {
      if (!this.user) {
        throw new Error('No user data available to update.');
      }

      // Validate all fields
      if (
        !isValidFields(this.user.firstName, this.user.lastName, this.user.email)
      ) {
        throw new Error('Missing fields.');
      }

      // Validate email
      if (!isValidEmail(this.user.email)) {
        throw new Error('Enter valid email address.');
      }

      await this.authService.updateUser(this.user);

      this.handleSuccessChange('Profile updated successfully.');
    } catch (error) {
      this.handleErrorChange(error);
    }
  }

  async onDeleteProfile() {
    try {
      if (!this.user || !this.user._id) {
        throw new Error('No user data available to delete.');
      }

      await this.authService.deleteUser();
      this.onLogout();
    } catch (error) {
      this.handleErrorChange(error);
    }
  }

  onLogout() {
    this.router.navigate(['/']);
    this.authService.logout();
  }

  handleErrorChange(error: unknown) {
    this.errorMessage = ErrorType(error);

    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  handleSuccessChange(mssg: string) {
    this.successMessage = mssg;

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}
