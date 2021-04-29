import { UrlTree } from '@angular/router';
import { TestScheduler } from 'rxjs/testing';

import { ActionAnchor } from './action-anchor';

interface TestContext {
  action: ActionAnchor;
  testScheduler: TestScheduler;
}

describe('Class: ActionAnchor', function (): void {
  beforeEach(function (this: TestContext): void {
    this.action = new ActionAnchor().activate();
    this.testScheduler = new TestScheduler((actual, e) => <any>expect(actual).toEqual(e));
  });

  it('should have public methods', function (this: TestContext): void {
    expect(this.action.trigger).toEqual(jasmine.any(Function));
    expect(this.action.setHref).toEqual(jasmine.any(Function));
    expect(this.action.setTarget).toEqual(jasmine.any(Function));
    expect(this.action.isExternalLink).toEqual(jasmine.any(Function));
  });

  it('should use provided href and target', function (this: TestContext): void {
    this.action = new ActionAnchor({ href: '/home', target: '_self' });
    this.action.href$.subscribe(href => expect(href).toBe('/home'));
    this.action.target$.subscribe(target => expect(target).toBe('_self'));
  });

  it('should properly differentiate external url and router links', function (this: TestContext): void {
    this.action.setRouterLink('/home');
    expect(this.action.isExternalLink()).toBeFalse();

    this.action.setRouterLink('home');
    expect(this.action.isExternalLink()).toBeFalse();

    this.action.setRouterLink(['user', '11111', 'overview']);
    expect(this.action.isExternalLink()).toBeFalse();

    this.action.setRouterLink(new UrlTree());
    expect(this.action.isExternalLink()).toBeFalse();

    this.action.setHref('www.external.com');
    expect(this.action.isExternalLink()).toBeTrue();

    this.action.setHref('http://www.external.com');
    expect(this.action.isExternalLink()).toBeTrue();
  });

  it('should notify every change with changes$', function (this: TestContext): void {
    const marble = '(tivdhrg)';
    const values = {
      t: { title: 'Test Title' },
      i: { icon: 'test-icon' },
      v: { visible: true },
      d: { disabled: false },
      r: { routerLink: null },
      h: { href: '/home' },
      g: { target: '_blank' },
    };

    this.action.setTitle('Test Title');
    this.action.setIcon('test-icon');
    this.action.show();
    this.action.trigger();
    this.action.enable();
    this.action.disable(); // Won't disable link
    this.action.setHref('/home');
    this.action.setTarget('_blank');

    this.testScheduler.expectObservable(this.action.changes$).toBe(marble, values);
    this.testScheduler.flush();
  });
});
