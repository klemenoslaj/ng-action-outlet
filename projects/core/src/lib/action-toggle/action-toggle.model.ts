import {
  ActionAbstractComponentImpl,
  ActionAbstractEvent,
  ActionAbstractOptions,
} from '../action-abstract/action-abstract.model';
import { ActionToggle } from './action-toggle';

/**
 * Type that components used by `ActionToggle` should implement
 */
export type ActionToggleComponentImpl = ActionAbstractComponentImpl<ActionToggle>;

/**
 * Subscription next callback for `ActionToggle` `fire$`
 */
export type ActionToggleCallback = (event: ActionToggleEvent) => void;

/**
 * `ActionToggle` specific options, extending abstract options with it's specific properties
 */
export interface ActionToggleOptions extends ActionAbstractOptions {
  /**
   * Optional callback, that will be registered as first subscriber to `fire$` observable
   */
  readonly callback?: ActionToggleCallback;
  /**
   * Optional **initial** checked state
   */
  readonly checked?: boolean;
}

/**
 * The event interface, that subscribers of `ActionToggle` `fire$` oservable will receive
 */
export interface ActionToggleEvent extends ActionAbstractEvent {
  /**
   * The `ActionToggle` instance, that this event is coming from
   */
  readonly action: ActionToggle;
  /**
   * New checked state of the action
   */
  readonly checked: boolean;
}
