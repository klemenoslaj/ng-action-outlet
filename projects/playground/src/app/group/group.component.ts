import { Component, OnInit, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ActionGroup } from '@ng-action-outlet/core';

@Component({
  selector: 'app-group',
  template: `
    <ng-container *ngIf="(action.dropdown$ | async); then dropdown else group"></ng-container>

    <ng-template #group>
      <mat-divider *ngIf="showDivider()"></mat-divider>
      <ng-container *ngFor="let child of action.children$ | async" [actionOutlet]="child"></ng-container>
    </ng-template>

    <ng-template #dropdown>
      <mat-menu #menu="matMenu">
        <ng-container *ngFor="let child of action.children$ | async" [actionOutlet]="child"></ng-container>
      </mat-menu>

      <ng-container *ngIf="isMenuItem(); then menuItem else menuButton"></ng-container>

      <ng-template #menuItem>
        <button
          type="button"
          mat-menu-item
          [matMenuTriggerFor]="menu"
          [disabled]="action.disabled$ | async">
          <mat-icon *ngIf="action.icon$ | async; let icon">{{ icon }}</mat-icon>
          {{ action.title$ | async }}
        </button>
      </ng-template>

      <ng-template #menuButton>
        <app-button *ngIf="action.disabled$ | async" [action]="action"></app-button>
        <app-button *ngIf="!(action.disabled$ | async)" [matMenuTriggerFor]="menu" [action]="action"></app-button>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupComponent implements OnInit {
  readonly action: ActionGroup;

  @HostBinding()
  hidden: boolean;

  @HostBinding() style = 'display: inline-block';

  ngOnInit() {
    this.action.visible$.subscribe(visibility => (this.hidden = !visibility));
  }

  isMenuItem() {
    const isMenuItem = (action: ActionGroup) => {
      return action && (action.isDropdown() || isMenuItem(action.getParent()));
    };

    return isMenuItem(this.action.getParent());
  }

  showDivider() {
    const parent = this.action.getParent();
    return parent && parent.isDropdown() && parent.getChild(0) !== this.action;
  }
}
