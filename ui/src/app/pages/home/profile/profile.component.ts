import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [NgIf, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  currentUser$ = new Observable<Partial<IUser> | null>();
  user: Partial<IUser> | null = null;

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    this.currentUser$ = this.userService.currentUser$;

    this.currentUser$.subscribe((user) => {
      this.user = user ? { ...user } : null;
    });
  }

  updateProfile() {
    if (this.user && this.user._id) {
      this.userService.update(this.user._id, this.user).subscribe({
        // TODO: Handle success and error responses with alerts popups
        next: () => console.log('Updated'),
        error: (error) => console.error('Error updating profile:', error),
      });
    } else {
      console.error('User ID is missing. Cannot update profile.');
    }
  }

  onLogout() {
    this.authService.logout().then(() => {
      console.log('Logged out successfully');
      this.user = null; // Clear user data on logout
    });
  }
}
