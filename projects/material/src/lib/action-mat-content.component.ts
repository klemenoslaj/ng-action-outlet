import { HostBinding, Inject } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ActionButton } from '@ng-action-outlet/core';
import { ActionAnchor } from '@ng-action-outlet/core';
import { ACTION_ICON_TYPE_TOKEN, ICON_TYPE } from './action-icon-type-token';

@Component({
  selector: 'action-mat-content',
  template: `
    <mat-icon *ngIf="action?.icon$ | async; let icon" [svgIcon]="_isSvgIcon() ? icon : null">
      {{ icon }}
    </mat-icon>

    <span [innerHTML]="action?.title$ | async"></span>
  `,
  styles: [
    `
      .action-mat-content {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class ActionMatContentComponent {
  @HostBinding('class.action-mat-content') readonly _classname = true;
  @Input() action?: ActionButton | ActionAnchor;

  constructor(
    @Inject(ACTION_ICON_TYPE_TOKEN)
    readonly _iconType: ICON_TYPE,
  ) {}

  _isSvgIcon() {
    return this._iconType === ICON_TYPE.Svg;
  }
}
