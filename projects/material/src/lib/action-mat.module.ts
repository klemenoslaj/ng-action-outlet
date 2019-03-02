import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionOutletModule, ActionButton, ActionGroup } from '@ng-action-outlet/core';
import { MatButtonModule, MatMenuModule, MatIconModule, MatDividerModule } from '@angular/material';

import { ActionMatButtonComponent } from './action-mat-button.component';
import { ActionMatGroupComponent } from './action-mat-group.component';

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
    ActionMatGroupComponent
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
export class ActionMatModule { }
