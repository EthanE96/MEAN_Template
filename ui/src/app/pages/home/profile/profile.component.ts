import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IUser } from '../../../models/user.model';
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

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
    this.currentUser$.subscribe((user) => {
      this.user = user ? { ...user } : null;
    });
  }

  updateProfile() {
    if (!this.user) {
      this.handleErrorChange('No user data available to update.');
      return;
    }

    this.authService.updateUser(this.user).subscribe({
      next: (res) => {
        console.log(res);
        if (res && res._id) {
          this.authService.currentUserSubject.next(res);
          this.handleSuccessChange('Profile updated successfully.');
        }
      },
      error: (error) => {
        this.handleErrorChange(error.error);
        this.user = this.authService.currentUserSubject.value || null;
      },
    });
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
