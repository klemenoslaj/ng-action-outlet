import { Component, OnInit } from '@angular/core';
import { ActionOutletFactory, ActionButton } from '@ng-action-outlet/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  action: ActionButton;

  constructor(private actionOutlet: ActionOutletFactory) {}

  ngOnInit(): void {
    this.action = this.actionOutlet.createButton({ title: 'Button' });

    console.log('#', this.action);
  }
}
