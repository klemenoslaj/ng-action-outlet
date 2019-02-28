import { Component, OnInit, HostBinding } from '@angular/core';
import { ActionButton, ActionGroup } from '@ng-action-outlet/core';
import { of } from 'rxjs';

@Component({
  template: `
    <ng-container *ngIf="(action.dropdown$ | async); then dropdown else group"></ng-container>

    <ng-template #group>
      <ng-container *ngFor="let child of action.children$ | async" [actionOutlet]="child"></ng-container>
    </ng-template>

    <ng-template #dropdown>
      <mat-menu #menu="matMenu">
        <ng-container *ngFor="let child of action.children$ | async" [actionOutlet]="child"></ng-container>
      </mat-menu>

      <ng-container *ngIf="isParentDropdown(); then menuItem else menuButton"></ng-container>

      <ng-template #menuItem>
        <button
          type="button"
          mat-menu-item
          *ngIf="isParentDropdown()"
          [matMenuTriggerFor]="menu">
          {{ action.title$ | async }}
        </button>
      </ng-template>

      <ng-template #menuButton>
        <span [matMenuTriggerFor]="menu">
          <ng-container [actionOutlet]="button"></ng-container>
        </span>
      </ng-template>
    </ng-template>
  `,
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  readonly action: ActionGroup;

  button = new ActionButton({ icon: 'more_vert' });

  @HostBinding()
  hidden: boolean;

  ngOnInit() {
    this.action.visible$.subscribe(visibility => (this.hidden = !visibility));
  }

  isParentDropdown() {
    return this.action.getParent() && this.action.getParent().isDropdown();
  }
}
