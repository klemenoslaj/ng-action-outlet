import { Type } from '@angular/core';

import { ActionAbstract } from './action-abstract/action-abstract';
import { ActionAbstractEvent, ActionAbstractOptions } from './action-abstract/action-abstract.model';
import { ActionButton } from './action-button/action-button';
import { ActionButtonComponentImpl, ActionButtonOptions } from './action-button/action-button.model';
import { ActionGroup } from './action-group/action-group';
import { ActionGroupComponentImpl, ActionGroupOptions } from './action-group/action-group.model';
import { ActionToggleComponentImpl, ActionToggleOptions } from './action-toggle/action-toggle.model';
import { ActionToggle } from './action-toggle/action-toggle';

/**
 * AnyAction type is a shorter way to define the default abstract action type
 */
export type AnyAction = ActionAbstract<ActionAbstractOptions, ActionAbstractEvent>;

/**
 * ActionOutlet interface is implemented by all factory classes.
 *
 * e.g. `ActionOutletFactory` and `ActionGroup`
 */
export interface ActionOutlet {
  /**
   * When implemented should create and return a new instance of `ActionButton` with default options and component
   * @param options Should override the default options for `ActionButton`
   * @param component Should override the default component for `ActionButton`
   */
  createButton(options?: ActionButtonOptions, component?: Type<ActionButtonComponentImpl>): ActionButton;

  /**
   * When implemented should create and return a new instance of `ActionGroup` with default options and component
   * @param options Should override the default options for `ActionGroup`
   * @param component Should override the default component for `ActionGroup`
   */
  createGroup(options?: ActionGroupOptions, component?: Type<ActionGroupComponentImpl>): ActionGroup;

  /**
   * When implemented should create and return a new instance of `ActionToggle` with default options and component
   * @param options Should override the default options for `ActionToggle`
   * @param component Should override the default component for `ActionToggle`
   */
  createToggle(options?: ActionToggleOptions, component?: Type<ActionToggleComponentImpl>): ActionToggle;
}
