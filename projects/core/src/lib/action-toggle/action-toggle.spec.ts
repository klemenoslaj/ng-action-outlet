import { TestScheduler } from 'rxjs/testing';

import { ActionToggle } from './action-toggle';

interface TestContext {
    action: ActionToggle;
    testScheduler: TestScheduler;
}

describe('Class: ActionToggle', function (): void {
    beforeEach(function (this: TestContext): void {
        this.action = new ActionToggle().activate();
        this.testScheduler = new TestScheduler(
            (actual, e) => <any>expect(actual).toEqual(e)
        );
    });

    it('should have public methods', function (this: TestContext): void {
        expect(this.action.trigger).toEqual(jasmine.any(Function));
        expect(this.action.check).toEqual(jasmine.any(Function));
        expect(this.action.uncheck).toEqual(jasmine.any(Function));
        expect(this.action.isChecked).toEqual(jasmine.any(Function));
        expect(this.action.isUnchecked).toEqual(jasmine.any(Function));
    });

    it('should chain methods properly', function (this: TestContext): void {
        expect(this.action.trigger()).toBe(this.action);
        expect(this.action.check()).toBe(this.action);
        expect(this.action.uncheck()).toBe(this.action);
    });


    it('should match default values', function (this: TestContext): void {
        expect(this.action.isChecked()).toEqual(false);
    });

    it('should take provided options instead default', function (this: TestContext): void {
        const action = new ActionToggle({ callback: () => {}, checked: true });
        expect(action).toEqual(jasmine.any(ActionToggle));
        expect(action.isChecked()).toBe(true);
    });

    it('should change checked state correctly', function (this: TestContext): void {
        expect(this.action.check()).toBe(this.action);
        expect(this.action.isChecked()).toBe(true);
        expect(this.action.isUnchecked()).toBe(false);
        expect(this.action.isChecked()).not.toBe(this.action.isUnchecked());

        expect(this.action.uncheck()).toBe(this.action);
        expect(this.action.isChecked()).toBe(false);
        expect(this.action.isUnchecked()).toBe(true);
        expect(this.action.isChecked()).not.toBe(this.action.isUnchecked());
    });

    it('should toggle checked state', function (this: TestContext): void {
        // Default is unchecked
        expect(this.action.isChecked()).toBe(false);
        expect(this.action.isUnchecked()).toBe(true);

        this.action.trigger();
        expect(this.action.isChecked()).toBe(true);
        expect(this.action.isUnchecked()).toBe(false);

        this.action.trigger();
        expect(this.action.isChecked()).toBe(false);
        expect(this.action.isUnchecked()).toBe(true);

        this.action.trigger();
        expect(this.action.isChecked()).toBe(true);
        expect(this.action.isUnchecked()).toBe(false);
    });

    it('should notify subscribers of fire$ with checked state in addition', function (this: TestContext): void {
        const marble = 'a';
        const values = {
            a: {
                action: this.action,
                checked: true,
            },
        };

        this.action.check();

        this.testScheduler.expectObservable(this.action.fire$).toBe(marble, values);
        this.testScheduler.flush();
    });

    it('should notify every change with changes$ observable', function (this: TestContext): void {
        const marble = '(tivdc)';
        const values = {
            t: { title: 'Test Title' },
            i: { icon: 'test-icon' },
            v: { visible: true },
            d: { disabled: false },
            c: { checked: false },
        };

        this.action.setTitle('Test Title');
        this.action.setIcon('test-icon');
        this.action.show();
        this.action.enable();

        this.testScheduler.expectObservable(this.action.changes$).toBe(marble, values);
        this.testScheduler.flush();
    });
});
