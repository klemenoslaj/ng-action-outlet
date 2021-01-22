import { UrlTree } from '@angular/router';
import { ActionAbstractComponentImpl,  ActionAbstractOptions } from '../action-abstract/action-abstract.model';
import { ActionAnchor } from './action-anchor';

/**
 * Type that components used by `ActionAnchor` should implement
 */
export type ActionAnchorComponentImpl = ActionAbstractComponentImpl<ActionAnchor>;

/**
 * _self: the current browsing context. (Default)
 * _blank: usually a new tab, but users can configure browsers to open a new window instead.
 * _parent: the parent browsing context of the current one. If no parent, behaves as _self.
 * _top: the topmost browsing context (the "highest" context that’s an ancestor of the current one). If no ancestors, behaves as _self.
 */
export type AnchorTarget = '_self' | '_blank' | '_parent' | '_top';

/**
 * `ActionAnchor` specific options, extending abstract options with it's specific properties
 */
export interface ActionAnchorOptions extends ActionAbstractOptions {
    readonly href?: UrlTree | string | string[];
    readonly target?: AnchorTarget;
}
