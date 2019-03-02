import { AnyAction, ActionGroup } from '@ng-action-outlet/core';

export const isMenuItem = (action: AnyAction) => {
  return action && (action instanceof ActionGroup && action.isDropdown() || isMenuItem(action.getParent()));
};
