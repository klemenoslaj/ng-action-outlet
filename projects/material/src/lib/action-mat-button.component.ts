import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, HostBinding, Inject } from '@angular/core';
import { ActionButton, ActionButtonComponentImpl } from '@ng-action-outlet/core';

import { ICON_TYPE, ACTION_ICON_TYPE_TOKEN } from './action-icon-type-token';

@Component({
  selector: 'action-mat-button',
  template: `
    <ng-container *ngIf="_action && _action.visible$ | async">
      <button mat-button [actionMatButton]="_action">
        <action-mat-content [action]="_action"></action-mat-content>
      </button>
    </ng-container>
  `,
  styleUrls: ['./action-mat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionMatButtonComponent implements ActionButtonComponentImpl {
  @HostBinding('class.action-contents') _contentsClass = true;

  @Input('action')
  readonly _action?: ActionButton | null;

  constructor(
    @Inject(ACTION_ICON_TYPE_TOKEN)
    readonly _iconType: ICON_TYPE,
  ) {}
}
