import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  LucideAngularModule,
  EllipsisVertical,
  PanelLeftClose,
} from 'lucide-angular';

@Component({
  selector: 'app-drawer',
  imports: [LucideAngularModule],
  templateUrl: './drawer.component.html',
})
export class DrawerComponent {
  readonly EllipsisVertical = EllipsisVertical;
  readonly PanelLeftClose = PanelLeftClose;

  @Input() isDrawerOpen: boolean = false;
  @Output() isDrawerOpenChange = new EventEmitter();

  constructor() {}

  onDrawerChange() {
    this.isDrawerOpen = !this.isDrawerOpen;
    this.isDrawerOpenChange.emit(this.isDrawerOpen);
  }
}
