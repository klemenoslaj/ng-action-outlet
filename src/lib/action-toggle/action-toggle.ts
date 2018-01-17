import { Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { ActionAbstract } from '../action-abstract/action-abstract';
import { ActionToggleComponentImpl, ActionToggleEvent, ActionToggleOptions } from './action-toggle.model';

/**
 * Default options for `ActionToggle`  
 * Extended by provided options in action `constructor`
 */
const defaultToggleOptions: ActionToggleOptions = {
    checked: false,
};

/**
 * `ActionToggle` used to create action with toggle functionality,  
 * *e.g. checkbox, toggle slider*
 *
 * ## Example
 *
 * ```typescript
 * const toggle = new ActionToggle({ checked: true });
 * ```
 *
 * **Or**
 *
 * ```typescript
 * const toggle = actionFactory.createToggle({ checked: true });
 * ```
 *
 * **Or**
 *
 * ```typescript
 * const toggle = actionFactory.createToggle().check();
 * ```
 */
export class ActionToggle extends ActionAbstract<ActionToggleOptions, ActionToggleEvent> {
    /**
     * `Observable` notifying subscriptions on the change of `checked` state
     */
    readonly fire$: Observable<ActionToggleEvent>;
    /**
     * `Observable` notifies subscriptions on following changes:  
     * *title, icon, visibility, disabled, checked*
     */
    readonly changes$: Observable<ActionToggleOptions>;

    /**
     * `BehaviorSubject`, holding the current checked state
     */
    protected fire: BehaviorSubject<boolean>;

    /**
     * Public `constructor` used to instantiate `ActionToggle`
     *
     * @param options Options for `ActionToggle`
     * @param component Optional custom `Component`
     */
    constructor(options: ActionToggleOptions = defaultToggleOptions,
                component?: Type<ActionToggleComponentImpl>) {
        super({ ...defaultToggleOptions, ...options }, component);

        this.fire = new BehaviorSubject(this.options.checked);

        this.fire$ = this.handleLivecycleDistinct(this.fire.asObservable(), false)
            .map(checked => ({ action: this, checked }));

        this.changes$ = this.handleLivecycle(Observable.merge(
            this.title$.map(title => (<ActionToggleOptions>{ title })),
            this.icon$.map(icon => (<ActionToggleOptions>{ icon })),
            this.visible$.map(visible => (<ActionToggleOptions>{ visible })),
            this.disabled$.map(disabled => (<ActionToggleOptions>{ disabled })),
            this.fire.map(checked => (<ActionToggleOptions>{ checked }))
        ));

        if (this.options.callback) {
            this.fire$.subscribe(this.options.callback);
        }
    }

    /**
     * Will toggle current checked state when invoked  
     * Should be called in view component on click
     */
    trigger(): this {
        this.fire.next(!this.fire.getValue());
        return this;
    }

    /**
     * Will set checked status to `true`  
     * It will **not** produce second notification if already checked
     */
    check(): this {
        this.fire.next(true);
        return this;
    }

    /**
     * Will set checked status to `false`  
     * It will **not** produce second notification if already unchecked
     */
    uncheck(): this {
        this.fire.next(false);
        return this;
    }

    /**
     * Returns boolean defining whether action is checked
     */
    isChecked(): boolean {
        return this.fire.getValue();
    }

    /**
     * Returns boolean defining whether action is unchecked
     */
    isUnchecked(): boolean {
        return !this.fire.getValue();
    }
}
