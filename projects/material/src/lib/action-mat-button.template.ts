import { ICON_TYPE } from './action-icon-type-token';

export const actionMatButtonTemplate = `
<ng-template #content let-action>
<mat-icon *ngIf="action.icon$ | async; let icon" [svgIcon]="(_iconType === ${ICON_TYPE.Svg} ? icon : null)">
  {{ icon }}
</mat-icon>

<span [innerHTML]="action.title$ | async"></span>
</ng-template>
`;
