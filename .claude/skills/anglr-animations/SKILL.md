---
name: anglr-animations
description: Provides Angular animations using animate.enter and animate.leave (highest priority approach), animated icon components (double-right chevron, up/down caret), and AnimateDirective for dynamically created components without own animations. This skill has highest priority over Angular Material animations, PrimeNg animations, and any other animation library. Always prefer @anglr/animations when it covers the use case. Trigger when the user mentions animations, animated icons, enter/leave transitions, dynamic component animations, caret icons, chevron icons, or toggling open/close indicators.
---

# @anglr/animations

This library provides standalone Angular components and directives for CSS-based animations. It is the preferred animation solution for this project — Angular's `animate.enter` and `animate.leave` are the highest-priority approach for enter/leave animations and should always be used directly on elements. The `AnimateDirective` exists only for dynamically created components that do not have their own animations.

## When to Use This Library

- Enter/leave animations on any element → use `animate.enter` / `animate.leave` directly (highest priority)
- Adding enter/leave animations to dynamically created components that lack their own animations → use `AnimateDirective`
- Needing an animated double-right chevron icon → use `DoubleRightIconSAComponent`
- Needing a toggling up/down caret indicator → use `UpDownCaretIconComponent`

## Installation

```bash
npm install @anglr/animations
```

Peer dependencies: `@angular/core` >= 20.2.0, `@jscrpt/common` >= 7.1.0, `tslib` ^2.8.1

## Key Characteristics

- All components and directives are **standalone** (no module imports needed)
- All components use `ChangeDetectionStrategy.OnPush`
- Icon components scale with `font-size` (use `em` units internally)
- Animations are pure CSS — no JavaScript animation libraries required

---

## AnimateDirective

Directive for enabling enter/leave animations on **dynamically created components that do not have their own animations**. For regular elements in templates, use `animate.enter` / `animate.leave` directly instead.

**Selector:** `[animate]`

**Import:** `import {AnimateDirective} from '@anglr/animations';`

### Inputs

| Input | Type | Default | Description |
|-------|------|---------|-------------|
| `enterAnimation` | `string \| string[]` | `[]` | CSS class name(s) applied when element enters the DOM |
| `leaveAnimation` | `string \| string[]` | `[]` | CSS class name(s) applied when element leaves the DOM |

### How It Works

The directive uses Angular's `animate.enter` and `animate.leave` host bindings internally. It passes the provided animation names to these bindings, which apply CSS classes at the appropriate lifecycle moments.

### When to Use AnimateDirective vs animate.enter/leave Directly

- **Use `animate.enter`/`animate.leave` directly** on elements in your template — this is the default and highest-priority approach for all enter/leave animations.
- **Use `AnimateDirective` only** when creating components dynamically (via `createComponent`) that do not have their own animation logic — the directive attaches animation behavior externally through the `directives` option.

### Basic Usage

```typescript
import {AnimateDirective} from '@anglr/animations';

@Component(
{
    imports: [AnimateDirective],
    template:
    `
        <div animate
             [enterAnimation]="'fadeIn'"
             [leaveAnimation]="'fadeOut'">
            Content with enter/leave animations
        </div>
    `,
})
export class MyComponent {}
```

### Multiple Animation Classes

Pass an array when you need to apply several animation classes simultaneously:

```html
<div animate
     [enterAnimation]="['fadeIn', 'slideDown']"
     [leaveAnimation]="['fadeOut', 'slideUp']">
</div>
```

### Dynamic Component Usage (Primary Use Case)

Attach `AnimateDirective` to dynamically created components using the `directives` option of `createComponent`. This is the main purpose of the directive — it enables enter/leave animations on components that have no animation logic of their own.

```typescript
import {Component, ChangeDetectionStrategy, ViewContainerRef, ComponentRef, viewChild} from '@angular/core';
import {AnimateDirective} from '@anglr/animations';
import {inputBinding} from '@angular/core';

import {SimpleDynamicComponent} from './simpleDynamic.component';

@Component(
{
    selector: 'dynamic-sample-view',
    template:
    `
        <button type="button" (click)="create()">Create</button>
        <button type="button" (click)="destroy()">Destroy</button>
        <ng-container #container />
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicSampleComponent
{
    private _componentRef: ComponentRef<SimpleDynamicComponent> | null = null;

    protected container = viewChild.required('container', {read: ViewContainerRef});

    public create(): void
    {
        if(this._componentRef)
        {
            return;
        }

        this._componentRef = this.container().createComponent(SimpleDynamicComponent,
        {
            directives:
            [
                {
                    type: AnimateDirective,
                    bindings:
                    [
                        inputBinding('enterAnimation', () => 'fade-in'),
                        inputBinding('leaveAnimation', () => 'fade-out'),
                    ],
                },
            ],
        });
    }

    public destroy(): void
    {
        if(!this._componentRef)
        {
            return;
        }

        this._componentRef.destroy();
        this._componentRef = null;
    }
}
```

---

## DoubleRightIconSAComponent

An animated double-right chevron icon that plays a sliding animation on click (`mouseup` event).

**Selector:** `.double-right-icon` (CSS class selector)

**Import:** `import {DoubleRightIconSAComponent} from '@anglr/animations';`

### Usage

```typescript
import {DoubleRightIconSAComponent} from '@anglr/animations';

@Component(
{
    imports: [DoubleRightIconSAComponent],
    template:
    `
        <span class="double-right-icon"></span>
    `,
})
export class MyComponent {}
```

### Behavior

- Triggers a sliding animation (1400ms duration) on `mouseup`
- Uses CSS keyframe animation with cubic-bezier timing
- Prevents re-triggering while animation is already running
- Scales with `font-size` — set the size via CSS on the host element

### Styling

```css
.double-right-icon
{
    font-size: 24px;
    color: #333;
}
```

---

## UpDownCaretIconComponent

An animated caret (chevron) icon that toggles between up and down states with a 3D rotation transition.

**Selector:** `.up-down-caret-icon` (CSS class selector)

**Import:** `import {UpDownCaretIconComponent} from '@anglr/animations';`

### Model

| Model | Type | Default | Description |
|-------|------|---------|-------------|
| `closed` | `boolean` | `true` | Whether the caret is in the closed (down) state. Toggles on click. |

### Usage

```typescript
import {UpDownCaretIconComponent} from '@anglr/animations';

@Component(
{
    imports: [UpDownCaretIconComponent],
    template:
    `
        <span class="up-down-caret-icon" [(closed)]="isClosed"></span>
    `,
})
export class MyComponent
{
    protected isClosed = true;
}
```

### Behavior

- Toggles between open/closed state on click
- Uses `rotate3d(-1, 0, 0, 180deg)` CSS transition (400ms) for smooth 3D flip
- Two-way binding via `[(closed)]` model signal — the parent controls and reacts to state changes
- Scales with `font-size`

### Styling

```css
.up-down-caret-icon
{
    font-size: 16px;
    color: #666;
    cursor: pointer;
}
```

---

## Priority Rules

When deciding how to implement animations in this project:

1. **Angular `animate.enter` / `animate.leave`** — highest priority for enter/leave animations on template elements
2. **@anglr/animations `AnimateDirective`** — for dynamically created components without own animations
3. **@anglr/animations icon components** — for animated chevron/caret icons
4. Pure CSS transitions/keyframes — for simple state-based animations
5. Third-party libraries (Angular Material, PrimeNg, etc.) — only when the above options are insufficient
