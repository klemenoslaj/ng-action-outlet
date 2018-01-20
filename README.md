# NgActionOutlet

The goal of `ActionOutlet` is to provide an easy API to build dynamic actions on runtime,  
and have the possibility to get notified for each and every change,  
that happens to any particular action.  
*e.g. Title change, icon change, disabled state, etc.*

## Getting started

### Step 1: Install `ng-action-outlet`
You can use either **npm** or **yarn** command-line tool.  
Choose the tool that is appropriate for your project.

#### NPM
`npm install ng-action-outlet`

#### YARN
`yarn add ng-action-outlet`

### Step 2: Import `ActionOutletModule`
Import and use Action Outlet **NgModule**
```typescript
import { ActionOutletModule } from 'ng-action-outlet';

@NgModule({
  ...
  imports: [ActionOutletModule],
  ...
})
export class ExampleModule { }
```

### Step 3: Define what component to use with what action
Use providers to set default components for each action to be used for rendering.  
Provide action class and use value pointing to your component class,
so that action outlet cam associate component to used action.
```typescript
import { ActionOutletModule, ActionButton, ActionGroup, ActionToggle } from 'ng-action-outlet';

import { ExampleButtonComponent } from './example-button.component';
import { ExampleGroupComponent } from './example-group.component';
import { ExampleToggleComponent } from './example-toggle.component';

@NgModule({
  ...
  imports: [ActionOutletModule],
  providers: [{
      provide: ActionButton,
      useValue: ExampleButtonComponent
  }, {
      provide: ActionGroup,
      useValue: ExampleGroupComponent
  }, {
      provide: ActionToggle,
      useValue: ExampleToggleComponent
  }]
  ...
})
export class ExampleModule { }
```

### Step 4: Override default's in your component
In order to override your default settings, do the same as initially in a module,  
but only for actions that you actoually wish to change.
```typescript
import { ActionToggle } from 'ng-action-outlet';

import { ExampleCheckboxComponent } from './example-checkbox.component';

@Component({
  ...
  providers: [{
      provide: ActionToggle,
      useValue: ExampleCheckboxComponent
  }]
  ...
})
export class ExampleComponent { }
```

### Step 5: Create action instances
Create actions in you component class so that you can access them from template.
```typescript
import { ActionOutletFactory } from 'ng-action-outlet';

@Component(...)
export ExampleComponent implements OnInit {
    ...
    group: ActionGroup;
    
    constructor(private actionOutlet: ActionOutletFactory) { }

    ngOnInit() {
        this.group = this.actionOutlet.createGroup();
        this.group.createToggle()
          .setTitle('Example title')
          .check();
    }
    ...
}
```

### Step 6: Render the actions
Bind created actions to `actionOutlet` renderer directive.
```html
<ng-container *actionOutlet="group"></ng-container>
```

## Available actions

* [ActionButton](./classes/ActionButton.html)
* [ActionGroup](./classes/ActionGroup.html)
* [ActionToggle](./classes/ActionToggle.html)

In order to create custom action class, refer to [ActionAbstract](./classes/ActionAbstract.html).
