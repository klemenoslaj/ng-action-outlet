import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionOutletDirective } from './action-outlet.directive';

@NgModule({
  declarations: [ActionOutletDirective],
  imports: [CommonModule],
  exports: [ActionOutletDirective]
})
export class ActionOutletModule { }
