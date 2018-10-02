import { Component, OnInit } from '@angular/core';
import { ActionOutletFactory, ActionButton } from '@ng-action-outlet/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  action: ActionButton;

  // Defaults
  icon = 'fa-search';
  title = 'Search';

  constructor(private actionOutlet: ActionOutletFactory) {}

  ngOnInit(): void {
    this.action = this.actionOutlet.createButton({ title: this.title, icon: this.icon });

    this.action.fire$.subscribe(() => alert('button fired'));
  }
}
