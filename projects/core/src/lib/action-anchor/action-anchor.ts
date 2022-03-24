import { Type } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable, merge, EMPTY, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ActionAbstract } from '../action-abstract/action-abstract';
import { ActionAnchorComponentImpl, ActionAnchorOptions, AnchorTarget } from './action-anchor.model';

/**
 * Default options for `ActionAnchor`
 * Extended by provided options in action `constructor`
 */
const defaultButtonOptions = <ActionAnchorOptions>{};

/**
 * `ActionAnchor` used to create basic link
 *
 * ## Example
 *
 *
 *
```typescript
const button = new ActionAnchor({ title: 'Test', link: 'https://...' });
```
 *
 * **Or**
 *
 *
```typescript
const button = actionFactory.createButton({ title: 'Test', link: 'https://...' });
```
 *
 * **Or**
 *
```typescript
const button = actionFactory.createButton().setTitle('Test');
```
 */
export class ActionAnchor extends ActionAbstract<ActionAnchorOptions, null> {
  /**
   * `EMPTY Observable` as link is handled by the browser
   */
  readonly fire$ = EMPTY;
  /**
   * `Observable` notifies subscriptions on following changes:
   * *title, icon, visibility, disabled*
   */
  readonly changes$: Observable<ActionAnchorOptions>;

  /**
   * `Observable` notifying subscribers of the change to the href
   */
  readonly href$: Observable<string | null>;
  /**
   * `Observable` notifying subscribers of the change to the routerLink
   */
  readonly routerLink$: Observable<UrlTree | string | readonly string[] | null>;
  /**
   * `Observable` notifying subscribers of the change to the target
   */
  readonly target$: Observable<AnchorTarget | null>;

  /**
   * Subject storing the link/href
   */
  protected href: BehaviorSubject<string | null>;
  /**
   * Subject storing the routerLink
   */
  protected routerLink: BehaviorSubject<UrlTree | string | readonly string[] | null>;
  /**
   * Subject storing the target
   */
  protected target: BehaviorSubject<AnchorTarget | null>;

  /**
   * Public `constructor` used to instantiate `ActionAnchor`
   *
   * @param options Options for `ActionAnchor`
   * @param component Optional custom `Component`
   */
  constructor(options: ActionAnchorOptions = defaultButtonOptions, component?: Type<ActionAnchorComponentImpl>) {
    super({ ...defaultButtonOptions, ...options }, component);

    this.href = new BehaviorSubject('href' in options ? options.href : null);
    this.routerLink = new BehaviorSubject('routerLink' in options ? options.routerLink : null);
    this.target = new BehaviorSubject(options.target ?? null);

    this.href$ = this.handleLivecycleDistinct(this.href.asObservable(), false);
    this.routerLink$ = this.handleLivecycleDistinct(this.routerLink.asObservable(), false);
    this.target$ = this.handleLivecycleDistinct(this.target.asObservable(), false);
    this.changes$ = this.handleLivecycle(
      merge(
        this.title$.pipe(map(title => <ActionAnchorOptions>{ title })),
        this.icon$.pipe(map(icon => <ActionAnchorOptions>{ icon })),
        this.visible$.pipe(map(visible => <ActionAnchorOptions>{ visible })),
        this.disabled$.pipe(map(disabled => <ActionAnchorOptions>{ disabled })),
        this.href$.pipe(map(href => <ActionAnchorOptions>{ href })),
        this.routerLink$.pipe(map(routerLink => <ActionAnchorOptions>{ routerLink })),
        this.target$.pipe(map(target => <ActionAnchorOptions>{ target })),
      ),
    );
  }

  /**
   * Noop: cannot manually trigger the anchor
   */
  trigger(): this {
    return this;
  }

  /**
   * Set the url for the anchor element
   */
  setHref(href: string | null) {
    this.href.next(href);
    this.routerLink.next(null);
    return this;
  }

  /**
   * Set the routerLink binding for router link directive
   */
  setRouterLink(routerLink: UrlTree | string | readonly string[] | null) {
    this.routerLink.next(routerLink);
    this.href.next(null);
    return this;
  }

  /**
   * Set the target for the anchor element
   */
  setTarget(target: AnchorTarget) {
    this.target.next(target);
    return this;
  }

  /**
   * Noop: cannot disable the anchor
   */
  disable() {
    // HTML Anchors cannot be disabled
    return this;
  }

  /**
   * Noop: cannot disable the anchor
   */
  enable() {
    // HTML Anchors cannot be disabled
    return this;
  }

  /**
   * Determines if the link is external
   */
  isExternalLink() {
    return this.href.getValue() !== null;
  }
}
