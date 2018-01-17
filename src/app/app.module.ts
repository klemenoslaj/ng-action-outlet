import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ActionOutletModule, ActionOutletFactory } from '../lib/public_api';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ActionOutletModule
  ],
  providers: [
    ActionOutletFactory
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
