import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  imports: [NgIf],
  templateUrl: './message.component.html',
})
export class MessageComponent {
  @Input() message: string = '';
  @Input() type: 'info' | 'success' | 'warning' | 'error' = 'error';
}
