import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ActionButton, ActionButtonComponentImpl, ActionGroup } from '@ng-action-outlet/core';

import { isMenuItem } from './common';

@Component({
  selector: 'action-mat-button',
  template: `
    <ng-container *ngIf="action.visible$ | async">
      <ng-container *ngIf="action && isMenuItem(); then menuItem else button"></ng-container>
    </ng-container>

    <ng-template #button>
      <ng-container *ngIf="action.title$ | async; then titleButton else iconButton"></ng-container>
    </ng-template>

    <ng-template #titleButton>
      <button
        type="button"
        mat-button
        (click)="action.trigger()"
        [disabled]="action.disabled$ | async">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </button>
    </ng-template>

    <ng-template #iconButton>
      <button
        type="button"
        mat-icon-button
        (click)="action.trigger()"
        [disabled]="action.disabled$ | async">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </button>
    </ng-template>

    <ng-template #menuItem>
      <button
        type="button"
        mat-menu-item
        (click)="action.trigger()"
        [disabled]="action.disabled$ | async">
        <ng-container [ngTemplateOutlet]="content"></ng-container>
      </button>
    </ng-template>

    <ng-template #content>
      <mat-icon *ngIf="action.icon$ | async; let icon">{{ icon }}</mat-icon>
      {{ action.title$ | async }}
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ActionMatButtonComponent implements ActionButtonComponentImpl {
  @Input()
  readonly action: ActionButton;

  isMenuItem() {
    return isMenuItem(this.action);
  }
}
