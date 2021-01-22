import { Directive, Input, OnDestroy, ElementRef, Renderer2, Optional, Inject, ChangeDetectorRef } from '@angular/core';
import { MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { ActionButton, ActionGroup, ActionAnchor } from '@ng-action-outlet/core';
import { Subject, fromEvent, ReplaySubject, EMPTY } from 'rxjs';
import { takeUntil, switchMap, filter } from 'rxjs/operators';

@Directive({
  selector: 'button[actionMatButton], a[actionMatButton]',
})
export class ActionMatButtonDirective implements OnDestroy {
  private _action$ = new ReplaySubject<ActionButton | ActionGroup | ActionAnchor>(1);
  private _unsubscribe$ = new Subject<void>();

  @Input('actionMatButton')
  set _actionMatButton(action: ActionButton | ActionGroup | ActionAnchor) {
    this._action$.next(action);
  }

  constructor(
    @Optional() @Inject(MatMenuTrigger)
    matMenuTrigger: MatMenuTrigger | null,
    @Optional() @Inject(MatMenuItem)
    matMenuItem: MatMenuItem | null,
    @Optional() @Inject(MatButton)
    matButton: MatButton | null,
    { nativeElement }: ElementRef<HTMLButtonElement>,
    renderer: Renderer2,
    cdRef: ChangeDetectorRef,
  ) {
    this._action$.pipe(
      switchMap(action => action instanceof ActionAnchor ? EMPTY : action.disabled$),
      takeUntil(this._unsubscribe$),
    ).subscribe(disabled => {
      // Either MatButton, either MatMenuItem should always be present.
      // tslint:disable-next-line: no-non-null-assertion
      (matButton ?? matMenuItem)!.disabled = disabled;
      cdRef.markForCheck();
    });

    if (nativeElement.tagName === 'BUTTON') {
      renderer.setAttribute(nativeElement, 'type', 'button');
    }

    const ariaLabel$ = this._action$.pipe(switchMap(action => action.ariaLabel$));
    ariaLabel$.pipe(
      filter((ariaLabel): ariaLabel is string => !!ariaLabel),
      takeUntil(this._unsubscribe$),
    ).subscribe(ariaLabel => renderer.setAttribute(nativeElement, 'aria-label', ariaLabel));
    ariaLabel$.pipe(
      filter((ariaLabel): ariaLabel is '' => !ariaLabel),
      takeUntil(this._unsubscribe$),
    ).subscribe(() => renderer.removeAttribute(nativeElement, 'aria-label'));

    if (!matMenuItem) {
      const title$ = this._action$.pipe(switchMap(action => action.title$));
      title$.pipe(
        filter((title): title is string => !!title),
        takeUntil(this._unsubscribe$),
      ).subscribe(() => {
        renderer.removeClass(nativeElement, 'mat-icon-button');
        renderer.addClass(nativeElement, 'mat-button');
      });
      title$.pipe(
        filter((title): title is '' => !title),
        takeUntil(this._unsubscribe$),
      ).subscribe(() => {
        renderer.removeClass(nativeElement, 'mat-button');
        renderer.addClass(nativeElement, 'mat-icon-button');
      });
    }

    if (!matMenuTrigger) {
      fromEvent(nativeElement, 'click').pipe(
        switchMap(() => this._action$),
        takeUntil(this._unsubscribe$),
      ).subscribe(action => action.trigger());
    }
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
  }
}
