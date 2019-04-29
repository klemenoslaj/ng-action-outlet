import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionOutletModule } from '@ng-action-outlet/core';
import { ActionMatModule, ICON_TYPE } from '@ng-action-outlet/material';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ActionOutletModule,
    ActionMatModule.forRoot(ICON_TYPE.Font)
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
