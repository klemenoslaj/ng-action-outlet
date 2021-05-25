import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, Inject, HostBinding } from '@angular/core';
import { ActionAnchor, ActionAnchorComponentImpl } from '@ng-action-outlet/core';

import { ICON_TYPE, ACTION_ICON_TYPE_TOKEN } from './action-icon-type-token';

@Component({
  selector: 'action-mat-anchor',
  template: `
    <ng-container *ngIf="_action?.visible$ | async">
      <a
        *ngIf="_action.href$ | async; let href"
        mat-button
        [actionMatButton]="_action"
        [href]="href"
        [attr.target]="_action.target$ | async"
      >
        <action-mat-content [action]="_action"></action-mat-content>
      </a>

      <a
        *ngIf="_action.routerLink$ | async; let routerLink"
        mat-button
        [actionMatButton]="_action"
        [routerLink]="routerLink"
        [target]="_action.target$ | async"
      >
        <action-mat-content [action]="_action"></action-mat-content>
      </a>
    </ng-container>
  `,
  styleUrls: ['./action-mat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionMatAnchorComponent implements ActionAnchorComponentImpl {
  @HostBinding('class.action-contents') _contentsClass = true;

  @Input('action')
  readonly _action?: ActionAnchor | null;

  constructor(
    @Inject(ACTION_ICON_TYPE_TOKEN)
    readonly _iconType: ICON_TYPE,
  ) {}
}
