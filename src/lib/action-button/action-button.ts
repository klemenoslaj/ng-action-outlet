import { Type } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { ActionAbstract } from '../action-abstract/action-abstract';
import { ActionButtonComponentImpl, ActionButtonEvent, ActionButtonOptions } from './action-button.model';

/**
 * Default options for `ActionButton`  
 * Extended by provided options in action `constructor`
 */
const defaultButtonOptions: ActionButtonOptions = { };

/**
 * `ActionButton` used to create basic button action  
 *
 * ## Example
 *
 * ```typescript
 * const button = new ActionButton({ title: 'Test' });
 * ```
 *
 * **Or**
 *
 * ```typescript
 * const button = actionFactory.createButton({ title: 'Test' });
 * ```
 *
 * **Or**
 *
 * ```typescript
 * const button = actionFactory.createButton().setTitle('Test');
 * ```
 */
export class ActionButton extends ActionAbstract<ActionButtonOptions, ActionButtonEvent> {
    /**
     * `Observable` notifying subscriptions whenever button is triggered
     */
    readonly fire$: Observable<ActionButtonEvent>;
    /**
     * `Observable` notifies subscriptions on following changes:  
     * *title, icon, visibility, disabled*
     */
    readonly changes$: Observable<ActionButtonOptions>;

    /**
     * `Subject`, used to notify subscribers on action trigger
     */
    protected fire: Subject<ActionButtonEvent>;

    /**
     * Public `constructor` used to instantiate `ActionButton`
     *
     * @param options Options for `ActionButton`
     * @param component Optional custom `Component`
     */
    constructor(options: ActionButtonOptions = defaultButtonOptions,
                component?: Type<ActionButtonComponentImpl>) {
        super({ ...defaultButtonOptions, ...options }, component);

        this.fire = new Subject();

        this.fire$ = this.handleLivecycle(this.fire.asObservable(), false);
        this.changes$ = this.handleLivecycle(Observable.merge(
            this.title$.map(title => (<ActionButtonOptions>{ title })),
            this.icon$.map(icon => (<ActionButtonOptions>{ icon })),
            this.visible$.map(visible => (<ActionButtonOptions>{ visible })),
            this.disabled$.map(disabled => (<ActionButtonOptions>{ disabled }))
        ));

        if (this.options.callback) {
            this.fire$.subscribe(this.options.callback);
        }
    }

    /**
     * Will trigger `fire$` subscribers  
     * Should be called in view component on click
     */
    trigger(): this {
        this.fire.next({ action: this });
        return this;
    }
}
