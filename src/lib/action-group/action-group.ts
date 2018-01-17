import { Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { ActionAbstract } from '../action-abstract/action-abstract';
import { ActionButton } from '../action-button/action-button';
import { ActionButtonComponentImpl, ActionButtonOptions } from '../action-button/action-button.model';
import { ActionOutlet, AnyAction } from '../action-outlet.model';
import { ActionToggle } from '../action-toggle/action-toggle';
import { ActionToggleComponentImpl, ActionToggleOptions } from '../action-toggle/action-toggle.model';
import { ActionGroupComponentImpl, ActionGroupEvent, ActionGroupOptions } from './action-group.model';

/**
 * Default options for `ActionGroup`  
 * Extended by provided options in action `constructor`
 */
const defaultGroupOptions: ActionGroupOptions = {
    children: [],
    dropdown: false,
};

/**
 * Will return a unique array of actions
 *
 * @param children The array of actions
 */
const unique = (children: AnyAction[]) => Array.from(
    new Set(children)
);

/**
 * `ActionGroup` used to group certain actions in one logical component  
 * Can be used either as **group** either as **dropdown**
 *
 * ## Example
 *
 * ```typescript
 * const group = new ActionGroup({
 *    children: [
 *        new ActionButton({ title: 'Test' }),
 *        new ActionGroup({ dropdown: true }),
 *        new ActionToggle({ checked: true })
 *    ]
 * });
 * ```
 *
 * **Or**
 *
 * ```typescript
 * const group = actionFactory.createGroup().appendChildren([
 *     actionFactory.createAction().setTitle('Test'),
 *     actionFactory.createGroup().enableDropdown(),
 *     actionFactory.createToggle().check()
 * ]);
 * ```
 *
 * **Or**
 *
 * ```typescript
 * const group = actionFactory.createGroup();
 * group.createAction().setTitle('Test');
 * group.createGroup().enableDropdown();
 * group.createToggle().check();
 * ```
 */
export class ActionGroup extends ActionAbstract<ActionGroupOptions, ActionGroupEvent> implements ActionOutlet {
    /**
     * `Observable` that notifies subscriptions on action triggering  
     * Empty observable in case of 'ActionGroup'
     */
    readonly fire$: Observable<ActionGroupEvent>;
    /**
     * `Observable` that notifies subscriptions on following changes:  
     * *title, icon, visibility, disabled, children, dropdown*
     */
    readonly changes$: Observable<ActionGroupOptions>;
    /**
     * `Observable` that notifies subscriptions to any change to children:  
     * *append, prepend, remove, etc.*
     */
    readonly children$: Observable<AnyAction[]>;
    /**
     * `Observable` that notifies subscriptions when `ActionGroup` is changed to dropdown or vice versa
     */
    readonly dropdown$: Observable<boolean>;

    /**
     * `BehaviorSubject`, holding **all** children of `ActionGroup` instance
     */
    protected readonly children: BehaviorSubject<AnyAction[]>;
    /**
     * `BehaviorSubject`, holding boolean to define whether `ActionGroup` instance is dropdown
     */
    protected readonly dropdown: BehaviorSubject<boolean>;

    /**
     * Public `constructor` used to instantiate `ActionGroup`
     *
     * @param options Options for `ActionGroup`
     * @param component Optional custom `Component`
     */
    constructor(options: ActionGroupOptions = defaultGroupOptions,
                component?: Type<ActionGroupComponentImpl>) {
        super({ ...defaultGroupOptions, ...options }, component);

        this.children = new BehaviorSubject(unique(this.options.children.map(action => action._setParent(this))));
        this.dropdown = new BehaviorSubject(this.options.dropdown);

        this.fire$ = this.handleLivecycle(Observable.never(), false);
        this.children$ = this.handleLivecycle(this.children.asObservable());
        this.dropdown$ = this.handleLivecycleDistinct(this.dropdown.asObservable());

        this.changes$ = this.handleLivecycle(Observable.merge(
            this.title$.map(title => (<ActionGroupOptions>{ title })),
            this.icon$.map(icon => (<ActionGroupOptions>{ icon })),
            this.visible$.map(visible => (<ActionGroupOptions>{ visible })),
            this.disabled$.map(disabled => (<ActionGroupOptions>{ disabled })),
            this.children$.map(children => (<ActionGroupOptions>{ children })),
            this.dropdown$.map(dropdown => (<ActionGroupOptions>{ dropdown }))
        ));
    }

    /**
     * Trigger for group action.
     * In case of `ActionGroup` **Noop**
     *
     * @example
     * group.trigger();
     */
    trigger(): this {
        return this;
    }

    /**
     * Activates group action and **all** it's children
     *
     * @example
     * group.activate();
     */
    activate(): this {
        if (this.isDestroyed()) {
            return this;
        }

        this.getChildren().forEach(child => child.activate());
        return super.activate();
    }

    /**
     * Deactivates group action and **all** it's children
     *
     * @example
     * group.deactivate();
     */
    deactivate(): this {
        if (this.isDestroyed()) {
            return this;
        }

        this.getChildren().forEach(child => child.deactivate());
        return super.deactivate();
    }

    /**
     * Destroys group action, **destroys** and **removes** **all** it's children
     *
     * @example
     * group.destroy();
     */
    destroy(): this {
        this.getChildren().forEach(child => child.destroy());
        this.removeChildren();
        return super.destroy();
    }

    /**
     * Enables group action and **all** it's children
     *
     * @example
     * group.enable();
     */
    enable(): this {
        this.getChildren().forEach(child => child.enable());
        return super.enable();
    }

    /**
     * Disables group action and **all** it's children
     *
     * @example
     * group.disable();
     */
    disable(): this {
        this.getChildren().forEach(child => child.disable());
        return super.disable();
    }

    /**
     * Creates a new `ActionButton` and **appends** it to the children stack
     *
     * @example
     * const childButton = group.createAction({ title: 'Test' });
     *
     * @param options Options for `ActionButton`
     * @param component Optional `Component`
     */
    createAction(options?: ActionButtonOptions, component?: Type<ActionButtonComponentImpl>): ActionButton {
        const action = new ActionButton(options, component);
        this.appendChild(action);
        return action;
    }

    /**
     * Creates a new `ActionGroup` and **appends** it to the children stack
     *
     * @example
     * const childGroup = group.createGroup({ dropdown: true });
     *
     * @param options Options for `ActionGroup`
     * @param component Optional `Component`
     */
    createGroup(options?: ActionGroupOptions, component?: Type<ActionGroupComponentImpl>): ActionGroup {
        const group = new ActionGroup(options, component);
        this.appendChild(group);
        return group;
    }

    /**
     * Creates a new `ActionToggle` and **appends** it to the children stack
     *
     * @example
     * const childToggle = group.createToggle({ checked: true });
     *
     * @param options Options for `ActionToggle`
     * @param component Optional `Component`
     */
    createToggle(options?: ActionToggleOptions, component?: Type<ActionToggleComponentImpl>): ActionToggle {
        const toggle = new ActionToggle(options, component);
        this.appendChild(toggle);
        return toggle;
    }

    /**
     * Adds provided action **at the end** of children stach
     *
     * @example
     * const child = actionFactory.createAction({ title: 'Test' });
     * group.appendChild(child);
     *
     * @param action Action to append
     */
    appendChild(action: AnyAction): this {
        const children = this.getChildren();
        this.setChildren([...children, action._setParent(this)]);
        return this;
    }

    /**
     * Adds provided actions **at the end** of children stach
     *
     * @example
     * const child1 = actionFactory.createAction({ title: 'Test 1' });
     * const child2 = actionFactory.createAction({ title: 'Test 2' });
     * group.appendChildren([ child1, child2 ]);
     *
     * @param actions Actions to append
     *
     */
    appendChildren(actions: AnyAction[]): this {
        const children = this.getChildren();
        this.setChildren([...children, ...actions.map(action => action._setParent(this))]);
        return this;
    }

    /**
     * Adds provided action **at the beginning** of children stack
     *
     * @example
     * const child = actionFactory.createAction({ title: 'Test' });
     * group.prependChild(child);
     *
     * @param action Action to prepend
     */
    prependChild(action: AnyAction): this {
        const children = this.getChildren();
        this.setChildren([action._setParent(this), ...children]);
        return this;
    }

    /**
     * Adds provided actions **at the beginning** of children stack
     *
     * @example
     * const child1 = actionFactory.createAction({ title: 'Test 1' });
     * const child2 = actionFactory.createAction({ title: 'Test 2' });
     * group.prependChildren([ child1, child2 ]);
     *
     * @param actions Actions to prepend
     */
    prependChildren(actions: AnyAction[]): this {
        const children = this.getChildren();
        this.setChildren([...actions.map(action => action._setParent(this)), ...children]);
        return this;
    }

    /**
     * Removes provided child action from group
     *
     * @example
     * group.removeChild(child);
     *
     * @param action Child action to be removed
     */
    removeChild(action: AnyAction): this {
        const index = this.getChildren().indexOf(action);
        return this.removeChildByIndex(index);
    }

    /**
     * Removes child action from group at given index
     *
     * @example
     * group.removeChildByIndex(0);
     *
     * @param index Index of child action
     */
    removeChildByIndex(index: number): this {
        const children = this.getChildren();
        const action = children[index];

        if (action) {
            action._unsetParent();
            this.setChildren(children.filter((_child, childIndex) => index !== childIndex));
        }

        return this;
    }

    /**
     * Removes **all** children from group
     *
     * @example
     * group.removeChildren();
     */
    removeChildren(): this {
        this.getChildren().forEach(child => child._unsetParent());
        this.setChildren([]);
        return this;
    }

    /**
     * Provided actions will **replace** existing children and will:  
     * - **Apply** as **unique** array  
     * - **Ignore** actions with different parent
     *
     * @example
     * const child1 = actionFactory.createAction({ title: 'Test 1' });
     * const child2 = actionFactory.createAction({ title: 'Test 2' });
     * group.setChildren([ child1, child2 ]);
     *
     * @param children Actions to become children
     */
    setChildren(children: AnyAction[]): this {
        this.children.next(unique(children).filter(child => {
            const parent = child.getParent();
            return parent === this || parent === undefined;
        }));

        return this;
    }

    /**
     * Returns the current children
     *
     * @example
     * const children = group.getChildren();
     */
    getChildren(): AnyAction[] {
        return [...this.children.getValue()];
    }

    /**
     * Returns child action at given index
     *
     * @example
     * const child = group.getChild(0);
     *
     * @param index Index of child action
     */
    getChild(index: number): AnyAction {
        const children = this.getChildren();

        if (index >= 0) {
            return children[index];
        }

        return children[children.length - (-index)];
    }

    /**
     * Returns boolean defining whether group is dropdown or not
     *
     * @example
     * const isDropdown = group.isDropdown();
     */
    isDropdown(): boolean {
        return this.dropdown.getValue();
    }

    /**
     * Transforms the group to dropdown
     *
     * @example
     * group.enableDropdown();
     */
    enableDropdown(): this {
        this.dropdown.next(true);
        return this;
    }

    /**
     * Transforms dropdown to group
     *
     * @example
     * group.disableDropdown();
     */
    disableDropdown(): this {
        this.dropdown.next(false);
        return this;
    }
}
