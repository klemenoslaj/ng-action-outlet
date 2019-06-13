<p align="center">

<a href="https://app.codacy.com/app/klemenoslaj/ng-action-outlet?utm_source=github.com&utm_medium=referral&utm_content=klemenoslaj/ng-action-outlet&utm_campaign=Badge_Grade_Settings">
    <img src="https://api.codacy.com/project/badge/Grade/f495c18616434c3ca2fafe26f89a818f" /></a>
<a href="https://travis-ci.org/klemenoslaj/ng-action-outlet">
    <img src="https://img.shields.io/travis/klemenoslaj/ng-action-outlet/master.svg" /></a>
<a href="https://coveralls.io/github/klemenoslaj/ng-action-outlet?branch=master">
    <img src="https://img.shields.io/coveralls/klemenoslaj/ng-action-outlet/master.svg" /></a>
<a href="https://david-dm.org/klemenoslaj/ng-action-outlet">
    <img src="https://img.shields.io/david/klemenoslaj/ng-action-outlet.svg" /></a>

<br />

<a href="https://img.shields.io/npm/l/@ng-action-outlet/core.svg">
    <img src="https://img.shields.io/npm/l/@ng-action-outlet/core.svg" /></a>
<a href="https://github.com/klemenoslaj/ng-action-outlet/releases">
    <img src="https://img.shields.io/github/tag/klemenoslaj/ng-action-outlet.svg" /></a>
<a href="https://snyk.io/test/github/klemenoslaj/ng-action-outlet?targetFile=package.json">
    <img src="https://snyk.io/test/github/klemenoslaj/ng-action-outlet/badge.svg?targetFile=package.json" /></a>
<a href="https://klemenoslaj.github.io/ng-action-outlet/coverage.html">
    <img src="./docs/images/coverage-badge.svg" /></a>

<br />

<a href="https://angular.io/styleguide">
    <img src="https://mgechev.github.io/angular2-style-guide/images/badge.svg" /></a>

</p>

# [NgActionOutlet](https://klemenoslaj.github.io/ng-action-outlet/)

The goal of `ActionOutlet` is to provide an easy API to build dynamic menus on runtime and have the possibility to get notified for each and every change, that happens to any particular action in the menu (_e.g. Title change, icon change, disabled state, ..._).

The most natural use case is when back-end is in charge over the visibility of actions and menus of the front-end application (_e.g. hide/show actions based on permissions_).

[**DEMO**](https://stackblitz.com/edit/ng-action-outlet-demo?file=src/app/app.component.ts)

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

-   [ActionButton](https://klemenoslaj.github.io/ng-action-outlet/classes/ActionButton.html)
-   [ActionGroup](https://klemenoslaj.github.io/ng-action-outlet/classes/ActionGroup.html)
-   [ActionToggle](https://klemenoslaj.github.io/ng-action-outlet/classes/ActionToggle.html)

In order to create custom action class, refer to [ActionAbstract](./classes/ActionAbstract.html) class.
