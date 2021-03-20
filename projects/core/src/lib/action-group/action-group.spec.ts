import { Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { ActionButton } from '../action-button/action-button';
import { ActionToggle } from '../action-toggle/action-toggle';
import { ActionGroup } from './action-group';

interface TestContext {
  action: ActionGroup;
  testScheduler: TestScheduler;
}

interface ChildTestContext extends TestContext {
  childButton: ActionButton;
  childGroup: ActionGroup;
  descendantToggle: ActionToggle;
}

describe('Class: ActionGroup', function (): void {
  describe('api, chaining, children, dropdown', function (): void {
    beforeEach(function (this: TestContext): void {
      this.action = new ActionGroup().activate();
      this.testScheduler = new TestScheduler((actual, e) => <any>expect(actual).toEqual(e));
    });

    it('should have public methods', function (this: TestContext): void {
      expect(this.action.trigger).toEqual(jasmine.any(Function));
      expect(this.action.activate).toEqual(jasmine.any(Function));
      expect(this.action.deactivate).toEqual(jasmine.any(Function));
      expect(this.action.destroy).toEqual(jasmine.any(Function));
      expect(this.action.enable).toEqual(jasmine.any(Function));
      expect(this.action.disable).toEqual(jasmine.any(Function));
      expect(this.action.createButton).toEqual(jasmine.any(Function));
      expect(this.action.createGroup).toEqual(jasmine.any(Function));
      expect(this.action.createToggle).toEqual(jasmine.any(Function));
      expect(this.action.appendChild).toEqual(jasmine.any(Function));
      expect(this.action.appendChildren).toEqual(jasmine.any(Function));
      expect(this.action.prependChild).toEqual(jasmine.any(Function));
      expect(this.action.prependChildren).toEqual(jasmine.any(Function));
      expect(this.action.removeChild).toEqual(jasmine.any(Function));
      expect(this.action.removeChildByIndex).toEqual(jasmine.any(Function));
      expect(this.action.removeChildren).toEqual(jasmine.any(Function));
      expect(this.action.setChildren).toEqual(jasmine.any(Function));
      expect(this.action.getChildren).toEqual(jasmine.any(Function));
      expect(this.action.getChild).toEqual(jasmine.any(Function));
      expect(this.action.isDropdown).toEqual(jasmine.any(Function));
      expect(this.action.enableDropdown).toEqual(jasmine.any(Function));
      expect(this.action.disableDropdown).toEqual(jasmine.any(Function));
    });

    it('should chain methods properly', function (this: TestContext): void {
      expect(this.action.trigger()).toBe(this.action);
      expect(this.action.activate()).toBe(this.action);
      expect(this.action.deactivate()).toBe(this.action);
      expect(this.action.destroy()).toBe(this.action);
      expect(this.action.enable()).toBe(this.action);
      expect(this.action.disable()).toBe(this.action);
      expect(this.action.appendChild(new ActionGroup())).toBe(this.action);
      expect(this.action.appendChildren([new ActionGroup()])).toBe(this.action);
      expect(this.action.prependChild(new ActionGroup())).toBe(this.action);
      expect(this.action.prependChildren([new ActionGroup()])).toBe(this.action);
      expect(this.action.removeChild(new ActionGroup())).toBe(this.action);
      expect(this.action.removeChildByIndex(0)).toBe(this.action);
      expect(this.action.removeChildren()).toBe(this.action);
      expect(this.action.setChildren([new ActionGroup()])).toBe(this.action);
      expect(this.action.enableDropdown()).toBe(this.action);
      expect(this.action.disableDropdown()).toBe(this.action);
    });

    it('should have public observables', function (this: TestContext): void {
      expect(this.action.fire$).toEqual(jasmine.any(Observable));
      expect(this.action.changes$).toEqual(jasmine.any(Observable));
      expect(this.action.children$).toEqual(jasmine.any(Observable));
      expect(this.action.dropdown$).toEqual(jasmine.any(Observable));
    });

    it('should match default values', function (this: TestContext): void {
      expect(this.action.getChildren()).toEqual([]);
      expect(this.action.isDropdown()).toBe(false);
    });

    it('should take provided options instead default', function (this: TestContext): void {
      const childAction = new ActionButton();
      const action = new ActionGroup({
        children: [childAction],
        dropdown: true,
      });

      expect(action).toEqual(jasmine.any(ActionGroup));
      expect(action.getChildren()).toEqual([childAction]);
      expect(action.isDropdown()).toBe(true);
    });

    it('should set provided actions as children', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();
      const child3 = new ActionButton();

      this.action.setChildren([child1, child2, child3]);
      expect(this.action.getChildren()).toEqual([child1, child2, child3]);
      expect(child1.getParent()).toBe(this.action);
      expect(child2.getParent()).toBe(this.action);
      expect(child3.getParent()).toBe(this.action);
    });

    it('should overwrite actions with provided children', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();
      const child3 = new ActionButton();

      this.action.setChildren([child1, child2, child3]);
      expect(this.action.getChildren()).toEqual([child1, child2, child3]);
      expect(child1.getParent()).toBe(this.action);
      expect(child2.getParent()).toBe(this.action);
      expect(child3.getParent()).toBe(this.action);

      const child4 = new ActionButton();
      const child5 = new ActionToggle();
      const child6 = new ActionButton();

      this.action.setChildren([child4, child5, child6]);
      expect(this.action.getChildren()).toEqual([child4, child5, child6]);
      expect(child1.getParent()).not.toBeDefined();
      expect(child2.getParent()).not.toBeDefined();
      expect(child3.getParent()).not.toBeDefined();
      expect(child4.getParent()).toBe(this.action);
      expect(child5.getParent()).toBe(this.action);
      expect(child6.getParent()).toBe(this.action);
    });

    it('should append child action', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();

      this.action.appendChild(child1);
      expect(this.action.getChildren()).toEqual([child1]);
      expect(child1.getParent()).toBe(this.action);

      this.action.appendChild(child2);
      expect(this.action.getChildren()).toEqual([child1, child2]);
      expect(child2.getParent()).toBe(this.action);
    });

    it('should prepend child action', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();

      this.action.prependChild(child1);
      expect(this.action.getChildren()).toEqual([child1]);
      expect(child1.getParent()).toBe(this.action);

      this.action.prependChild(child2);
      expect(this.action.getChildren()).toEqual([child2, child1]);
      expect(child2.getParent()).toBe(this.action);
    });

    it('should append child actions', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();
      const child3 = new ActionGroup();

      this.action.setChildren([child1]);

      this.action.appendChildren([child2, child3]);
      expect(this.action.getChildren()).toEqual([child1, child2, child3]);
      expect(child1.getParent()).toBe(this.action);
      expect(child2.getParent()).toBe(this.action);
    });

    it('should prepend child actions', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();
      const child3 = new ActionGroup();

      this.action.setChildren([child1]);

      this.action.prependChildren([child2, child3]);
      expect(this.action.getChildren()).toEqual([child2, child3, child1]);
      expect(child1.getParent()).toBe(this.action);
      expect(child2.getParent()).toBe(this.action);
    });

    it('should remove children', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();

      this.action.appendChildren([child1, child2]);
      this.action.removeChildren();

      expect(this.action.getChildren()).toEqual([]);
      expect(child1.getParent()).not.toBeDefined();
      expect(child2.getParent()).not.toBeDefined();
    });

    it('should remove provided child', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();

      this.action.appendChildren([child1, child2]);
      this.action.removeChild(child1);

      expect(this.action.getChildren()).toEqual([child2]);
      expect(child1.getParent()).not.toBeDefined();
    });

    it('should remove child at provided index', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();

      this.action.appendChildren([child1, child2]);
      this.action.removeChildByIndex(1);

      expect(this.action.getChildren()).toEqual([child1]);
      expect(child2.getParent()).not.toBeDefined();
    });

    it('should get children correctly', function (this: TestContext): void {
      const child1 = new ActionButton();
      const child2 = new ActionToggle();
      const child3 = new ActionGroup();

      this.action.setChildren([child1, child2, child3]);
      expect(this.action.getChildren()).toEqual([child1, child2, child3]);
      expect(this.action.getChild(0)).toBe(child1);
      expect(this.action.getChild(1)).toBe(child2);
      expect(this.action.getChild(2)).toBe(child3);
      expect(this.action.getChild(-1)).toBe(child3);
      expect(this.action.getChild(-2)).toBe(child2);
      expect(this.action.getChild(-3)).toBe(child1);
    });

    it('should not append child that belongs to another group', function (this: TestContext): void {
      const childButton = new ActionButton();
      const anotherGroup = new ActionGroup({
        children: [childButton],
      });

      expect(childButton.getParent()).toBe(anotherGroup);

      this.action.appendChild(childButton);
      expect(this.action.getChildren()).toEqual([]);
      expect(childButton.getParent()).toBe(anotherGroup);
    });

    it('should set and change dropdown', function (this: TestContext): void {
      expect(this.action.isDropdown()).toBe(false);

      this.action.enableDropdown();
      expect(this.action.isDropdown()).toBe(true);
      this.action.disableDropdown();
      expect(this.action.isDropdown()).toBe(false);
    });

    it('should notify every change with changes$', function (this: TestContext): void {
      const children = [new ActionButton()];
      const marble = '(tivdcw)';
      const values = {
        t: { title: 'Test Title' },
        i: { icon: 'test-icon' },
        v: { visible: true },
        d: { disabled: false },
        c: { children },
        w: { dropdown: true },
      };

      this.action.setTitle('Test Title');
      this.action.setIcon('test-icon');
      this.action.show();
      this.action.enable();
      this.action.setChildren(children);
      this.action.enableDropdown();

      this.testScheduler.expectObservable(this.action.changes$).toBe(marble, values);
      this.testScheduler.flush();
    });
  });

  describe('chaining descendants states', function (): void {
    beforeEach(function (this: ChildTestContext): void {
      this.action = new ActionGroup().activate();
      this.childButton = new ActionButton();
      this.childGroup = new ActionGroup();
      this.descendantToggle = new ActionToggle();

      this.action.appendChild(this.childButton);
      this.action.appendChild(this.childGroup);
      this.childGroup.appendChild(this.descendantToggle);

      this.testScheduler = new TestScheduler((actual, e) => <any>expect(actual).toEqual(e));
    });

    it('Descendants should inherit action state', function (this: ChildTestContext): void {
      expect(this.action.isActive()).toBe(true);
      expect(this.childButton.isActive()).toBe(true);
      expect(this.childGroup.isActive()).toBe(true);
      expect(this.descendantToggle.isActive()).toBe(true);
    });

    it('should not change action state once destroyed', function (this: ChildTestContext): void {
      this.action.destroy();
      expect(this.action.isDestroyed()).toBe(true);
      expect(this.childButton.isDestroyed()).toBe(true);
      expect(this.childGroup.isDestroyed()).toBe(true);
      expect(this.descendantToggle.isDestroyed()).toBe(true);

      this.action.activate();
      expect(this.action.isActive()).toBe(false);
      expect(this.childButton.isActive()).toBe(false);
      expect(this.childGroup.isActive()).toBe(false);
      expect(this.descendantToggle.isActive()).toBe(false);

      this.action.deactivate();
      expect(this.action.isInactive()).toBe(false);
      expect(this.childButton.isInactive()).toBe(false);
      expect(this.childGroup.isInactive()).toBe(false);
      expect(this.descendantToggle.isInactive()).toBe(false);
    });

    it('should set action state to all descendants', function (this: ChildTestContext): void {
      this.action.deactivate();
      expect(this.action.isActive()).toBe(false);
      expect(this.childButton.isActive()).toBe(false);
      expect(this.childGroup.isActive()).toBe(false);
      expect(this.descendantToggle.isActive()).toBe(false);
      expect(this.action.isInactive()).toBe(true);
      expect(this.childButton.isInactive()).toBe(true);
      expect(this.childGroup.isInactive()).toBe(true);
      expect(this.descendantToggle.isInactive()).toBe(true);
      expect(this.action.isDestroyed()).toBe(false);
      expect(this.childButton.isDestroyed()).toBe(false);
      expect(this.childGroup.isDestroyed()).toBe(false);
      expect(this.descendantToggle.isDestroyed()).toBe(false);

      this.action.activate();
      expect(this.action.isActive()).toBe(true);
      expect(this.childButton.isActive()).toBe(true);
      expect(this.childGroup.isActive()).toBe(true);
      expect(this.descendantToggle.isActive()).toBe(true);
      expect(this.action.isInactive()).toBe(false);
      expect(this.childButton.isInactive()).toBe(false);
      expect(this.childGroup.isInactive()).toBe(false);
      expect(this.descendantToggle.isInactive()).toBe(false);
      expect(this.action.isDestroyed()).toBe(false);
      expect(this.childButton.isDestroyed()).toBe(false);
      expect(this.childGroup.isDestroyed()).toBe(false);
      expect(this.descendantToggle.isDestroyed()).toBe(false);

      this.action.destroy();
      expect(this.action.isActive()).toBe(false);
      expect(this.childButton.isActive()).toBe(false);
      expect(this.childGroup.isActive()).toBe(false);
      expect(this.descendantToggle.isActive()).toBe(false);
      expect(this.action.isInactive()).toBe(false);
      expect(this.childButton.isInactive()).toBe(false);
      expect(this.childGroup.isInactive()).toBe(false);
      expect(this.descendantToggle.isInactive()).toBe(false);
      expect(this.action.isDestroyed()).toBe(true);
      expect(this.childButton.isDestroyed()).toBe(true);
      expect(this.childGroup.isDestroyed()).toBe(true);
      expect(this.descendantToggle.isDestroyed()).toBe(true);
    });

    it('should set disabled state to all descendants', function (this: ChildTestContext): void {
      this.action.enable();
      expect(this.action.isEnabled()).toBe(true);
      expect(this.childButton.isEnabled()).toBe(true);
      expect(this.childGroup.isEnabled()).toBe(true);
      expect(this.descendantToggle.isEnabled()).toBe(true);
      expect(this.action.isDisabled()).toBe(false);
      expect(this.childButton.isDisabled()).toBe(false);
      expect(this.childGroup.isDisabled()).toBe(false);
      expect(this.descendantToggle.isDisabled()).toBe(false);

      this.action.disable();
      expect(this.action.isEnabled()).toBe(false);
      expect(this.childButton.isEnabled()).toBe(false);
      expect(this.childGroup.isEnabled()).toBe(false);
      expect(this.descendantToggle.isEnabled()).toBe(false);
      expect(this.action.isDisabled()).toBe(true);
      expect(this.childButton.isDisabled()).toBe(true);
      expect(this.childGroup.isDisabled()).toBe(true);
      expect(this.descendantToggle.isDisabled()).toBe(true);
    });
  });

  describe('creating actions', function (): void {
    beforeEach(function (this: TestContext): void {
      this.action = new ActionGroup().activate();
      this.testScheduler = new TestScheduler((actual, e) => <any>expect(actual).toEqual(e));
    });

    it('should create attach and return instance of ActionButton', function (this: TestContext): void {
      const actionButton = this.action.createButton();

      expect(actionButton).toEqual(jasmine.any(ActionButton));
      expect(actionButton.getParent()).toBe(this.action);
      expect(this.action.getChildren()).toEqual([actionButton]);
      expect(this.action.getChild(0)).toBe(actionButton);
    });

    it('should create attach and return instance of ActionGroup', function (this: TestContext): void {
      const actionGroup = this.action.createGroup();

      expect(actionGroup).toEqual(jasmine.any(ActionGroup));
      expect(actionGroup.getParent()).toBe(this.action);
      expect(this.action.getChildren()).toEqual([actionGroup]);
      expect(this.action.getChild(0)).toBe(actionGroup);
    });

    it('should create attach and return instance of ActionToggle', function (this: TestContext): void {
      const actionToggle = this.action.createToggle();

      expect(actionToggle).toEqual(jasmine.any(ActionToggle));
      expect(actionToggle.getParent()).toBe(this.action);
      expect(this.action.getChildren()).toEqual([actionToggle]);
      expect(this.action.getChild(0)).toBe(actionToggle);
    });
  });
});
