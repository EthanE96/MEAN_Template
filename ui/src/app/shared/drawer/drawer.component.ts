import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import {
  LucideAngularModule,
  EllipsisVertical,
  PanelLeftClose,
} from 'lucide-angular';
import { IUser } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-drawer',
  imports: [NgIf, AsyncPipe, LucideAngularModule],
  templateUrl: './drawer.component.html',
})
export class DrawerComponent {
  readonly EllipsisVertical = EllipsisVertical;
  readonly PanelLeftClose = PanelLeftClose;

  @Input() isDrawerOpen: boolean = false;
  @Output() isDrawerOpenChange = new EventEmitter();

  currentUser$ = new Observable<Partial<IUser> | null>();

  constructor(private router: Router, private userService: UserService) {
    this.currentUser$ = this.userService.currentUser$;
  }

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }

  onProfile() {
    this.router.navigate(['/app/profile']);
  }
}
