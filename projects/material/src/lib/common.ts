import { AnyAction, ActionGroup, ActionAbstract } from '@ng-action-outlet/core';

export type TrackByAction = (action: AnyAction) => number;
export type IsMenuItem = (action?: AnyAction) => boolean;

export const trackByAction: TrackByAction = (action: AnyAction) => action._actionId;
export const isMenuItem: IsMenuItem = (action?: AnyAction): boolean =>
  action instanceof ActionAbstract &&
  ((action instanceof ActionGroup && action.isDropdown()) || isMenuItem(action.getParent()));
