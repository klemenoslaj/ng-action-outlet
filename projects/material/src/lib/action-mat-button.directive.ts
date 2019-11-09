import { Directive, Input, OnDestroy, ElementRef, Renderer2, HostBinding, Optional, Inject, ChangeDetectorRef } from '@angular/core';
import { MatMenuTrigger, MatMenuItem } from '@angular/material/menu';
import { MatButton } from '@angular/material/button';
import { ActionButton } from '@ng-action-outlet/core';
import { Subject, fromEvent, ReplaySubject } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Directive({
  selector: 'button[actionMatButton]',
})
export class ActionMatButtonDirective implements OnDestroy {
  private _action$ = new ReplaySubject<ActionButton>(1);
  private _unsubscribe$ = new Subject<void>();

  @HostBinding('type')
  readonly _type = 'button';

  @Input('actionMatButton')
  set _actionMatButton(action: ActionButton) {
    this._action$.next(action);
  }

  constructor(
    @Optional() @Inject(MatMenuTrigger)
    matMenuTrigger: MatMenuTrigger | null,
    @Optional() @Inject(MatMenuItem)
    matMenuItem: MatMenuItem | null,
    @Optional() @Inject(MatButton)
    matButton: MatButton | null,
    elementRef: ElementRef<HTMLButtonElement>,
    renderer: Renderer2,
    cdRef: ChangeDetectorRef,
  ) {
    this._action$.pipe(
      switchMap(action => action.disabled$),
      takeUntil(this._unsubscribe$),
    ).subscribe(disabled => {
      // Either MatButton, either MatMenuItem should always be present.
      // tslint:disable-next-line: no-non-null-assertion
      (matButton || matMenuItem)!.disabled = disabled;
      cdRef.markForCheck();
    });

    if (!matMenuItem) {
      this._action$.pipe(
        switchMap(action => action.title$),
        takeUntil(this._unsubscribe$),
      ).subscribe(title => {
        if (title) {
          renderer.removeClass(elementRef.nativeElement, 'mat-icon-button');
          renderer.addClass(elementRef.nativeElement, 'mat-button');
        } else {
          renderer.removeClass(elementRef.nativeElement, 'mat-button');
          renderer.addClass(elementRef.nativeElement, 'mat-icon-button');
        }
      });
    }

    if (!matMenuTrigger) {
      fromEvent(elementRef.nativeElement, 'click').pipe(
        switchMap(() => this._action$),
        takeUntil(this._unsubscribe$),
      ).subscribe(action => action.trigger());
    }
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
  }
}
