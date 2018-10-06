![Travis build](https://img.shields.io/travis/klemenoslaj/ng-action-outlet/master.svg)
![Coveralls github](https://img.shields.io/coveralls/klemenoslaj/ng-action-outlet/master.svg)
![David](https://img.shields.io/david/klemenoslaj/ng-action-outlet/master.svg)
![GitHub tag](https://img.shields.io/github/tag/klemenoslaj/ng-action-outlet.svg)
![License](https://img.shields.io/npm/l/@ng-action-outlet/core.svg)

# [NgActionOutlet](https://klemenoslaj.github.io/ng-action-outlet/)

The goal of `ActionOutlet` is to provide an easy API to build dynamic actions on runtime  
and have the possibility to get notified for each and every change, that happens to any particular action.  
*e.g. Title change, icon change, disabled state, etc.*

## Getting started

### Step 1: Install `ng-action-outlet`
You can use either **npm** or **yarn** command-line tool.  
Choose the tool that is appropriate for your project.

#### NPM
`npm install @ng-action-outlet/core`

#### YARN
`yarn add @ng-action-outlet/core`

### Step 2: Import `ActionOutletModule`
Import Action Outlet **NgModule** to your Angular module
```typescript
import { ActionOutletModule } from '@ng-action-outlet/core';

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
so that action outlet can associate component to provided action.
```typescript
import { ActionOutletModule, ActionButton, ActionGroup, ActionToggle } from '@ng-action-outlet/core';

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
but only for actions that you actually wish to change.
```typescript
import { ActionToggle } from '@ng-action-outlet/core';

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
Create actions in a component class so that they can be accessed from the template.
```typescript
import { ActionOutletFactory } from '@ng-action-outlet/core';

@Component(...)
export class ExampleComponent implements OnInit {
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

* [ActionButton](https://klemenoslaj.github.io/ng-action-outlet/classes/ActionButton.html)
* [ActionGroup](https://klemenoslaj.github.io/ng-action-outlet/classes/ActionGroup.html)
* [ActionToggle](https://klemenoslaj.github.io/ng-action-outlet/classes/ActionToggle.html)

In order to create custom action class, refer to [ActionAbstract](./classes/ActionAbstract.html) class.
