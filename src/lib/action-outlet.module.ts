import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ActionOutletDirective } from './action-outlet.directive';
import { ActionOutletFactory } from './action-outlet.service';

@NgModule({
  declarations: [ActionOutletDirective],
  imports: [CommonModule],
  exports: [ActionOutletDirective],
  providers: [ActionOutletFactory],
})
export class ActionOutletModule { }
