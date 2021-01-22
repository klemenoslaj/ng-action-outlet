import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, HostBinding, Inject } from '@angular/core';
import { ActionAnchor, ActionAnchorComponentImpl } from '@ng-action-outlet/core';
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';

import { isMenuItem } from './common';
import { actionMatButtonTemplate } from './action-mat-button.template';
import { ICON_TYPE, ACTION_ICON_TYPE_TOKEN } from './action-icon-type-token';

export const AnchorType = <const>{
  Link: 0,
  MenuLink: 1
};

@Component({
  selector: 'action-mat-anchor',
  template: `
    <ng-container *ngIf="(_action?.visible$ | async) && _action; let action" [ngSwitch]="_getAnchorType(action!)">
      <ng-container *ngIf="(action.href$ | async); let href" [ngTemplateOutlet]="action.isExternalLink() ? external : internal" [ngTemplateOutletContext]="{ $implicit: href }"></ng-container>

      <ng-template #external let-href>
        <a *ngSwitchCase="AnchorType.Link" mat-button [actionMatButton]="action" [href]="href" [attr.target]="action.target$ | async">
          <ng-container *ngTemplateOutlet="content; context: { $implicit: action }"></ng-container>
        </a>

        <a *ngSwitchCase="AnchorType.MenuLink" mat-menu-item [actionMatButton]="action" [href]="href" [attr.target]="action.target$ | async">
          <ng-container *ngTemplateOutlet="content; context: { $implicit: action }"></ng-container>
        </a>
      </ng-template>

      <ng-template #internal let-href>
        <a *ngSwitchCase="AnchorType.Link" mat-button [actionMatButton]="action" [routerLink]="href" [target]="action.target$ | async">
          <ng-container *ngTemplateOutlet="content; context: { $implicit: action }"></ng-container>
        </a>

        <a *ngSwitchCase="AnchorType.MenuLink" mat-menu-item [actionMatButton]="action" [routerLink]="href" [target]="action.target$ | async">
          <ng-container *ngTemplateOutlet="content; context: { $implicit: action }"></ng-container>
        </a>
      </ng-template>
    </ng-container>

    ${actionMatButtonTemplate}
  `,
  styleUrls: ['./action-mat-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionMatAnchorComponent implements ActionAnchorComponentImpl, FocusableOption {
  @Input('action')
  readonly _action?: ActionAnchor | null;

  @HostBinding('class')
  readonly _classname = 'action-mat-button';

  AnchorType = AnchorType;

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

  _getAnchorType(action: ActionAnchor) {
    return isMenuItem(action.getParent()) ? AnchorType.MenuLink : AnchorType.Link;
  }
}
