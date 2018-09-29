import { BehaviorSubject, never, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

import { ActionGroup } from '../action-group/action-group';
import { ActionAbstract, ActionState } from './action-abstract';

class ActionAbstractTest extends ActionAbstract<any, any> {
    changes$: any = never();
    fire$: any = never();

    state: BehaviorSubject<ActionState>;

    constructor() {
        super({});
    }

    trigger(): this {
        return this;
    }

    /**
     * Expose the internal 'handleLivecycle' method, for testing
     * @param observable - Observable to test
     * @param shouldPause - Determines if observable can be paused
     */
    testHandleLivecycle<T>(observable: Observable<T>, shouldPause?: boolean): Observable<T> {
        return this.handleLivecycle(observable, shouldPause);
    }

    /**
     * Expose the internal 'handleLivecycleDistinct' method, for testing
     * @param observable - Observable to test
     * @param shouldPause - Determines if observable can be paused
     */
    testHandleLivecycleDistinct<T>(observable: Observable<T>, shouldPause?: boolean): Observable<T> {
        return this.handleLivecycleDistinct(observable, shouldPause);
    }

    /**
     * Replace internal state BehaviorSubject in order to test livecycle of exposed observables
     * @param stateObservable - Hot observable to replace internal state BehaviorSubject
     */
    testWithCustomState(stateObservable: Observable<{}>): this {
        if (stateObservable) {
            this.state = <any>stateObservable;
            (<any>this).finish = this.state.pipe(
              filter(state => state === ActionState.Destroyed)
            );
        }

        return this;
    }
}

interface TestContext {
    parent: ActionGroup; // Used to test _setParent and _unsetParent only due to strict argument type
    action: ActionAbstractTest;
    testScheduler: TestScheduler;
}

describe('Class: ActionAbstract', function (): void {
    beforeEach(function (this: TestContext): void {
        this.action = new ActionAbstractTest().activate();
        this.parent = new ActionGroup().activate();
        this.testScheduler = new TestScheduler(
            (actual, e) => <any>expect(actual).toEqual(e)
        );
    });

    it('should have public methods', function (this: TestContext): void {
        expect(this.action.trigger).toEqual(jasmine.any(Function));
        expect(this.action.activate).toEqual(jasmine.any(Function));
        expect(this.action.deactivate).toEqual(jasmine.any(Function));
        expect(this.action.destroy).toEqual(jasmine.any(Function));
        expect(this.action.isActive).toEqual(jasmine.any(Function));
        expect(this.action.isInactive).toEqual(jasmine.any(Function));
        expect(this.action.setTitle).toEqual(jasmine.any(Function));
        expect(this.action.getTitle).toEqual(jasmine.any(Function));
        expect(this.action.setIcon).toEqual(jasmine.any(Function));
        expect(this.action.getIcon).toEqual(jasmine.any(Function));
        expect(this.action.show).toEqual(jasmine.any(Function));
        expect(this.action.hide).toEqual(jasmine.any(Function));
        expect(this.action.setVisibility).toEqual(jasmine.any(Function));
        expect(this.action.isVisible).toEqual(jasmine.any(Function));
        expect(this.action.isHidden).toEqual(jasmine.any(Function));
        expect(this.action.enable).toEqual(jasmine.any(Function));
        expect(this.action.disable).toEqual(jasmine.any(Function));
        expect(this.action.isDisabled).toEqual(jasmine.any(Function));
        expect(this.action.isEnabled).toEqual(jasmine.any(Function));
        expect(this.action.getForcedComponent).toEqual(jasmine.any(Function));
        expect(this.action.getParent).toEqual(jasmine.any(Function));

        // Private api
        expect(this.action._setParent).toEqual(jasmine.any(Function));
        expect(this.action._unsetParent).toEqual(jasmine.any(Function));
    });

    it('should chain methods properly', function (this: TestContext): void {
        expect(this.action.trigger()).toBe(this.action);
        expect(this.action.activate()).toBe(this.action);
        expect(this.action.deactivate()).toBe(this.action);
        expect(this.action.destroy()).toBe(this.action);
        expect(this.action.setTitle('Test Title')).toBe(this.action);
        expect(this.action.setIcon('test-icon')).toBe(this.action);
        expect(this.action.show()).toBe(this.action);
        expect(this.action.hide()).toBe(this.action);
        expect(this.action.setVisibility(true)).toBe(this.action);
        expect(this.action.enable()).toBe(this.action);
        expect(this.action.disable()).toBe(this.action);

        // Private api
        expect(this.action._setParent(this.parent)).toBe(this.action);
        expect(this.action._unsetParent()).toBe(this.action);
    });

    it('should have public observables', function (this: TestContext): void {
        expect(this.action.title$).toEqual(jasmine.any(Observable));
        expect(this.action.icon$).toEqual(jasmine.any(Observable));
        expect(this.action.visible$).toEqual(jasmine.any(Observable));
        expect(this.action.disabled$).toEqual(jasmine.any(Observable));
        expect(this.action.state$).toEqual(jasmine.any(Observable));
        expect(this.action.fire$).toEqual(jasmine.any(Observable));
        expect(this.action.changes$).toEqual(jasmine.any(Observable));
    });

    it('should match default values', function (this: TestContext): void {
        expect(this.action.getTitle()).toBe('');
        expect(this.action.getIcon()).toBe('');
        expect(this.action.isVisible()).toBe(true);
        expect(this.action.isDisabled()).toBe(false);
    });

    it('should set title correctly', function (this: TestContext): void {
        const title = 'Test Title 1';
        const values = { t: title };
        const expected = 't';

        expect(this.action.setTitle(title)).toBe(this.action);
        expect(this.action.getTitle()).toBe(title);

        this.testScheduler.expectObservable(this.action.title$).toBe(expected, values);
        this.testScheduler.flush();
    });

    it('should set icon correctly', function (this: TestContext): void {
        const icon = 'action-icon';
        const values = { i: icon };
        const expected = 'i';

        expect(this.action.setIcon(icon)).toBe(this.action);
        expect(this.action.getIcon()).toBe(icon);

        this.testScheduler.expectObservable(this.action.icon$).toBe(expected, values);
        this.testScheduler.flush();
    });

    it('should set visibility correctly', function (this: TestContext): void {
        expect(this.action.isVisible()).toEqual(jasmine.any(Boolean));
        expect(this.action.isHidden()).toEqual(jasmine.any(Boolean));
        expect(this.action.isVisible()).not.toBe(this.action.isHidden());

        expect(this.action.show()).toBe(this.action);
        expect(this.action.isHidden()).toBe(false);
        expect(this.action.isVisible()).toBe(true);

        expect(this.action.hide()).toBe(this.action);
        expect(this.action.isHidden()).toBe(true);
        expect(this.action.isVisible()).toBe(false);

        expect(this.action.setVisibility(true)).toBe(this.action);
        expect(this.action.isHidden()).toBe(false);
        expect(this.action.isVisible()).toBe(true);

        expect(this.action.setVisibility(false)).toBe(this.action);
        expect(this.action.isHidden()).toBe(true);
        expect(this.action.isVisible()).toBe(false);
    });

    it('should set disabled state correctly', function (this: TestContext): void {
        expect(this.action.isEnabled()).toEqual(jasmine.any(Boolean));
        expect(this.action.isDisabled()).toEqual(jasmine.any(Boolean));
        expect(this.action.isEnabled()).not.toBe(this.action.isDisabled());

        expect(this.action.enable()).toBe(this.action);
        expect(this.action.isDisabled()).toBe(false);
        expect(this.action.isEnabled()).toBe(true);

        expect(this.action.disable()).toBe(this.action);
        expect(this.action.isDisabled()).toBe(true);
        expect(this.action.isEnabled()).toBe(false);
    });

    it('should toggle action state correctly', function (this: TestContext): void {
        expect(this.action.isActive()).toEqual(jasmine.any(Boolean));
        expect(this.action.isInactive()).toEqual(jasmine.any(Boolean));
        expect(this.action.isActive()).not.toBe(this.action.isInactive());

        expect(this.action.activate()).toBe(this.action);
        expect(this.action.isInactive()).toBe(false);
        expect(this.action.isActive()).toBe(true);
        expect(this.action.isDestroyed()).toBe(false);

        expect(this.action.deactivate()).toBe(this.action);
        expect(this.action.isInactive()).toBe(true);
        expect(this.action.isActive()).toBe(false);
        expect(this.action.isDestroyed()).toBe(false);

        expect(this.action.destroy()).toBe(this.action);
        expect(this.action.isInactive()).toBe(false);
        expect(this.action.isActive()).toBe(false);
        expect(this.action.isDestroyed()).toBe(true);
    });

    it('should not change action state once destroyed', function (this: TestContext): void {
        this.action.destroy();
        expect(this.action.isActive()).toBe(false);
        expect(this.action.isInactive()).toBe(false);
        expect(this.action.isDestroyed()).toBe(true);
    });

    it('should update values on setter methods', function (this: TestContext): void {
        this.action.setTitle('New title');
        expect(this.action.getTitle()).toBe('New title');

        this.action.setIcon('New icon');
        expect(this.action.getIcon()).toBe('New icon');

        this.action.hide();
        expect(this.action.isVisible()).toBe(false);

        this.action.show();
        expect(this.action.isVisible()).toBe(true);

        this.action.setVisibility(false);
        expect(this.action.isVisible()).toBe(false);

        this.action.disable();
        expect(this.action.isDisabled()).toBe(true);

        this.action.enable();
        expect(this.action.isDisabled()).toBe(false);
    });

    it('should set and unset parent', function (this: TestContext): void {
        // Private api
        expect(this.action._setParent(this.parent)).toBe(this.action);
        expect(this.action.getParent()).toBe(this.parent);

        // Will take `else` path: `if (this.parent === undefined)`
        expect(this.action._setParent(this.parent)).toBe(this.action);

        expect(this.action._unsetParent()).toBe(this.action);
        expect(this.action.getParent()).toBeUndefined();
    });

    it('should disable child if parent is disabled', function (this: TestContext): void {
        // Private api
        this.parent.disable();

        expect(this.action._setParent(this.parent)).toBe(this.action);
        expect(this.action.isDisabled()).toBe(true);
        expect(this.action.isEnabled()).toBe(false);
    });

    it('should make distinct observable', function (this: TestContext): void {
        const marble = '-a-a-b';
        const expected = '-a---b';
        const values = {
            a: 'Title 1',
            b: 'Title 2',
        };

        const obs$ = this.action.testHandleLivecycleDistinct(
            this.testScheduler.createHotObservable(marble, values)
        );

        this.testScheduler.expectObservable(obs$).toBe(expected, values);
        this.testScheduler.flush();
    });

    it('should complete observables', function (this: TestContext): void {
        const marble = '---d|';
        const obs = '-s-o-b-i';

        const expected = '-s-|';

        const values1 = { d: ActionState.Destroyed };

        const obs1$ = this.testScheduler.createHotObservable(marble, values1);
        const obs2$ = this.testScheduler.createHotObservable(obs);

        const obs3$ = this.action
            .testWithCustomState(obs1$)
            .testHandleLivecycle(obs2$, false);

        this.testScheduler.expectObservable(obs3$).toBe(expected);
        this.testScheduler.flush();
    });

    it('should pause observables', function (this: TestContext): void {
        const marble = '-a-b-c-d';
        const state = 'a-i---a';
        const expected = '-a-----d';

        const values = {
            i: ActionState.Inactive,
            a: ActionState.Active,
        };

        // State observable - Used internally by action to pause or unpause observables
        const state$ = this.testScheduler.createHotObservable(state, values);
        // Hand custom state hot observable that replaces internal state subject to action and
        // handle livecycle(pause, destroy) of provided observable using 'testHandleLivecycle'
        const obs$ = this.action
            .testWithCustomState(state$)
            .testHandleLivecycle(this.testScheduler.createHotObservable(marble));

        // Observable should be paused. 'a-i---a' - Paused beteen 'i' and 'a'
        this.testScheduler.expectObservable(obs$).toBe(expected);
        this.testScheduler.flush();
    });
});
