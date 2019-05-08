import { AnyAction, ActionGroup, ActionAbstract } from '@ng-action-outlet/core';

export function isMenuItem(action?: AnyAction): boolean {
    return action instanceof ActionAbstract && (action instanceof ActionGroup && action.isDropdown() || isMenuItem(action.getParent()));
}
