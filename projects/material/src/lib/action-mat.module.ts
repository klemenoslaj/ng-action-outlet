import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionOutletModule, ActionButton, ActionGroup, ActionAnchor } from '@ng-action-outlet/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ActionMatButtonComponent } from './action-mat-button.component';
import { ActionMatAnchorComponent } from './action-mat-anchor.component';
import { ActionMatGroupComponent } from './action-mat-group.component';
import { ActionMatMenuComponent } from './action-mat-menu.component';
import { ICON_TYPE, ACTION_ICON_TYPE_TOKEN } from './action-icon-type-token';
import { ActionMatButtonDirective } from './action-mat-button.directive';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    ActionOutletModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    RouterModule,
  ],
  declarations: [
    ActionMatButtonComponent,
    ActionMatGroupComponent,
    ActionMatMenuComponent,
    ActionMatButtonDirective,
    ActionMatAnchorComponent,
  ],
  exports: [ActionMatButtonComponent, ActionMatAnchorComponent, ActionMatGroupComponent],
  providers: [
    {
      provide: ActionButton,
      useValue: ActionMatButtonComponent,
    },
    {
      provide: ActionAnchor,
      useValue: ActionMatAnchorComponent,
    },
    {
      provide: ActionGroup,
      useValue: ActionMatGroupComponent,
    },
  ],
})
export class ActionMatModule {
  static forRoot(iconType: ICON_TYPE): ModuleWithProviders<ActionMatModule> {
    return {
      ngModule: ActionMatModule,
      providers: [
        {
          provide: ACTION_ICON_TYPE_TOKEN,
          useValue: iconType,
        },
      ],
    };
  }
}
