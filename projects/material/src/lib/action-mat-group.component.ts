import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, HostBinding, Inject } from '@angular/core';
import { ActionGroup, ActionGroupComponentImpl } from '@ng-action-outlet/core';

import { trackByAction, TrackByAction } from './common';
import { actionMatButtonTemplate } from './action-mat-button.template';
import { ACTION_ICON_TYPE_TOKEN, ICON_TYPE } from './action-icon-type-token';

@Component({
  selector: 'action-mat-group',
  exportAs: 'actionMatGroup',
  template: `
    <ng-container *ngIf="_action && (_action.visible$ | async) && (_action.children$ | async)!.length">
      <ng-container *ngIf="_action.dropdown$ | async; then dropdown; else group"></ng-container>
    </ng-container>

    <ng-template #group>
      <ng-container
        *ngFor="let child of _action!.children$ | async; trackBy: _trackByAction"
        [actionOutlet]="child"
      ></ng-container>
    </ng-template>

    <ng-template #dropdown>
      <action-mat-menu [action]="_action" #actionMenu="actionMatMenu"></action-mat-menu>
      <button mat-button [actionMatButton]="_action" [matMenuTriggerFor]="actionMenu._menu">
        <ng-container *ngTemplateOutlet="content; context: { $implicit: _action }"></ng-container>
      </button>
    </ng-template>

    ${actionMatButtonTemplate}
  `,
  styles: [
    `
      .action-mat-group {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionMatGroupComponent implements ActionGroupComponentImpl {
  @HostBinding('class')
  readonly _classname = 'action-mat-group';
  readonly _trackByAction: TrackByAction = trackByAction;

  constructor(
    @Inject(ACTION_ICON_TYPE_TOKEN)
    readonly _iconType: ICON_TYPE,
  ) {}

  @Input('action')
  _action?: ActionGroup | null;
}
