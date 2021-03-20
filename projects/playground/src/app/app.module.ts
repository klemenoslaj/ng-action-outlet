import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActionOutletModule } from '@ng-action-outlet/core';
import { ActionMatModule, ICON_TYPE } from '@ng-action-outlet/material';
import { MatDividerModule } from '@angular/material/divider';

import { AppComponent } from './app.component';

@Component({
  template: 'home',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}

@Component({
  template: 'hello',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelloComponent {}

@NgModule({
  declarations: [AppComponent, HomeComponent, HelloComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ActionOutletModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDividerModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'hello',
        component: HelloComponent,
      },
      { path: '**', redirectTo: 'search' },
    ]),
    ActionMatModule.forRoot(ICON_TYPE.Font),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
