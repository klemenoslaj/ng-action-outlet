import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Injector,
  Input,
  OnDestroy,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { ActionAbstract } from './action-abstract/action-abstract';
import { ActionAbstractComponentImpl } from './action-abstract/action-abstract.model';
import { AnyAction } from './action-outlet.model';

/**
 * Structural directive used for rendering actions to the DOM.
 * It compiles and attaches the action components **dinamically** on the fly
 *
 * The `@Input` is always an action derived from `AbstractAction` class, e.g.:
 * - `ActionButton`: will render one button action
 * - `ActionGroup`: will render one group action and all descendant actions
 * - `ActionToggle`: will render one toggle action
 *
 * ## Example
 *
 * **TypeScript**
```typescript
 this.group = new ActionGroup({
    children: [
        new ActionButton({
            title: 'Action Title',
            icon: 'icon',
            callback: callbackMethod
         })
    ]
});
```
 *
 * **Template**
```html
<div *actionOutlet="group"></div>
```
 */

@Directive({
  selector: '[actionOutlet]',
})
export class ActionOutletDirective implements OnDestroy {
  /**
   * Action setter, providing action, to be rendered in the component's view container.
   * *e.g. `ActionButton`, `ActionGroup`, etc.*
   *
   * On set, it will:
   * - **Compile** and render a `Component` **dinamically** for provided `@Input` action
   * - **Change/Update** the `Component` accordingly to the change detection
   */
  @Input() set actionOutlet(action: AnyAction | undefined) {
    if (this.componentRef) {
      this.viewContainerRef.clear();
      this.componentRef = undefined;
    }

    if (this.action) {
      this.action.destroy();
    }

    this.action = action;

    if (this.action === undefined) {
      return;
    }

    if (this.action instanceof ActionAbstract === false) {
      throw new Error('Illegal state: "actionOutlet" should be instance of AbstractAction');
    }

    const component = this.getComponentType(this.action, this.injector);
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    this.componentRef = this.viewContainerRef.createComponent(componentFactory);
    this.componentRef.instance._action = this.action.activate();
  }

  /**
   * Getter for **internally** used action
   */
  get actionOutlet(): AnyAction | undefined {
    return this.action;
  }

  /**
   * Defines whether underlying child action instance will be destroyed automatically
   * If `false`, destruction of action should be handled **MANUALLY**
   */
  @Input() actionOutletDestroy = true;

  /**
   * `Component` reference to the component, used by rendered action
   */
  private componentRef?: ComponentRef<ActionAbstractComponentImpl>;

  /**
   * Action instance, used **internally** by the directive
   * Should **never** be directly exposed
   */
  private action?: AnyAction;

  /**
   * Invoked by Angular with dependency injection
   *
   * @param viewContainerRef Used for Component creation via `.createComponent()`
   * @param componentFactoryResolver Used to resolve component factory via `.resolveComponentFactory()`
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
  ) {}

  /**
   * Angular `ngOnDestroy` hook will:
   * - **Destroy** provided @Input action
   * - **Clear** the view container
   */
  ngOnDestroy(): void {
    if (this.actionOutletDestroy && this.action && !this.action.getParent()) {
      this.action.destroy();
    }

    this.viewContainerRef.clear();
    this.action = undefined;
    this.componentRef = undefined;
  }

  /**
   * Will return the `Component` type for provided action
   * If action **has** directly assigned `Component` type via `constructor`, then that component is **forced** and used
   * If action **does not have** directly assigned `Component` type via `constructor`, `Injector` is used to fetch proper `Component`
   *
   * @param action Action to get `Component` for
   * @param injector `Injector` from current directive instance
   */
  getComponentType(action: AnyAction, injector: Injector): Type<ActionAbstractComponentImpl> {
    return action.getForcedComponent() || <Type<ActionAbstractComponentImpl>>injector.get<any>(<any>action.constructor);
  }
}
