import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActionOutletFactory, ActionGroup, ActionButtonEvent } from '@ng-action-outlet/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  group: ActionGroup;

  private index = 1;

  constructor(private actionOutlet: ActionOutletFactory) {}

  ngOnInit(): void {
    this.group = this.actionOutlet.createGroup();

    this.group.createButton().setIcon('home').fire$.subscribe(this.callback);
    this.group.createButton().setIcon('person').fire$.subscribe(this.callback);
    this.group.createButton().setIcon('settings').fire$.subscribe(this.callback);

    const childGroup = this.group.createGroup().enableDropdown().setIcon('more_vert');
    this.createGroupWithChildren(childGroup, 3);
    this.createGroupWithChildren(childGroup, 2);
    this.createGroupWithChildren(childGroup, 5);

    const dropdowns = childGroup.createGroup();
    this.createGroupWithChildren(dropdowns, 5, 'Dropdown 1').enableDropdown();
    this.createGroupWithChildren(dropdowns, 4, 'Dropdown 2').enableDropdown();
    this.createGroupWithChildren(dropdowns, 7, 'Dropdown 3').enableDropdown();

    this.createGroupWithChildren(childGroup, 2);
  }

  callback = ({ action }: ActionButtonEvent) => console.log('Clicked:', action.getTitle() || action.getIcon());

  createGroupWithChildren(parent: ActionGroup, childAmount: number, title: string = '') {
    const group = parent.createGroup().setTitle(title);
    const index = this.index;

    this.index += childAmount;

    for (let i = 0; i < childAmount; i++) {
      group.createButton().setTitle(`Action Button ${index + i}`).fire$.subscribe(this.callback);
    }

    return group;
  }
}
