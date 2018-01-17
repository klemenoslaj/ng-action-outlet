import { Component, OnInit } from '@angular/core';
import { ActionOutletFactory } from '../lib/public_api';

@Component({
  selector: 'app-root',
  template: ''
})
export class AppComponent implements OnInit {
  constructor(private actionOutlet: ActionOutletFactory) { }

  ngOnInit(): void {
    const group = this.actionOutlet.createGroup();

    group.createAction({ title: 'Button' });

    console.log('#', group);
  }
}
