import { Type } from '@angular/core';
import { BehaviorSubject, Observable, NEVER, merge } from 'rxjs';
import { map } from 'rxjs/operators';

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
```typescript
const group = new ActionGroup({
   children: [
       new ActionButton({ title: 'Test' }),
       new ActionGroup({ dropdown: true }),
       new ActionToggle({ checked: true })
   ]
});
```
 *
 * **Or**
 *
```typescript
const group = actionFactory.createGroup().appendChildren([
    actionFactory.createButton().setTitle('Test'),
    actionFactory.createGroup().enableDropdown(),
    actionFactory.createToggle().check()
]);
```
 *
 * **Or**
 *
```typescript
const group = actionFactory.createGroup();
group.createButton().setTitle('Test');
group.createGroup().enableDropdown();
group.createToggle().check();
```
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
        this.dropdown = new BehaviorSubject(!!this.options.dropdown);

        this.fire$ = this.handleLivecycle(NEVER, false);
        this.children$ = this.handleLivecycle(this.children.asObservable());
        this.dropdown$ = this.handleLivecycleDistinct(this.dropdown.asObservable());

        this.changes$ = this.handleLivecycle(merge(
            this.title$.pipe(map(title => (<ActionGroupOptions>{ title }))),
            this.icon$.pipe(map(icon => (<ActionGroupOptions>{ icon }))),
            this.visible$.pipe(map(visible => (<ActionGroupOptions>{ visible }))),
            this.disabled$.pipe(map(disabled => (<ActionGroupOptions>{ disabled }))),
            this.children$.pipe(map(children => (<ActionGroupOptions>{ children }))),
            this.dropdown$.pipe(map(dropdown => (<ActionGroupOptions>{ dropdown })))
        ));
    }

    /**
     * Trigger for group action.
     * In case of `ActionGroup` **Noop**
     *
     * #### Example:
```typescript
group.trigger();
```
     *
     * @method trigger
     */
    trigger(): this {
        return this;
    }

    /**
     * Activates group action and **all** it's children
     *
     * #### Example:
```typescript
group.activate();
```
     *
     * @method activate
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
     * #### Example:
```typescript
group.deactivate();
```
     *
     * @method deactivate
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
     * #### Example:
```typescript
group.destroy();
```
     *
     * @method destroy
     */
    destroy(): this {
        this.getChildren().forEach(child => child.destroy());
        this.removeChildren();
        return super.destroy();
    }

    /**
     * Enables group action and **all** it's children
     *
     * #### Example:
```typescript
group.enable();
```
     *
     * @method enable
     */
    enable(): this {
        this.getChildren().forEach(child => child.enable());
        return super.enable();
    }

    /**
     * Disables group action and **all** it's children
     *
     * #### Example:
```typescript
group.disable();
```
     *
     * @method disable
     */
    disable(): this {
        this.getChildren().forEach(child => child.disable());
        return super.disable();
    }

    /**
     * Creates a new `ActionButton` and **appends** it to the children stack
     *
     * #### Example:
 ```typescript
 const childButton = group.createButton({ title: 'Test' });
 ```
     *
     * @method createButton
     * @param options Options for `ActionButton`
     * @param component Optional `Component`
     */
    createButton(options?: ActionButtonOptions, component?: Type<ActionButtonComponentImpl>): ActionButton {
        const action = new ActionButton(options, component);
        this.appendChild(action);
        return action;
    }

    /**
     * Creates a new `ActionGroup` and **appends** it to the children stack
     *
     * #### Example:
```typescript
const childGroup = group.createGroup({ dropdown: true });
```
     *
     * @method createGroup
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
     * #### Example:
```typescript
const childToggle = group.createToggle({ checked: true });
```
     *
     * @method createToggle
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
     * #### Example:
```typescript
const child = actionFactory.createButton({ title: 'Test' });
group.appendChild(child);
```
     *
     * @method appendChild
     * @param action Action to append
     */
    appendChild(action: AnyAction): this {
        const children = this.getChildren();
        this.setChildrenInternal([...children, action._setParent(this)]);
        return this;
    }

    /**
     * Adds provided actions **at the end** of children stach
     *
     * #### Example:
```typescript
const child1 = actionFactory.createButton({ title: 'Test 1' });
const child2 = actionFactory.createButton({ title: 'Test 2' });
group.appendChildren([ child1, child2 ]);
```
     *
     * @method appendChildren
     * @param actions Actions to append
     *
     */
    appendChildren(actions: AnyAction[]): this {
        const children = this.getChildren();
        this.setChildrenInternal([...children, ...actions.map(action => action._setParent(this))]);
        return this;
    }

    /**
     * Adds provided action **at the beginning** of children stack
     *
     * #### Example:
```typescript
const child = actionFactory.createButton({ title: 'Test' });
group.prependChild(child);
```
     *
     * @method prependChild
     * @param action Action to prepend
     */
    prependChild(action: AnyAction): this {
        const children = this.getChildren();
        this.setChildrenInternal([action._setParent(this), ...children]);
        return this;
    }

    /**
     * Adds provided actions **at the beginning** of children stack
     *
     * #### Example:
```typescript
const child1 = actionFactory.createButton({ title: 'Test 1' });
const child2 = actionFactory.createButton({ title: 'Test 2' });
group.prependChildren([ child1, child2 ]);
```
     *
     * @method prependChildren
     * @param actions Actions to prepend
     */
    prependChildren(actions: AnyAction[]): this {
        const children = this.getChildren();
        this.setChildrenInternal([...actions.map(action => action._setParent(this)), ...children]);
        return this;
    }

    /**
     * Removes provided child action from group
     *
     * #### Example:
```typescript
group.removeChild(child);
```
     *
     * @method removeChild
     * @param action Child action to be removed
     */
    removeChild(action: AnyAction): this {
        const index = this.getChildren().indexOf(action);
        return this.removeChildByIndex(index);
    }

    /**
     * Removes child action from group at given index
     *
     * #### Example:
```typescript
group.removeChildByIndex(0);
```
     *
     * @method removeChildByIndex
     * @param index Index of child action
     */
    removeChildByIndex(index: number): this {
        const children = this.getChildren();
        const action = children[index];

        if (action) {
            action._unsetParent();
            this.setChildrenInternal(children.filter((_child, childIndex) => index !== childIndex));
        }

        return this;
    }

    /**
     * Removes **all** children from group
     *
     * #### Example:
```typescript
group.removeChildren();
```
     *
     * @method removeChildren
     */
    removeChildren(): this {
        this.getChildren().forEach(child => child._unsetParent());
        this.setChildrenInternal([]);
        return this;
    }

    /**
     * Provided actions will **replace** existing children and will:
     * - **Apply** as **unique** array
     * - **Ignore** actions with different parent
     *
     * #### Example:
```typescript
const child1 = actionFactory.createButton({ title: 'Test 1' });
const child2 = actionFactory.createButton({ title: 'Test 2' });
group.setChildren([ child1, child2 ]);
```
     *
     * @method setChildren
     * @param children Actions to become children
     */
    setChildren(children: AnyAction[]): this {
        this.children.getValue().map(child => child._unsetParent());
        this.children.next(
            this.normalizeChildren(children)
                .map(child => child._setParent(this))
        );

        return this;
    }

    /**
     * Returns the current children
     *
     * #### Example:
```typescript
const children = group.getChildren();
```
     *
     * @method getChildren
     */
    getChildren(): AnyAction[] {
        return [...this.children.getValue()];
    }

    /**
     * Returns child action at given index
     *
     * #### Example:
```typescript
const child = group.getChild(0);
```
     *
     * @method getChild
     * @param index Index of child action
     */
    getChild(index: number): AnyAction | undefined {
        const children = this.getChildren();

        if (index >= 0) {
            return children[index];
        }

        return children[children.length - (-index)];
    }

    /**
     * Returns boolean defining whether group is dropdown or not
     *
     * #### Example:
```typescript
const isDropdown = group.isDropdown();
```
     *
     * @method isDropdown
     */
    isDropdown(): boolean {
        return this.dropdown.getValue();
    }

    /**
     * Transforms the group to dropdown
     *
     * #### Example:
```typescript
group.enableDropdown();
```
     *
     * @method enableDropdown
     */
    enableDropdown(): this {
        this.dropdown.next(true);
        return this;
    }

    /**
     * Transforms dropdown to group
     *
     * #### Example:
```typescript
group.disableDropdown();
```
     *
     * @method disableDropdown
     */
    disableDropdown(): this {
        this.dropdown.next(false);
        return this;
    }

    /**
     * Normalizes the provided array of children by filtering out actions
     * that already belong to certain parent group.
     *
     * @method normalizeChildren
     */
    private normalizeChildren(children: AnyAction[]) {
        return unique(children)
            .filter(child => {
                const parent = child.getParent();
                return parent === this || parent === undefined;
            });
    }

    /**
     * Does the same thing as `setChildren` but ignores `_setParent` call,
     * because parent is expceted to be correct already
     *
     * @method setChildrenInternal
     */
    private setChildrenInternal(children: AnyAction[]): this {
        this.children.next(this.normalizeChildren(children));

        return this;
    }
}
