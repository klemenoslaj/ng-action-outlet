import { AnyAction } from '../action-outlet.model';

/**
 * **Abstract** interface that all derived action component implementation types should extend
 * All components will shere this interface after implementing derived component implementation types
 */
export interface ActionAbstractComponentImpl<Action extends AnyAction = AnyAction> {
    /**
     * The derived action instance, as Input in angular component
     */
    action: Action; // @Input
}

/**
 * Abstract action options, extended by all options of every derived action class
 */
export interface ActionAbstractOptions {
    /**
     * Optional **initial** action title
     */
    readonly title?: string;
    /**
     * Optional **initial** action icon
     */
    readonly icon?: string;
    /**
     * Optional **initial** action visibility state
     */
    readonly visible?: boolean;
    /**
     * Optional **initial** action disabled state
     */
    readonly disabled?: boolean;
}

/**
 * The event interface, that **every** event of child actions should extend from
 * Used as a value provided to `fire$` observable subscribers
 */
export interface ActionAbstractEvent {
    /**
     * The action instance, tha this event is comming from
     * Should be overriden by derived interface with more specific action
     */
    readonly action: AnyAction;
}
