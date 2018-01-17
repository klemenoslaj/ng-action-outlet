import { ActionAbstractComponentImpl, ActionAbstractEvent, ActionAbstractOptions } from '../action-abstract/action-abstract.model';
import { ActionButton } from './action-button';

/**
 * Type that components used by `ActionButton` should implement
 */
export type ActionButtonComponentImpl = ActionAbstractComponentImpl<ActionButton>;

/**
 * Subscription next callback for `ActionButton` `fire$`
 */
export type ActionButtonCallback = (event: ActionButtonEvent) => void;

/**
 * `ActionButton` specific options, extending abstract options with it's specific properties
 */
export interface ActionButtonOptions extends ActionAbstractOptions {
    /**
     * Optional callback, that will be registered as first subscriber to `fire$` observable
     */
    readonly callback?: ActionButtonCallback;
}

/**
 * The event interface, that subscribers of `ActionButton` `fire$` oservable will receive
 */
export interface ActionButtonEvent extends ActionAbstractEvent {
    /**
     * The `ActionButton` instance, that this event is coming from
     */
    readonly action: ActionButton;
}
