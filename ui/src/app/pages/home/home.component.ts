import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { ThemeComponent } from '../../shared/theme/theme.component';
import { DrawerComponent } from '../../shared/drawer/drawer.component';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { IUser } from '../../models/user.model';
import { Observable } from 'rxjs';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    NgIf,
    HeaderComponent,
    FooterComponent,
    DrawerComponent,
    RouterOutlet,
  ],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  currentTheme: string;
  isDrawerOpen: boolean = true;
  currentUser$ = new Observable<Partial<IUser> | null>();

  constructor(private theme: ThemeComponent, private authService: AuthService) {
    this.currentTheme = this.theme.currentTheme;
  }

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
  }
}
