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
const defaultButtonOptions: ActionAnchorOptions = { };

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

    readonly href$: Observable<UrlTree | string | string[] | null>;
    readonly target$: Observable<AnchorTarget | null>;

    protected href: BehaviorSubject<UrlTree | string | string[] | null>;
    protected target: BehaviorSubject<AnchorTarget | null>;

    /**
     * Public `constructor` used to instantiate `ActionAnchor`
     *
     * @param options Options for `ActionAnchor`
     * @param component Optional custom `Component`
     */
    constructor(options: ActionAnchorOptions = defaultButtonOptions,
                component?: Type<ActionAnchorComponentImpl>) {
        super({ ...defaultButtonOptions, ...options }, component);

        this.href = new BehaviorSubject(options.href ?? null);
        this.target = new BehaviorSubject(options.target ?? null);

        this.href$ = this.handleLivecycleDistinct(this.href.asObservable(), false);
        this.target$ = this.handleLivecycleDistinct(this.target.asObservable(), false);
        this.changes$ = this.handleLivecycle(merge(
            this.title$.pipe(map(title => (<ActionAnchorOptions>{ title }))),
            this.icon$.pipe(map(icon => (<ActionAnchorOptions>{ icon }))),
            this.visible$.pipe(map(visible => (<ActionAnchorOptions>{ visible }))),
            this.disabled$.pipe(map(disabled => (<ActionAnchorOptions>{ disabled }))),
            this.href$.pipe(map(href => (<ActionAnchorOptions>{ link: href }))),
            this.target$.pipe(map(target => (<ActionAnchorOptions>{ target }))),
        ));
    }

    trigger(): this {
        return this;
    }

    setHref(link: UrlTree | string | string[] | null) {
        this.href.next(link);
        return this;
    }

    setTarget(target: AnchorTarget) {
        this.target.next(target);
        return this;
    }

    disable() {
        // HTML Anchors cannot be disabled
        return this;
    }

    enable() {
        // HTML Anchors cannot be disabled
        return this;
    }

    isExternalLink() {
        const link = this.href.getValue();
        return typeof link === 'string' && (link.startsWith('http') || link.startsWith('www'));
    }
}
