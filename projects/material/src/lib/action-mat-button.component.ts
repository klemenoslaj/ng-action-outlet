import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, HostBinding, Inject } from '@angular/core';
import { ActionButton, ActionButtonComponentImpl } from '@ng-action-outlet/core';
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';

import { isMenuItem } from './common';
import { actionMatButtonTemplate } from './action-mat-button.template';
import { ICON_TYPE, ACTION_ICON_TYPE_TOKEN } from './action-icon-type-token';

export const ButtonType = <const>{
  Button: 0,
  MenuItem: 1
};

@Component({
  selector: 'action-mat-button',
  template: `
    <ng-container *ngIf="_action && _action.visible$ | async" [ngSwitch]="_getButtonType(_action!)">
      <button *ngSwitchCase="ButtonType.Button" mat-button [actionMatButton]="_action">
        <ng-container *ngTemplateOutlet="content; context: { $implicit: _action }"></ng-container>
      </button>

      <button *ngSwitchCase="ButtonType.MenuItem" mat-menu-item [actionMatButton]="_action">
        <ng-container *ngTemplateOutlet="content; context: { $implicit: _action }"></ng-container>
      </button>
    </ng-container>

    ${actionMatButtonTemplate}
  `,
  styleUrls: ['./action-mat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionMatButtonComponent implements ActionButtonComponentImpl, FocusableOption {
  @Input('action')
  readonly _action?: ActionButton | null;

  @HostBinding('class')
  readonly _classname = 'action-mat-button';

  ButtonType = ButtonType;

  constructor(
    @Inject(ACTION_ICON_TYPE_TOKEN)
    readonly _iconType: ICON_TYPE,
    private readonly _elementRef: ElementRef,
    private readonly _focusMonitor?: FocusMonitor,
  ) {}

  focus(origin: FocusOrigin = 'program', options?: FocusOptions): void {
    if (this._focusMonitor) {
      this._focusMonitor.focusVia(this._elementRef.nativeElement, origin, options);
    } else {
      this._elementRef.nativeElement.focus(options);
    }
  }

  _getButtonType(action: ActionButton) {
    const isButtonMenuItem = isMenuItem(action.getParent());
    return isButtonMenuItem ? ButtonType.MenuItem : ButtonType.Button;
  }
}
