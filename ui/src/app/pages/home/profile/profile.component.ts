import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { IUser } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  imports: [NgIf, AsyncPipe, FormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  currentUser$ = new Observable<Partial<IUser> | null>();
  user: Partial<IUser> | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
    this.currentUser$.subscribe((user) => (this.user = user));
  }

  updateProfile() {
    if (this.user) {
      this.userService.updateUser(this.user).subscribe({
        next: () => {
          this.authService.checkAuth().then((user) => {
            this.user = user;
          });
        },
        error: (error) => {
          alert('Error updating profile:' + error);
        },
      });
    }
  }
}
