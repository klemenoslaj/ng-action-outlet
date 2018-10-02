import { Component, OnInit, HostBinding } from '@angular/core';
import { ActionButton, ActionAbstractComponentImpl } from '@ng-action-outlet/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit, ActionAbstractComponentImpl<ActionButton> {
  readonly action: ActionButton;

  @HostBinding()
  hidden: boolean;

  ngOnInit() {
    this.action.visible$.subscribe(visibility => this.hidden = !visibility);
  }
}
