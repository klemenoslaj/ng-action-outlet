import { AnyAction, ActionGroup, ActionAbstract } from '@ng-action-outlet/core';

export const trackByAction = (action: AnyAction) => action._actionId;
export const isMenuItem = (action?: AnyAction): boolean =>
  (
    action instanceof ActionAbstract &&
    (
      action instanceof ActionGroup &&
      action.isDropdown() ||
      isMenuItem(action.getParent())
    )
  );
