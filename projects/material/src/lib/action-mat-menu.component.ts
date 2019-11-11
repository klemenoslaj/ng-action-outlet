import { Component, Input, ViewChild, HostBinding, ChangeDetectionStrategy, ViewEncapsulation, Inject } from '@angular/core';
import { AnyAction, ActionGroup, ActionGroupComponentImpl } from '@ng-action-outlet/core';
import { MatMenu } from '@angular/material/menu';

import { trackByAction, TrackByAction } from './common';
import { actionMatButtonTemplate } from './action-mat-button.template';
import { ACTION_ICON_TYPE_TOKEN, ICON_TYPE } from './action-icon-type-token';

@Component({
  selector: 'action-mat-menu',
  exportAs: 'actionMatMenu',
  template: `
    <mat-menu>
      <ng-template matMenuContent>
        <ng-container *ngTemplateOutlet="nestedMenu; context: { $implicit: _action }"></ng-container>

        <ng-template #nestedMenu let-action>
          <mat-divider *ngIf="_showDivider(action)"></mat-divider>
          <ng-container *ngFor="let child of action.children$ | async; trackBy: _trackByAction">
            <ng-container *ngTemplateOutlet="_isGroup(child) ? nestedGroup : actionOutlet; context: { $implicit: child }"></ng-container>
          </ng-container>
        </ng-template>

        <ng-template #actionOutlet let-action>
          <button *ngIf="action.visible$ | async" mat-menu-item [actionMatButton]="action">
            <ng-container *ngTemplateOutlet="content; context: { $implicit: action }"></ng-container>
          </button>
        </ng-template>

        <ng-template #nestedGroup let-action>
          <ng-container *ngIf="(action.children$ | async)?.length > 0">
            <ng-container *ngTemplateOutlet="_isDropdown(action) ? nestedDropdown : nestedMenu; context: { $implicit: action }"></ng-container>
          </ng-container>
        </ng-template>

        <ng-template #nestedDropdown let-action>
          <action-mat-menu [action]="action" #nestedActionMenu="actionMatMenu"></action-mat-menu>

          <button *ngIf="(action.visible$ | async) && nestedActionMenu._menu; let menu" mat-menu-item [actionMatButton]="action" [matMenuTriggerFor]="menu">
            <ng-container *ngTemplateOutlet="content; context: { $implicit: action }"></ng-container>
          </button>
        </ng-template>

      </ng-template>
    </mat-menu>

    ${actionMatButtonTemplate}
  `,
  styles: [`
    .action-mat-menu {
      display: contents;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})

export class ActionMatMenuComponent implements ActionGroupComponentImpl {
  @ViewChild(MatMenu, { static: true })
  _menu?: MatMenu;

  @Input('action')
  _action?: ActionGroup | null;

  @HostBinding('class')
  readonly _classname = 'action-mat-menu';
  readonly _trackByAction: TrackByAction = trackByAction;

  constructor(
    @Inject(ACTION_ICON_TYPE_TOKEN)
    readonly _iconType: ICON_TYPE,
  ) {}

  _isGroup(action?: AnyAction): action is ActionGroup {
    return action instanceof ActionGroup;
  }

  _isDropdown(action?: AnyAction): action is ActionGroup {
    return action instanceof ActionGroup && action.isDropdown();
  }

  _showDivider(action: ActionGroup) {
    const parent = action.getParent();
    return !action.isDropdown() && parent && parent.isDropdown() && parent.getChild(0) !== action;
  }
}
