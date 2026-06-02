# Usage examples

Idiomatic HTML and SCSS patterns. Use as templates when scaffolding new components in any project that depends on `@css-styles/common` and `@css-styles/themes`.

> Examples use the **single-class form** for buttons (`class="btn-primary"`) and alerts (`class="alert-warning"`) introduced in `@css-styles/themes` v2.6.0. On older versions (or in legacy code that hasn't been migrated yet) you'll see the two-class form `class="btn btn-primary"` / `class="alert alert-warning"` — both work; the single-class form is preferred in new code.

## Page chrome

```html
<div class="page-title top-border-round-xs text-uppercase flex-row">
    <div class="flex-1">Page heading</div>
</div>

<div class="highlight-block bottom-border-round-xs padding-horizontal-big">
    <!-- main content -->
</div>
```

> If the host app declared additional block types (e.g. `primary-block`, `secondary-block`) you can use them in place of `highlight-block` for differently-styled panels.

## Filter form

```html
<form class="flex-column inputs-gap" [formGroup]="filterConfig" novalidate (submit)="filter()">
    <div class="flex-row inputs-gap">
        <div class="form-group flex-1">
            <label class="control-label">From</label>
            <input class="form-control" formControlName="from" type="date">
        </div>
        <div class="form-group flex-1">
            <label class="control-label">To</label>
            <input class="form-control" formControlName="to" type="date">
        </div>
        <div class="form-group flex-1">
            <label class="control-label">Status</label>
            <ng-select class="form-control" formControlName="status" enumName="statusy"/>
        </div>
    </div>

    <div class="flex-row flex-end buttons-gap">
        <button type="button" class="btn-info" (click)="reset()">Reset</button>
        <button type="submit" class="btn-primary">Filter</button>
    </div>
</form>
```

## Input group with addon

```html
<div class="input-group">
    <span class="input-group-addon">€</span>
    <input class="form-control" type="number" step="0.01" formControlName="amount">
    <span class="input-group-addon">/h</span>
</div>
```

## Inline labelled control

```html
<div class="form-group flex-row align-items-center">
    <label class="control-label margin-right-small">Rate (EUR)</label>
    <input class="flex-1 margin-right-extra-small form-control required" formControlName="rate" type="number" step="0.01" required>
</div>
```

## Dialog action bar

```html
<div class="flex-row flex-end buttons-gap padding-small">
    <button type="button" class="btn-info" mat-dialog-close>Cancel</button>
    <button type="button" class="btn-primary" (click)="save()">Save</button>
</div>
```

## Toolbar / section heading with action

```html
<div class="flex-row align-items-center column-gap-small padding-small highlight-block">
    <div class="flex-1 bold text-uppercase text-ellipsis">{{title()}}</div>
    <a class="cursor-pointer" (click)="showInfo()" title="More info">
        <span class="fas fa-info-circle"></span>
    </a>
    <button class="btn-primary" (click)="run()">Run</button>
</div>
```

## Status text

```html
<span class="text-success bold">{{count()}} items processed</span>
<span class="text-danger-transparent">{{errors()}} errors</span>
```

## Alerts

```html
<div class="alert-warning margin-bottom-small">
    Heads up — input definition is outdated.
</div>

<div class="alert-success">Saved.</div>
<div class="alert-danger">Operation failed.</div>
```

## Two-column responsive-ish layout with subgrid-style alignment

```html
<div class="flex-row inputs-gap">
    <div class="form-group flex-1">…</div>
    <div class="form-group flex-1">…</div>
    <div class="form-group flex-1">…</div>
    <div class="form-group flex-1">…</div>
</div>
```

If you need real subgrid alignment (rare):

```html
<div style="display: grid; grid-template-columns: max-content 1fr; gap: var(--size-sm);">
    <label class="control-label align-self-center">Name</label>
    <input class="form-control" formControlName="name">

    <label class="control-label align-self-center">Email</label>
    <input class="form-control" formControlName="email">
</div>
```

(Prefer to lift the grid into SCSS using `%grid-subgrid` if you have a parent grid.)

## Component SCSS that re-uses the system

```scss
@use '@css-styles/common' as mixins;

:host
{
    @extend %flex-column, %flex-1;
    gap: var(--size-gap-small);
    padding: var(--size-sm);
    background: var(--block-highlight-background);
    color: var(--page-foreground);
    border-radius: var(--size-borderRadius-xs);
}

.header
{
    @extend %flex-row, %align-items-center, %bold;
    color: var(--theme-primary);
    font-size: var(--size-font-large);
    gap: var(--size-gap-extra-small);
}

.row
{
    @extend %flex-row;
    gap: var(--size-gap-small);

    &.error
    {
        color: var(--text-danger-foreground);
        background: var(--alert-danger-background);
        padding: var(--size-2px) var(--size-sm);
        border-radius: var(--size-borderRadius-xs);
    }
}
```

## Ellipsis inside a flex row

```html
<div class="flex-row align-items-center column-gap-small">
    <span class="fas fa-file"></span>
    <span class="flex-1 text-ellipsis">{{veryLongFileName()}}</span>
    <button class="cursor-pointer" (click)="remove()">×</button>
</div>
```

The `flex-1` is what gives the span `min-width: 0`, without which `text-ellipsis` would never trigger.

## Buttons group, end-aligned, with consistent gap

```html
<div class="flex-row flex-end buttons-gap margin-top-small">
    <button type="button" class="btn-info" (click)="cancel()">Cancel</button>
    <button type="submit" class="btn-primary">Submit</button>
</div>
```

## Animated reveal

```html
<div *ngIf="expanded()" class="slide-in highlight-block padding-small">
    …details…
</div>
```

Tune by setting CSS vars on a parent: `--slide-in-duration: 250ms; --slide-in-to-max-height: 400px;`.
