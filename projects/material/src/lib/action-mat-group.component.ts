import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { ActionGroup, ActionGroupComponentImpl } from '@ng-action-outlet/core';

import { isMenuItem } from './common';

@Component({
  selector: 'action-mat-group',
  template: `
    <ng-container *ngIf="(action.visible$ | async) && (action.children$ | async)!.length">
      <ng-container *ngIf="action.dropdown$ | async; then dropdown else group"></ng-container>
    </ng-container>

    <ng-template #group>
      <mat-divider *ngIf="showDivider()"></mat-divider>
      <ng-container *ngFor="let child of action.children$ | async" [actionOutlet]="child"></ng-container>
    </ng-template>

    <ng-template #dropdown>
      <mat-menu #menu="matMenu">
        <ng-template matMenuContent>
          <ng-container *ngFor="let child of action.children$ | async" [actionOutlet]="child"></ng-container>
        </ng-template>
      </mat-menu>

      <ng-container *ngIf="isMenuItem(); then menuItem else menuButton"></ng-container>

      <ng-template #menuItem>
        <button
          type="button"
          mat-menu-item
          [matMenuTriggerFor]="menu"
          [disabled]="action.disabled$ | async">
          <action-mat-icon *ngIf="action.icon$ | async; let icon" [icon]="icon"></action-mat-icon>
          <span>{{ action.title$ | async }}</span>
        </button>
      </ng-template>

      <ng-template #menuButton>
        <action-mat-button *ngIf="action.disabled$ | async" [action]="action"></action-mat-button>
        <action-mat-button *ngIf="!(action.disabled$ | async)" [matMenuTriggerFor]="menu" [action]="action"></action-mat-button>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ActionMatGroupComponent implements ActionGroupComponentImpl {
  readonly action!: ActionGroup;

  isMenuItem() {
    return isMenuItem(this.action.getParent());
  }

  showDivider() {
    const parent = this.action.getParent();
    return parent && parent.isDropdown() && parent.getChild(0) !== this.action;
  }
}
