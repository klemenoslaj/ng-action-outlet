import { ActionAbstractComponentImpl, ActionAbstractEvent, ActionAbstractOptions } from '../action-abstract/action-abstract.model';
import { AnyAction } from '../action-outlet.model';
import { ActionGroup } from './action-group';

/**
 * Type that components used by `ActionGroup` should implement
 */
export type ActionGroupComponentImpl = ActionAbstractComponentImpl<ActionGroup>;

/**
 * `ActionGroup` specific options, extending abstract options with it's specific properties
 */
export interface ActionGroupOptions extends ActionAbstractOptions {
    /**
     * The array, containing **children** actions
     */
    readonly children: ReadonlyArray<AnyAction>;
    /**
     * Optional boolean defining whether group is **initially** created as dropdown
     */
    readonly dropdown?: boolean;
}

/**
 * The event interface, that subscribers of `ActionGroup` `fire$` oservable will receive
 */
export interface ActionGroupEvent extends ActionAbstractEvent {
    /**
     * The `ActionGroup` instance, that this event is coming from
     */
    readonly action: ActionGroup;
}
