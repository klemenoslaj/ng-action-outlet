import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionOutletModule, ActionButton, ActionGroup } from '@ng-action-outlet/core';
import { MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule } from '@angular/material';

import { ActionMatButtonComponent } from './action-mat-button.component';
import { ActionMatGroupComponent } from './action-mat-group.component';
import { ActionMatIconComponent } from './action-mat-icon.component';
import { ICON_TYPE, ACTION_ICON_TYPE_TOKEN } from './action-icon-type-token';

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
    ActionMatIconComponent,
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
