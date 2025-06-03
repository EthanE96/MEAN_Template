import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';
import { authGuard } from './guard/auth.guard';
import { LoginComponent } from './pages/account/login/login.component';
import { LogoutComponent } from './pages/account/logout/logout.component';
import { SignupComponent } from './pages/account/signup/signup.component';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './pages/errors/not-found/not-found.component';
import { ForgotPasswordComponent } from './pages/account/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'app', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },

  // wildcard route for a 404
  { path: '**', component: NotFoundComponent },
];
