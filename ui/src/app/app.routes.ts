import { Routes } from '@angular/router';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  // { path: 'app', component: LayoutComponent, canActivate: [authGuard] },
  // { path: 'login', component: LoginComponent },
  // { path: 'signup', component: SignupComponent },
  // { path: 'logout', component: LogoutComponent },

  // wildcard route for a 404
  // { path: '**', component: NotFoundComponent },
];
