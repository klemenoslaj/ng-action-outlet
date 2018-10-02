import { CommonModule } from '@angular/common';
import { NgModule, Type, ModuleWithProviders } from '@angular/core';

import { ActionOutletDirective } from './action-outlet.directive';

@NgModule({
  declarations: [ActionOutletDirective],
  imports: [CommonModule],
  exports: [ActionOutletDirective]
})
export class ActionOutletModule { }
