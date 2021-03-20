import { TestScheduler } from 'rxjs/testing';

import { ActionButton } from './action-button';

interface TestContext {
  action: ActionButton;
  testScheduler: TestScheduler;
}

describe('Class: ActionButton', function (): void {
  beforeEach(function (this: TestContext): void {
    this.action = new ActionButton().activate();
    this.testScheduler = new TestScheduler((actual, e) => <any>expect(actual).toEqual(e));
  });

  it('should have public methods', function (this: TestContext): void {
    expect(this.action.trigger).toEqual(jasmine.any(Function));
  });

  it('should take provided options instead default', function (this: TestContext): void {
    const action = new ActionButton({ callback: () => {} });
    expect(action).toEqual(jasmine.any(ActionButton));
  });

  it('should trigger the action', function (this: TestContext): void {
    this.action.fire$.subscribe(({ action }) => {
      expect(action).toBe(this.action);
    });

    expect(this.action.trigger()).toBe(this.action);
    expect(this.action.trigger()).toBe(this.action);
    expect(this.action.trigger()).toBe(this.action);
  });

  it('should notify every change with changes$', function (this: TestContext): void {
    const marble = '(tivd)';
    const values = {
      t: { title: 'Test Title' },
      i: { icon: 'test-icon' },
      v: { visible: true },
      d: { disabled: false },
    };

    this.action.setTitle('Test Title');
    this.action.setIcon('test-icon');
    this.action.show();
    this.action.enable();

    this.testScheduler.expectObservable(this.action.changes$).toBe(marble, values);
    this.testScheduler.flush();
  });
});
