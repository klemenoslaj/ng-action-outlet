import { Injectable, Type } from '@angular/core';

import { ActionButton } from './action-button/action-button';
import { ActionButtonComponentImpl, ActionButtonOptions } from './action-button/action-button.model';
import { ActionGroup } from './action-group/action-group';
import { ActionGroupComponentImpl, ActionGroupOptions } from './action-group/action-group.model';
import { ActionOutlet } from './action-outlet.model';
import { ActionToggle } from './action-toggle/action-toggle';
import { ActionToggleComponentImpl, ActionToggleOptions } from './action-toggle/action-toggle.model';

/**
 * ActionOutletFactory is a service providing functional way to create the actions.<br>
 * In order to keep the code clean, use only one approach.
 *
 * ## Example
 *
 * **Instead of**
 * ```typescript
 * const buttonAction = new ActionButton({
 *    title: 'Action Title',
 *    icon: 'icon',
 *    callback: callbackMethod
 * });
 * ```
 *
 * **Can do**
 * ```typescript
 * const buttonAction = this.actionOutletFactory.createButton()
 *    .setTitle('Action Title')
 *    .setIcon('icon')
 *    .fire$.subscribe(callbackMethod);
 * ```
 */

@Injectable()
export class ActionOutletFactory implements ActionOutlet {
    /**
     * Will create and return a new instance of `ActionButton` with default options and component
     * @param options Override the default options for `ActionButton`
     * @param component Override the default component for `ActionButton`
     */
    createButton(options?: ActionButtonOptions, component?: Type<ActionButtonComponentImpl>): ActionButton {
        return new ActionButton(options, component);
    }

    /**
     * Will create and return a new instance of `ActionGroup` with default options and component
     * @param options Override the default options for `ActionGroup`
     * @param component Override the default component for `ActionGroup`
     */
    createGroup(options?: ActionGroupOptions, component?: Type<ActionGroupComponentImpl>): ActionGroup {
        return new ActionGroup(options, component);
    }

    /**
     * Will create and return a new instance of `ActionToggle` with default options and component
     * @param options Override the default options for `ActionToggle`
     * @param component Override the default component for `ActionToggle`
     */
    createToggle(options?: ActionToggleOptions, component?: Type<ActionToggleComponentImpl>): ActionToggle {
        return new ActionToggle(options, component);
    }
}
