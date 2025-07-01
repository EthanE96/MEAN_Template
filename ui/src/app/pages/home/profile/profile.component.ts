import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MessageComponent } from '../../../shared/message/message.component';
import ErrorType from '../../../utils/error-type.utils';
import ValidatorUtils from '../../../utils/validator.utils';

@Component({
  selector: 'app-profile',
  imports: [NgIf, FormsModule, MessageComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {
  currentUser$ = new Observable<Partial<IUser> | null>();
  user: Partial<IUser> | null = null;
  originalUser: Partial<IUser> | null = null;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  private userSub?: Subscription;

  // TODO: The update profile logic is not complete. Data only updates on refresh.

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;

    this.userSub = this.currentUser$.subscribe((user) => {
      // Deep copy to avoid reference issues
      this.originalUser = user ? JSON.parse(JSON.stringify(user)) : null;
      this.user = user ? JSON.parse(JSON.stringify(user)) : null;
    });
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  async updateProfile() {
    try {
      if (!this.user || !this.originalUser) {
        throw new Error('No user data available to update.');
      }

      // Validate all fields
      if (
        !ValidatorUtils.isValidFields(
          this.user.firstName,
          this.user.lastName,
          this.user.email
        )
      ) {
        throw new Error('Missing fields.');
      }

      // Validate email
      if (!ValidatorUtils.isValidEmail(this.user.email)) {
        throw new Error('Enter valid email address.');
      }

      // If no changes, return early
      if (
        this.user.firstName == this.originalUser.firstName &&
        this.user.lastName == this.originalUser.lastName &&
        this.user.email == this.originalUser.email
      ) {
        throw new Error('No changes to update.');
      }

      await this.authService.updateUser(this.user);

      this.handleSuccessChange('Profile updated successfully.');
    } catch (error) {
      this.handleErrorChange(error);
    }
  }

  onLogout() {
    this.router.navigate(['/']);
    this.authService.logout();
  }

  handleErrorChange(error: unknown) {
    this.errorMessage = ErrorType.returnErrorMessage(error);

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
