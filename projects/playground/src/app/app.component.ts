import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActionGroup, ActionButtonEvent, ActionButton, AnyAction, ActionAnchor } from '@ng-action-outlet/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  button1 = new ActionButton({
    title: 'Button 1',
    callback: this.callback,
  });
  link1 = new ActionAnchor({
    title: 'Hello route (this tab)',
    href: ['hello'],
  });
  menuItem1 = new ActionButton({
    title: 'Menu item 1',
    callback: this.callback
  });
  dropdown2 = new ActionGroup({
    dropdown: true,
    title: 'Show More &#8230;',
    children: [
      new ActionGroup({
        children: [
          new ActionButton({
            title: 'Menu Item 2'
          }),
          new ActionButton({
            title: 'Menu Item 3'
          })
        ]
      }),
      new ActionGroup({
        children: [
          new ActionButton({
            title: 'Menu Item 4'
          }),
          new ActionButton({
            title: 'Menu Item 5'
          })
        ]
      })
    ]
  });
  dropdown1 = new ActionGroup({
    dropdown: true,
    icon: 'more_vert',
    ariaLabel: 'Menu for more actions',
    children: [
      this.menuItem1,
      new ActionGroup({
        children: [
          new ActionAnchor({
            title: 'Hello route (new tab)',
            href: ['hello'],
            target: '_blank',
          }),
          new ActionAnchor({
            title: 'Home route (this tab)',
            href: ['home'],
          }),
          new ActionAnchor({
            title: 'Home route (new tab)',
            href: ['home'],
            target: '_blank',
          }),
          new ActionAnchor({
            title: 'Google (this tab)',
            href: 'http://www.google.com',
          }),
          new ActionAnchor({
            title: 'Google (new tab)',
            href: 'http://www.google.com',
            target: '_blank',
          }),]
      }),
      new ActionGroup({
        children: [this.dropdown2]
      })
    ]
  });
  group1 = new ActionGroup({
    children: [
      this.button1,
      this.link1,
      this.dropdown1
    ]
  });

  callback({ action }: ActionButtonEvent) {
    alert('Clicked: ' + action.getTitle() || action.getIcon())
  }

  toggleDisabled(action: AnyAction) {
    if (action.isDisabled()) {
      action.enable();
    } else {
      action.disable();
    }
  }

  toggleVisible(action: AnyAction) {
    action.setVisibility(!action.isVisible());
  }

  getActionType(action: AnyAction) {
    if (action instanceof ActionButton) {
      return 'Button';
    }
    if (action instanceof ActionGroup) {
      if (action.isDropdown()) {
        return 'Dropdown';
      }

      return 'Group';
    }
  }
}
