import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionOutletModule, ActionButton } from '@ng-action-outlet/core';

import { AppComponent } from './app.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonComponent
  ],
  imports: [
    BrowserModule,
    ActionOutletModule
  ],
  entryComponents: [ButtonComponent],
  providers: [{
    provide: ActionButton,
    useValue: ButtonComponent
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
