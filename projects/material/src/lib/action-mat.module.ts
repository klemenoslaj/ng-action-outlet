import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionOutletModule, ActionButton, ActionGroup } from '@ng-action-outlet/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { ActionMatButtonComponent } from './action-mat-button.component';
import { ActionMatGroupComponent } from './action-mat-group.component';
import { ActionMatMenuComponent } from './action-mat-menu.component';
import { ICON_TYPE, ACTION_ICON_TYPE_TOKEN } from './action-icon-type-token';
import { ActionMatButtonDirective } from './action-mat-button.directive';

@NgModule({
  imports: [
    CommonModule,
    ActionOutletModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule
  ],
  declarations: [
    ActionMatButtonComponent,
    ActionMatGroupComponent,
    ActionMatMenuComponent,
    ActionMatButtonDirective,
  ],
  entryComponents: [
    ActionMatButtonComponent,
    ActionMatGroupComponent
  ],
  exports: [
    ActionMatButtonComponent,
    ActionMatGroupComponent
  ],
  providers: [{
    provide: ActionButton,
    useValue: ActionMatButtonComponent
  }, {
    provide: ActionGroup,
    useValue: ActionMatGroupComponent
  }]
})
export class ActionMatModule {
    static forRoot(iconType: ICON_TYPE): ModuleWithProviders {
        return {
            ngModule: ActionMatModule,
            providers: [
                {
                    provide: ACTION_ICON_TYPE_TOKEN,
                    useValue: iconType
                }
            ]
        };
    }
}
