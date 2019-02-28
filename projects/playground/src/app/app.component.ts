import { Component, OnInit } from '@angular/core';
import { ActionOutletFactory, ActionGroup, ActionButtonEvent } from '@ng-action-outlet/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  group: ActionGroup;

  constructor(private actionOutlet: ActionOutletFactory) {}

  ngOnInit(): void {
    this.group = this.actionOutlet.createGroup();

    this.group.createButton().setIcon('home').fire$.subscribe(this.callback);
    this.group.createButton().setIcon('person').fire$.subscribe(this.callback);
    this.group.createButton().setIcon('settings').fire$.subscribe(this.callback);

    const childGroup = this.group.createGroup().enableDropdown().setTitle('Dropdown');
    childGroup.createButton().setTitle('Button 4').fire$.subscribe(this.callback);
    childGroup.createButton().setTitle('Button 5').fire$.subscribe(this.callback);
    childGroup.createButton().setTitle('Button 6').fire$.subscribe(this.callback);

    const childGroup2 = childGroup.createGroup().enableDropdown().setTitle('Dropdown 2');
    childGroup2.createButton().setTitle('Button 4').fire$.subscribe(this.callback);
    childGroup2.createButton().setTitle('Button 5').fire$.subscribe(this.callback);
    childGroup2.createButton().setTitle('Button 6').fire$.subscribe(this.callback);

    const childGroup3 = childGroup2.createGroup().enableDropdown().setTitle('Dropdown 3');
    childGroup3.createButton().setTitle('Button 7').fire$.subscribe(this.callback);
  }

  callback = ({ action }: ActionButtonEvent) => console.log('Clicked:', action.getTitle() || action.getIcon());
}
