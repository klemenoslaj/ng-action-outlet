import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatMenuModule, MatIconModule } from '@angular/material';
import { ActionOutletModule, ActionButton, ActionGroup } from '@ng-action-outlet/core';

import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GroupComponent } from './group/group.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent,
    GroupComponent,
  ],
  imports: [
    BrowserModule,
    ActionOutletModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
  ],
  entryComponents: [ButtonComponent, GroupComponent],
  providers: [{
    provide: ActionButton,
    useValue: ButtonComponent
  }, {
    provide: ActionGroup,
    useValue: GroupComponent
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
