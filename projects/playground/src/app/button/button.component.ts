import { Component, OnInit, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';
import {
  ActionButton,
  ActionAbstractComponentImpl,
  ActionGroup
} from '@ng-action-outlet/core';

@Component({
  selector: 'app-button',
  template: `
    <ng-container *ngIf="action && isMenuItem(); then menuItem else button"></ng-container>

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent implements OnInit, ActionAbstractComponentImpl<ActionButton> {
  @Input()
  readonly action: ActionButton;

  @HostBinding()
  hidden: boolean;

  ngOnInit() {
    this.action.visible$.subscribe(visibility => (this.hidden = !visibility));
  }

  isButton() {
    return !this.action.getParent() || !this.action.getParent().isDropdown();
  }

  isMenuItem() {
    return isMenuItem(this.action);

    function isMenuItem(action: ActionButton | ActionGroup) {
      return action.getParent() && action.getParent().isDropdown() || action.getParent() && isMenuItem(action.getParent());
    }
  }
}
