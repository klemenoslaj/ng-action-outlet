import { Component, Inject, Input, ChangeDetectionStrategy, ViewEncapsulation, HostBinding } from '@angular/core';
import { ACTION_ICON_TYPE_TOKEN, ICON_TYPE } from './action-icon-type-token';

@Component({
    selector: 'action-mat-icon',
    template: `
        <mat-icon [svgIcon]="(iconType === ${ICON_TYPE.Svg} ? icon : null)">
            {{ icon }}
        </mat-icon>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})

export class ActionMatIconComponent {
    @Input() icon!: string;
    @HostBinding('class') classname = 'mat-icon';

    constructor(@Inject(ACTION_ICON_TYPE_TOKEN) public iconType: ICON_TYPE) {}
}
