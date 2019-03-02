import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionOutletModule } from '@ng-action-outlet/core';
import { ActionMatModule } from '@ng-action-outlet/material';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ActionOutletModule,
    ActionMatModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
