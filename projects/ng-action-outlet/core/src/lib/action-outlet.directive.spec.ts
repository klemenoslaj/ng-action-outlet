import { ANALYZE_FOR_ENTRY_COMPONENTS, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ActionButton } from './action-button/action-button';
import { ActionGroup } from './action-group/action-group';
import { ActionOutletDirective } from './action-outlet.directive';
import { ActionOutletFactory } from './action-outlet.service';
import { ActionToggle } from './action-toggle/action-toggle';

interface TestContext {
    fixture: ComponentFixture<TestComponent>;
    component: TestComponent;
}

@Component({
    template: `<div #el><div *actionOutlet="group; destroy: destroy"></div></div>`,
})
class TestComponent {
    @ViewChild(ActionOutletDirective) outlet: ActionOutletDirective;
    @ViewChild('el') element: ElementRef;
    @Input() group: ActionGroup;
    @Input() destroy = true;

    /**
     * Action Factory will set default components for the actions
     */
    constructor(_: ActionOutletFactory) { }
}

@Component({
    selector: 'lib-dumb',
    template: '',
})
class DumbComponent {
    action;
    hidden;
}

@Component({
    selector: 'lib-dumb',
    template: '',
})
class Dumb2Component {
    action;
    hidden;
}

describe('Directive: ActionOutletDirective', function (): void {
    beforeEach(function (this: TestContext): void {
        TestBed.configureTestingModule({
            declarations: [TestComponent, ActionOutletDirective, DumbComponent, Dumb2Component],
            providers: [
                ActionOutletFactory,
                { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: [DumbComponent, Dumb2Component], multi: true },
                { provide: ActionButton, useValue: DumbComponent },
                { provide: ActionGroup, useValue: DumbComponent },
                { provide: ActionToggle, useValue: DumbComponent },
            ],
        });

        this.fixture = TestBed.createComponent(TestComponent);
        this.component = this.fixture.componentInstance;
    });

    afterEach(function (this: TestContext): void {
        this.fixture.destroy();
    });

    it('should render one instance of child component', function (this: TestContext): void {
        this.component.group = new ActionGroup();
        this.fixture.detectChanges();

        expect(this.component.element.nativeElement.children.length).toBe(1);
        expect(this.component.element.nativeElement.children[0].tagName.toLowerCase()).toBe('app-dumb');
        expect((<any>this.component.outlet).componentRef.instance).toEqual(jasmine.any(DumbComponent));
    });

    it('should use forced component from Action if defined', function (this: TestContext): void {
        const forcedComponentGroup = new ActionGroup(null, Dumb2Component);
        const defaultComponentGroup = new ActionGroup();

        const usedDefaultComponent = this.component.outlet.getComponentType(defaultComponentGroup, (<any>this.component.outlet).injector);
        const usedForcedComponent = this.component.outlet.getComponentType(forcedComponentGroup, (<any>this.component.outlet).injector);

        expect(usedDefaultComponent).toBe(DumbComponent);
        expect(usedForcedComponent).toBe(Dumb2Component);
        expect(usedDefaultComponent).not.toBe(usedForcedComponent);
    });

    it('should accept only the instance of AbstractAction or undefined', function (this: TestContext): void {
        this.component.group = null;
        expect(() => this.fixture.detectChanges())
            .toThrow(new Error('Illegal state: "actionOutlet" should be instance of AbstractAction'));
    });

    it('should clear viewcontainer on change hook', fakeAsync(function (this: TestContext): void {
        this.component.group = new ActionGroup();
        this.fixture.detectChanges();
        tick();

        expect(this.component.element.nativeElement.children.length).toBe(1);

        this.component.group = undefined;
        this.fixture.detectChanges();
        tick();

        expect(this.component.element.nativeElement.children.length).toBe(0);
        expect((<any>this.component.outlet).componentRef).toBeUndefined();
    }));

    it('should activate the action', fakeAsync(function (this: TestContext): void {
        this.component.group = new ActionGroup();
        this.fixture.detectChanges();
        tick();

        expect(this.component.group.isActive()).toBe(true);
    }));

    it('should destroy action on ngOnDestroy', fakeAsync(function (this: TestContext): void {
        const group = new ActionGroup();

        this.component.group = group;
        this.fixture.detectChanges();
        tick();

        expect(group.isDestroyed()).toBe(false);
        expect(this.component.outlet.actionOutlet).toBeDefined();

        this.fixture.destroy();
        tick();

        expect(group.isDestroyed()).toBe(true);
        expect(this.component.outlet.actionOutlet).toBeUndefined();
    }));

    it('should not destroy the action if false flag is provided', fakeAsync(function (this: TestContext): void {
        const group = new ActionGroup();

        this.component.group = group;
        this.component.destroy = false;
        this.fixture.detectChanges();
        tick();

        expect(group.isDestroyed()).toBe(false);
        expect(this.component.outlet.actionOutlet).toBeDefined();

        this.fixture.destroy();
        tick();

        // Only the directive is destroyed, not the action
        expect(group.isDestroyed()).toBe(false);
        expect(this.component.outlet.actionOutlet).toBeUndefined();
    }));
});
