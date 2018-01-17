import { Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/if';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import { ActionAbstractComponentImpl, ActionAbstractEvent, ActionAbstractOptions } from '../action-abstract/action-abstract.model';
import { ActionGroup } from '../action-group/action-group';

/**
 * Default options for `ActionAbstract` - shared between **all** actions
 * Extended by provided options in action `constructor`
 */
const defaultAbstractOptions: ActionAbstractOptions = {
    title: '',
    icon: '',
    visible: true,
    disabled: false,
};

/**
 * The state of the action
 * Can be `Active`, `Inactive` or `Destroyed`
 */
export const enum ActionState {
    Active,
    Inactive,
    Destroyed,
}

/**
 * `ActionAbstract` is extended by **all** action implementations  
 * Provides all the behaviors, shared between **each** action  
 * *e.g. title, icon, visibility, disabled, active state*
 * 
 * ## Example
 *
 * ```typescript
 * export class ActionCustom extends ActionAbstract<ActionCustomOptions, ActionCustomEvent> {
 *     // Abstract properties need to be implemented by derived class
 *     fire$: Observable<ActionCustomEvent>;
 *     changes$: Observable<ActionCustomOptions>;
 *     // A custom observable, specific to this action implementation
 *     custom$: Observable<number>;
 *
 *     // A custom subject that is used to bridge reactive and non reactive world
 *     protected custom: Subject<number>;
 *
 *     constructor(options: ActionCustomOptions,
 *                 component?: Type<ActionCustomComponentImpl>) {
 *         this.fire = new Subject();
 *         this.custom = new Subject();
 *
 *         this.fire$ = this.handleLivecycle(this.fire.asObservable(), false);
 *         this.custom$ = this.handleLivecycle(this.custom.asObservable());
 *         this.changes$ = this.handleLivecycle(Observable.merge(
 *             this.title$.map(title => (<ActionCustomOptions>{ title })),
 *             this.icon$.map(icon => (<ActionCustomOptions>{ icon })),
 *             this.visible$.map(visible => (<ActionCustomOptions>{ visible })),
 *             this.disabled$.map(disabled => (<ActionCustomOptions>{ disabled })),
 *             this.custom$.map(custom => (<ActionCustomOptions>{ custom }))
 *         ));
 *     }
 *
 *     // Abstract method trigger needs to be implemented by every derived class
 *     trigger(): this {
 *         this.fire.next({ action: this });
 *         return this;
 *     }
 *
 *     // A custom method to trigger custom subject and custom$ observable
 *     fireCustom(): this {
 *         this.custom.next(Math.random());
 *         return this;
 *     }
 * }
 * ```
 */
export abstract class ActionAbstract<Options extends ActionAbstractOptions, FireEvent extends ActionAbstractEvent> {
    /**
     * `Observable` that notifies subscriptions when title changes
     */
    readonly title$: Observable<string>;
    /**
     * `Observable` that notifies subscriptions when icon changes
     */
    readonly icon$: Observable<string>;
    /**
     * `Observable` that notifies subscriptions when visibility state changes
     * (visible or hidden)
     */
    readonly visible$: Observable<boolean>;
    /**
     * `Observable` that notifies subscriptions when disabled state changes
     */
    readonly disabled$: Observable<boolean>;
    /**
     * `Observable` that notifies subscriptions when action state changes
     * e.g. `Active`, `Inactive`, `Destroyed`
     */
    readonly state$: Observable<ActionState>;
    /**
     * **Abstract** property, holding `Observable`  
     * Each derived class **should** implement it's own `fire$` observable,  
     * with it's own specific implementation
     */
    abstract readonly fire$: Observable<FireEvent>;
    /**
     * **Abstract** property, holding `Observable`  
     * Each derived class **should** implement it's own `changes$` observable,  
     * merging all public observables, notifying for every change doen to action
     */
    abstract readonly changes$: Observable<Options>;

    /**
     * Options of action instance  
     * **Merged** default options from derived class, default options from abstract class,  
     * and options provided on action creation to `constructor`
     */
    protected readonly options: Options;
    /**
     * `Component`, provided to action `constructor`  
     * Should be forced and used instead of component in `Injector`  
     * That is handled by `ActionOutletDirective`
     */
    protected readonly forcedComponent: Type<ActionAbstractComponentImpl>;
    /**
     * Title `BehaviorSubject`, used **internally** to notify on title change  
     * Used to leverage reactive world with non reactive
     */
    protected readonly title: BehaviorSubject<string>;
    /**
     * Icon `BehaviorSubject`, used **internally** to notify on icon change  
     * Used to leverage reactive world with non reactive
     */
    protected readonly icon: BehaviorSubject<string>;
    /**
     * Visibility `BehaviorSubject`, used **internally** to notify on visibility state change  
     * Used to leverage reactive world with non reactive
     */
    protected readonly visible: BehaviorSubject<boolean>;
    /**
     * Desabled state `BehaviorSubject`, used **internally** to notify on disabled state change  
     * Used to leverage reactive world with non reactive
     */
    protected readonly disabled: BehaviorSubject<boolean>;
    /**
     * Action livecycle state `BehaviorSubject`, used **internally** to notify on action state change  
     * Used to leverage reactive world with non reactive
     */
    protected readonly state: BehaviorSubject<ActionState>;
    /**
     * `Observable` that fires, when state matches `ActionState.Destroyed`  
     * Used to complete all **internal** subjects
     */
    protected readonly finish: Observable<ActionState>;

    /**
     * Parent of current action. This is a parent action,  
     * to whom current action belongs to, and renders into
     */
    private parent: ActionGroup;

    /**
     * `constructor` should be `ActionAbstract`
     */
    ['constructor']: typeof ActionAbstract;

    /**
     * Abstract action `constructor`. It will:  
     * - **Extend** default options with derived default options and custom options  
     * - **Create** all private subjects that are used to leverage reactive world with non reactive  
     * - **Create** observable for each private subject  
     * - **Assign** forced component, that is going to be used by `ActionOutletDirective`
     *
     * @param options Options for `ActionAbstract`
     * @param component Optional custom `Component`
     */
    constructor(options: Options,
                component?: Type<ActionAbstractComponentImpl>) {
        const { title, icon, visible, disabled } = this.options = Object.assign({}, defaultAbstractOptions, options);

        this.title = new BehaviorSubject(title);
        this.icon = new BehaviorSubject(icon);
        this.visible = new BehaviorSubject(visible);
        this.disabled = new BehaviorSubject(disabled);
        this.state = new BehaviorSubject(ActionState.Inactive);
        this.finish = this.state.filter(state => state === ActionState.Destroyed);

        this.title$ = this.handleLivecycleDistinct(this.title.asObservable());
        this.icon$ = this.handleLivecycleDistinct(this.icon.asObservable());
        this.visible$ = this.handleLivecycleDistinct(this.visible.asObservable());
        this.disabled$ = this.handleLivecycleDistinct(this.disabled.asObservable());
        this.state$ = this.state.asObservable().distinctUntilChanged();

        this.forcedComponent = component;
    }

    /**
     * Abstract method trigger should be implemented by **each** derived class, in  
     * combination with `fire` subject and `fire$` observable
     */
    abstract trigger(): this;

    /**
     * Used **internally** to handle livecycle of observables  
     * It will handle action state(`Active`, `Inactive` - **paused**, `Destroyed`),  
     * and will notify **only** when value or reference **changes**
     *
     * @param observable `Observable` to handle live cycle
     * @param shouldPause Defining, whether it should be possible to pause provided observable. True by default
     */
    protected handleLivecycleDistinct<T>(observable: Observable<T>, shouldPause?: boolean): Observable<T> {
        return this.handleLivecycle(observable, shouldPause).distinctUntilChanged();
    }

    /**
     * Used internally to handle livecycle of observables  
     * It will handle action state(`Active`, `Inactive` - **paused**, `Destroyed`)
     *
     * @param observable `Observable` to handle live cycle
     * @param shouldPause Defining, whether it should be possible to pause provided observable. True by default
     */
    protected handleLivecycle<T>(observable: Observable<T>, shouldPause: boolean = true): Observable<T> {
        const source = observable.takeUntil(this.finish);

        if (!shouldPause) {
            return source;
        }

        return this.handleActivateState(source);
    }

    /**
     * Used **internally** to handle pausing of observables
     * Will deactivate observable, whenever state of the action changes to `Inactive`,  
     * and will activate observable again, when it switches back to `Active`
     *
     * @param observable `Observable` to handle pausing
     */
    protected handleActivateState<T>(observable: Observable<T>): Observable<T> {
        return this.state.switchMap(state => Observable.if(() => state === ActionState.Inactive, (Observable.never<T>()), observable));
    }

    /**
     * Will **activate** all observables in current action,  
     * **unless action is already destroyed**
     */
    activate(): this {
        if (this.isDestroyed()) {
            return this;
        }

        this.state.next(ActionState.Active);
        return this;
    }

    /**
     * Will **deactivate** all observables in current action,  
     * **unless action is already destroyed**
     */
    deactivate(): this {
        if (this.isDestroyed()) {
            return this;
        }

        this.state.next(ActionState.Inactive);
        return this;
    }

    /**
     * Will set action state to `Destroyed`, which will  
     * complete all observables
     */
    destroy(): this {
        this.state.next(ActionState.Destroyed);
        this.state.complete();
        return this;
    }

    /**
     * Returns boolean defining whether action has state `ActionState.Active`
     */
    isActive(): boolean {
        return this.state.getValue() === ActionState.Active;
    }

    /**
     * Returns boolean defining whether action has state `ActionState.Inactive`
     */
    isInactive(): boolean {
        return this.state.getValue() === ActionState.Inactive;
    }

    /**
     * Returns boolean defining whether action has state `ActionState.Destroyed`
     */
    isDestroyed(): boolean {
        return this.state.getValue() === ActionState.Destroyed;
    }

    /**
     * Will set the new title and notify all title subscriptions
     *
     * @param title The new action title
     */
    setTitle(title: string): this {
        this.title.next(title);
        return this;
    }

    /**
     * Returns current action title
     */
    getTitle(): string {
        return this.title.getValue();
    }

    /**
     * Will set the new icon and notify all icon subscriptions
     *
     * @param icon The new action icon
     */
    setIcon(icon: string): this {
        this.icon.next(icon);
        return this;
    }

    /**
     * Returns current action icon
     */
    getIcon(): string {
        return this.icon.getValue();
    }

    /**
     * Will show the action, **if previously hidden**
     */
    show(): this {
        this.visible.next(true);
        return this;
    }

    /**
     * Will nide the action, **if previously visible**
     */
    hide(): this {
        this.visible.next(false);
        return this;
    }

    /**
     * Will show or hide the action depending from the provided visibility boolean
     *
     * @param visibility The new visibility
     */
    setVisibility(visibility: boolean): this {
        this.visible.next(visibility);
        return this;
    }

    /**
     * Returns boolean defining whether action is visible
     */
    isVisible(): boolean {
        return this.visible.getValue();
    }

    /**
     * Returns boolean defining whether action is hidden
     */
    isHidden(): boolean {
        return !this.visible.getValue();
    }

    /**
     * Will enable action, **if prevously disabled**
     */
    enable(): this {
        this.disabled.next(false);
        return this;
    }

    /**
     * Will disable action, **if prevously enabled**
     */
    disable(): this {
        this.disabled.next(true);
        return this;
    }

    /**
     * Returns boolean defining whether action is disabled
     */
    isDisabled(): boolean {
        return this.disabled.getValue();
    }

    /**
     * Returns boolean defining whether action is enabled
     */
    isEnabled(): boolean {
        return !this.disabled.getValue();
    }

    /**
     * Returns a `Component`, that is provided as forced component via action `constructor`  
     * This component should be used by `ActionOutletDirective`, to represent  
     * the action in DOM, instead the component, provided via Angular `Injector`  
     */
    getForcedComponent(): Type<ActionAbstractComponentImpl> {
        return this.forcedComponent;
    }

    /**
     * Returns current parent of the action
     */
    getParent(): ActionGroup {
        return this.parent;
    }

    /**
     * @internal
     *
     * **Internal** method to set parent of current action. It will:  
     * - **Set** parent, but only if currently not defined  
     * - **Disable** current action if parent is disabled  
     * - **Activate** current action if parent is active  
     */
    _setParent(parent: ActionGroup): this {
        if (this.parent === undefined) {
            this.parent = parent;
            if (this.parent.isDisabled()) {
                this.disable();
            }
            if (this.parent.isActive()) {
                this.activate();
            }
        }

        return this;
    }

    /**
     * @internal
     *
     * **Internal** method to unset parent of current action. It will:  
     * - **Set** parent to undefined  
     * - **Enable** current action  
     * - **Deactivate** current action  
     */
    _unsetParent(): this {
        this.parent = undefined;
        this.enable();
        this.deactivate();
        return this;
    }
}
