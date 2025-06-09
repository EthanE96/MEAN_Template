import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs';
import {
  LucideAngularModule,
  EllipsisVertical,
  PanelLeftClose,
} from 'lucide-angular';
import { IUser } from '../../models/user.model';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-drawer',
  imports: [NgIf, AsyncPipe, LucideAngularModule],
  templateUrl: './drawer.component.html',
})
export class DrawerComponent {
  readonly EllipsisVertical = EllipsisVertical;
  readonly PanelLeftClose = PanelLeftClose;

  @Input() isDrawerOpen: boolean = false;
  @Input() currentUser$ = new Observable<Partial<IUser> | null>();
  @Output() isDrawerOpenChange = new EventEmitter();

  constructor(private router: Router) {}

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }

  onProfile() {
    this.router.navigate(['/app/profile']);
  }
}
