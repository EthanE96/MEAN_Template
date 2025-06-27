import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MessageComponent } from '../../../shared/message/message.component';

@Component({
  selector: 'app-profile',
  imports: [NgIf, FormsModule, MessageComponent],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  currentUser$ = new Observable<Partial<IUser> | null>();
  user: Partial<IUser> | null = null;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser$ = this.userService.currentUser$;

    this.currentUser$.subscribe((user) => {
      this.user = user ? { ...user } : null;
    });
  }

  updateProfile() {
    if (this.user && this.user._id) {
      this.userService.update(this.user._id, this.user).subscribe({
        next: () => this.handleSuccessChange('Profile updated successfully!'),
        error: (error) =>
          this.handleErrorChange(error.error || 'Failed to update profile.'),
      });
    } else {
      console.error('User ID is missing. Cannot update profile.');
    }
  }

  onLogout() {
    this.router.navigate(['/']);
    this.authService.logout();
  }

  handleErrorChange(mssg: string) {
    this.errorMessage = mssg;

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
