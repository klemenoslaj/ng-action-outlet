import { TestBed } from '@angular/core/testing';

import { ActionButton } from './action-button/action-button';
import { ActionGroup } from './action-group/action-group';
import { ActionOutletFactory } from './action-outlet.service';
import { ActionToggle } from './action-toggle/action-toggle';

describe('Service: ActionOutletFactory', () => {
    let factory: ActionOutletFactory;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ActionOutletFactory,
                { provide: ActionButton, useValue: {} },
                { provide: ActionGroup, useValue: {} },
                { provide: ActionToggle, useValue: {} },
            ],
        });
    });

    beforeEach(() => {
        factory = TestBed.get(ActionOutletFactory);
    });

    it('should return instance of ActionButton', () => {
        expect(factory.createAction()).toEqual(jasmine.any(ActionButton));
    });

    it('should return instance of ActionGroup', () => {
        expect(factory.createGroup()).toEqual(jasmine.any(ActionGroup));
    });

    it('should return instance of ActionToggle', () => {
        expect(factory.createToggle()).toEqual(jasmine.any(ActionToggle));
    });
});
