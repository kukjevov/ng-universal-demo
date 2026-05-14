---
name: css-styles
description: Expert guide for using @css-styles/common and @css-styles/themes SCSS libraries when styling components, pages, or layouts. Use this skill whenever building UI, creating CSS/SCSS styles, designing components, working with themes, applying spacing/sizing/typography, or generating HTML templates with classes. Prioritizes existing utility classes, CSS variables, and mixins from these libraries over writing custom CSS. Trigger when the user mentions styling, theming, CSS variables, layout classes, buttons, forms, alerts, grids, animations, spacing, or any visual design work. Also trigger when creating Angular component styles, HTML templates with class attributes, or SCSS files. Do NOT use @css-styles/custom-themes — it is out of scope.
---

# CSS Styles Skill

This skill teaches how to use the `@css-styles/common` (v2.0.1) and `@css-styles/themes` (v2.5.0) SCSS libraries effectively. These are the project's core styling libraries — always prefer their utilities over writing custom CSS.

## Core Principle

Before writing any custom CSS, check if the needed style already exists as:
1. A utility class (e.g., `.flex-row`, `.margin-sm`, `.bold`)
2. A CSS custom property (e.g., `var(--size-padding-md)`, `var(--theme-primary)`)
3. A SCSS placeholder selector to `@extend` (e.g., `@extend %flex-column`)
4. A mixin to `@include` (e.g., `@include mixins.fluid-type(...)`)

## How to Import

```scss
// In component SCSS files or global stylesheets:
@use '@css-styles/common' as mixins;   // mixins, functions, variables
@use '@css-styles/themes' as themes;   // theme component mixins, colors, theme functions
```

The `as` alias is flexible — common conventions in this project are `mixins`, `vars`, `misc` for common and `themes` for themes.

---

## @css-styles/common — Complete Reference

### SCSS Variables

#### Sizing
```scss
$sizeXs: 4;  $sizeSm: 10;  $sizeMd: 15;  $sizeLg: 20;  $sizeBg: 20;
```

#### Font Sizes
```scss
$fontXxs: 10;  $fontXs: 12;  $fontSm: 14;  $fontMd: 16;
$fontLg: 18;   $fontXl: 20;  $fontXxl: 22; $fontXxxl: 28;
```

#### Maps (used by build mixins)
```scss
$sizes: (none: 0, extra-small: 4, small: 10, medium: 15, large: 20, big: 20,
         xs: 4, sm: 10, md: 15, lg: 20, bg: 20);

$fontSizes: (extra-extra-small: 10, extra-small: 12, small: 14, medium: 16,
             large: 18, extra-large: 20, extra-extra-large: 22, extra-extra-extra-large: 28);
```

### Functions

| Function | Signature | Purpose |
|----------|-----------|---------|
| `is-map` | `is-map($var)` | Returns true if `$var` is a Sass map |
| `strip-unit` | `strip-unit($value)` | Removes the unit from a CSS value |
| `getSize` | `getSize($fontSize, $size, $fixed: false)` | Calculates size in `em` (responsive) or `rem` (fixed) relative to `$fontSize` |

### Mixins

| Mixin | Signature | Purpose |
|-------|-----------|---------|
| `in-layer` | `in-layer($layerName)` | Wraps content in `@layer` for cascade control |
| `thin-scrollbar-color` | `thin-scrollbar-color($color, $background)` | Custom thin scrollbar with CSS variable colors |
| `fluid-type` | `fluid-type($min-vw, $max-vw, $min-font-size, $max-font-size)` | Fluid responsive font sizing between viewport breakpoints |
| `css-reset` | `css-reset()` | Resets box-sizing, margin, padding, font inheritance |
| `buildCssVars` | `buildCssVars($prefix, $map)` | Recursively converts nested Sass map to CSS custom properties |
| `buildMarginCss` | `buildMarginCss($fontSize, $sizes)` | Generates `--size-margin-*` vars and `.margin-*` utility classes |
| `buildPaddingCss` | `buildPaddingCss($fontSize, $sizes)` | Generates `--size-padding-*` vars and `.padding-*` utility classes |
| `buildBorderRadiusCss` | `buildBorderRadiusCss($fontSize, $sizes)` | Generates `--size-borderRadius-*` vars and `.border-round-*` classes |
| `buildGapsCss` | `buildGapsCss($fontSize, $sizes)` | Generates `--size-gap-*` vars and `.gap-*` / `.column-gap-*` / `.row-gap-*` classes |
| `buildFontSizeCss` | `buildFontSizeCss($fontSize, $sizes)` | Generates `--size-font-*` vars and `.*-text` classes |
| `buildFixedSizes` | `buildFixedSizes($fontSize)` | Generates `--size-1px` through `--size-32px` (em and rem variants) |
| `buildSizes` | `buildSizes($fontSize, $sizes)` | Generates `--size-*` and `--size-fixed-*` variables |
| `misc-css` | `misc-css()` | Generates all utility classes listed below |

### Utility Classes

All utilities exist as both CSS classes (`.name`) and SCSS placeholders (`%name`). Use classes in HTML templates, use `@extend %name` in SCSS files.

#### Display & Layout
| Class | CSS |
|-------|-----|
| `.block` | `display: block` |
| `.hidden` | `display: none` |
| `.inline-block` | `display: inline-block` |
| `.flex` | `display: flex` |
| `.contents` | `display: contents` |
| `.flex-row` | `display: flex; flex-direction: row` |
| `.flex-column` | `display: flex; flex-direction: column` |
| `.flex-row-reverse` | `flex-direction: row-reverse` |
| `.flex-wrap` | `flex-wrap: wrap` |

#### Flex Grow (all include `min-width: 0; min-height: 0`)
`.flex-0`, `.flex-025`, `.flex-05`, `.flex-075`, `.flex-1`, `.flex-2`, `.flex-3`, `.flex-4`, `.flex-5`

#### Flexbox Alignment
| Class | CSS |
|-------|-----|
| `.flex-end` | `justify-content: flex-end` |
| `.justify-content-start` | `justify-content: start` |
| `.justify-content-center` | `justify-content: center` |
| `.justify-content-end` | `justify-content: end` |
| `.justify-content-stretch` | `justify-content: stretch` |
| `.justify-content-space-between` | `justify-content: space-between` |
| `.justify-content-space-around` | `justify-content: space-around` |
| `.justify-content-space-evenly` | `justify-content: space-evenly` |
| `.align-items-center` | `align-items: center` |
| `.align-items-start` | `align-items: start` |
| `.align-items-end` | `align-items: end` |
| `.align-self-start` | `align-self: start` |
| `.align-self-center` | `align-self: center` |
| `.align-self-end` | `align-self: end` |
| `.align-self-stretch` | `align-self: stretch` |
| `.justify-self-start` | `justify-self: start` |
| `.justify-self-center` | `justify-self: center` |
| `.justify-self-end` | `justify-self: end` |
| `.justify-self-stretch` | `justify-self: stretch` |
| `.align-content-start` | `align-content: start` |
| `.align-content-center` | `align-content: center` |
| `.align-content-end` | `align-content: end` |

#### Grid
| Class | CSS |
|-------|-----|
| `.grid-subgrid-columns` | `display: grid; grid-template-columns: subgrid` |
| `.grid-subgrid-rows` | `display: grid; grid-template-rows: subgrid` |
| `.grid-subgrid` | `display: grid; grid-template-columns: subgrid; grid-template-rows: subgrid` |
| `.grid-whole-row` | `grid-column: 1 / -1; min-width: 0` |
| `.grid-first-cell` | `grid-column: 1 / 2; grid-row: 1 / 2; min-width: 0; min-height: 0` |

#### Position
`.relative`, `.absolute`, `.left-0`, `.top-0`, `.right-0`, `.bottom-0`

#### Sizing
| Class | CSS |
|-------|-----|
| `.full-width` | `width: 100%` |
| `.half-width` | `width: 50%` |
| `.quarter-width` | `width: 25%` |
| `.third-width` | `width: 33.33%` |
| `.full-height` | `height: 100%` |
| `.max-height-full` | `max-height: 100%` |
| `.min-width-none` | `min-width: 0` |
| `.min-height-none` | `min-height: 0` |
| `.min-dimensions-none` | `min-width: 0; min-height: 0` |

#### Typography
| Class | CSS |
|-------|-----|
| `.text-center` | `text-align: center` |
| `.text-right` | `text-align: right` |
| `.text-left` | `text-align: left` |
| `.bold` | `font-weight: bold` |
| `.semi-bold` | `font-weight: 500` |
| `.regular` | `font-weight: 400` |
| `.semi-thin` | `font-weight: 300` |
| `.ultra-thin` | `font-weight: 200` |
| `.italic` | `font-style: italic` |
| `.text-small-caps` | `font-variant-caps: small-caps` |
| `.text-uppercase` | `text-transform: uppercase` |
| `.text-capitalize` | `text-transform: capitalize` |
| `.first-letter-uppercase` | First letter uppercase via `::first-letter` |
| `.spread-text` | `letter-spacing: 1px` |
| `.text-selection` | `user-select: text` |
| `.text-ellipsis` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap` |
| `.flexible-ellipsis` | `min-width: 0; min-height: 0` (enables ellipsis in flex containers) |
| `.line-height-1em` | `line-height: 1em` |
| `.font-1em` | `font-size: 1em` |

#### Whitespace
`.white-space-normal` / `.content-wrap`, `.white-space-nowrap` / `.content-nowrap`, `.white-space-pre`, `.white-space-pre-wrap`

#### Overflow
| Class | CSS |
|-------|-----|
| `.overflow-hidden` | `overflow: hidden` |
| `.overflow-auto` | `overflow: auto` |
| `.overflow-vertical-auto` | `overflow-y: auto` |
| `.overflow-vertical-scroll` | `overflow-y: scroll` |
| `.overflow-horizontal-auto` | `overflow-x: auto` |
| `.overflow-horizontal-scroll` | `overflow-x: scroll` |
| `.thin-scrollbar` | `scrollbar-width: thin` |

#### Cursor
`.cursor-pointer` / `.pointer-cursor`, `.cursor-not-allowed` / `.not-allowed-cursor`

#### Misc
| Class | CSS |
|-------|-----|
| `.va-middle` | `vertical-align: middle` |
| `.va-top` | `vertical-align: top` |
| `.notransition` | `transition: none !important` |
| `.transition-all-400` | `transition: all 400ms` |
| `.root-scale` / `.reset-scale` / `.reset-zoom` | `font-size: 1rem` |
| `.print-hidden` | Hidden in print media |

### Generated Spacing Classes (from build mixins)

When `buildMarginCss`, `buildPaddingCss`, etc. are called, they generate classes using the size map keys:

**Margin**: `.margin-{size}`, `.margin-right-{size}`, `.margin-left-{size}`, `.margin-top-{size}`, `.margin-bottom-{size}`, `.margin-horizontal-{size}`, `.margin-vertical-{size}` — plus `-fixed` variants for rem-based sizing.

**Padding**: `.padding-{size}`, `.padding-right-{size}`, `.padding-left-{size}`, `.padding-top-{size}`, `.padding-bottom-{size}`, `.padding-horizontal-{size}`, `.padding-vertical-{size}` — plus `-fixed` variants.

**Gap**: `.gap-{size}`, `.column-gap-{size}`, `.row-gap-{size}` — plus `-fixed` variants.

**Border Radius**: `.border-round-{size}`, `.top-border-round-{size}`, `.bottom-border-round-{size}`, `.left-border-round-{size}`, `.right-border-round-{size}`, `.top-left-border-round-{size}`, `.top-right-border-round-{size}`, `.bottom-left-border-round-{size}`, `.bottom-right-border-round-{size}` — plus `-fixed` variants.

**Font Size**: `.{size}-text` (e.g., `.small-text`, `.large-text`) — plus `-fixed` variants.

Size keys: `none`, `extra-small`/`xs`, `small`/`sm`, `medium`/`md`, `large`/`lg`, `big`/`bg`.

### CSS Custom Properties (from build mixins)

```
--size-margin-{size}        --size-padding-{size}       --size-gap-{size}
--size-borderRadius-{size}  --size-font-{size}          --size-{size}
--size-fixed-{size}         --size-1px ... --size-32px   --size-fixed-1px ... --size-fixed-32px
--color-transparent
```

---

## @css-styles/themes — Complete Reference

### Color Palette (_defaultColors.scss)

Available as SCSS variables when importing themes:

| Palette | Range | Main Color |
|---------|-------|------------|
| Grayscale | `$gray-1000` (#111) to `$gray-50` (#e5e5e5) | — |
| Green | `$green-900` to `$green-50` | `$green-600` (#6aba4f) |
| Blue | `$blue-900` to `$blue-50` | `$blue-800` (#3379b7) |
| Azure | `$azure-900` to `$azure-50` | `$azure-500` (#5bbfde) |
| Red | `$red-900` to `$red-50` | `$red-600` (#ec0e0e) |
| Orange | `$orange-900` to `$orange-50` | `$orange-800` (#e4a256) |
| Basic | `$white` (#fff), `$black` (#000) | — |

### Component Mixins

These mixins generate complete component styles consuming CSS custom properties. They are called once globally (in `_app.scss`), not per component.

#### `css-alerts($alertTypes)`
- **Default types**: `'info'`, `'warning'`, `'success'`, `'danger'`, `'error'`
- **Generates**: `.alert`, `.alert-{type}`
- **CSS vars**: `--alert-padding`, `--alert-borderRadius`, `--alert-borderWidth`, `--alert-borderStyle`, `--alert-margin`, `--alert-{type}-background`, `--alert-{type}-foreground`, `--alert-{type}-borderColor`

#### `css-buttons($buttonTypes, $states)`
- **Default types**: `'primary'`, `'success'`, `'info'`, `'warning'`, `'danger'`
- **Default states**: `(onlyContent: only-content)`
- **Generates**: `.btn`, `.btn-{type}`, `.btn.disabled`, `.btn.icon-only`, `.btn-{type}.{state}`
- **Button states**: `:hover/:focus`, `:active`, `:disabled`
- **CSS vars**: `--button-padding`, `--button-borderRadius`, `--button-fontFamily`, `--button-fontSize`, `--button-{type}-background`, `--button-{type}-foreground`, `--button-{type}-borderColor`, `--button-{type}-hover-*`, `--button-{type}-active-*`, `--button-{type}-disabled-*`

#### `css-forms`
- **Generates**: `.control-label`, `.form-group`, `.form-control`, `.form-control-static`, `.input-group`, `.input-group-addon`, `.has-error`, `.validation-error-div`, `.form-error`, `.inputs-gap`, `ng-select.form-control`
- **CSS vars**: `--input-*` (background, foreground, border, borderRadius, padding, placeholder, disabled, focus, invalid, error, errors), `--label-*`, `--formGroup-*`, `--inputs-*`, `--select-tag-*`

#### `css-grid`
- **Generates**: `[nggrid]`, `.grid-container-css-grid`, `.grid-body-css-grid`, `.grid-header-css-grid`, `.grid-header-row-css-grid`, `.grid-content-row-css-grid`, `ng-basic-paging`
- **CSS vars**: `--grid-header-*`, `--grid-oddRow-*`, `--grid-evenRow-*`

#### `css-texts($textTypes)`
- **Default types**: `'primary'`, `'danger'`, `'warning'`, `'success'`, `'info'`
- **Generates**: `.text-{type}`, `.text-{type}-transparent`
- **CSS vars**: `--text-{type}-foreground`, `--text-{type}-background`

#### `css-titles`
- **Generates**: `.page-title`, `.section-title`, `.subsection-title`
- **CSS vars**: `--title-page-*`

#### `css-blocks($blockTypes)`
- **Default types**: `'highlight'`
- **Generates**: `.{type}-block`
- **CSS vars**: `--block-{type}-*` (padding, borderRadius, background, foreground, scrollbar)

#### `css-common`
- **Generates**: `.semi-tight` (font-size: 0.9em), `.tight` (font-size: 0.8em), `.text-selection`, `.text-selection-disabled`, `.line-height-default`, `hr` styling

#### `css-common-components`
- **Generates**: `titled-dialog`, `movable-titled-dialog`, `date-time-picker`, `tooltip-popup`, `mat-dialog-container`

### Animation Mixins

| Mixin | Classes | Customizable CSS Properties |
|-------|---------|----------------------------|
| `slideInAnimation` | `.slide-in`, `.slide-in-animation` | `--slide-in-duration`, `--slide-in-to-max-height` |
| `slideOutAnimation` | `.slide-out` | `--slide-out-duration` |
| `flyInAnimation` | `.fly-in` | `--fly-in-duration`, `--fly-in-from-opacity`, `--fly-in-from-transform` |
| `flyOutAnimation` | `.fly-out` | `--fly-out-duration`, `--fly-out-from-opacity` |
| `fadeInAnimation` | `.fade-in` | `--fade-in-duration`, `--fade-in-from-opacity`, `--fade-in-to-opacity` |
| `fadeOutAnimation` | `.fade-out` | `--fade-out-duration`, `--fade-out-from-opacity` |
| `provideAllAnimations` | All above | All animation variables |

### Theme System

#### `defineTheme($fontSize, $theme, $customization)` function

Creates a complete theme by deep-merging layers:
1. Library defaults (built-in colors and spacing)
2. `$theme` overrides (from custom theme package)
3. `$customization` overrides (application-specific)

#### `buildThemeVars($theme)` mixin

Converts the merged theme map into flat CSS custom properties. Calls sub-mixins:
`buildFontFamily`, `buildPageThemeVars`, `buildTitleThemeVars`, `buildBlockThemeVars`, `buildMiscThemeVars`, `buildLevelThemeVars`, `buildThemeThemeVars`, `buildAlertThemeVars`, `buildTextThemeVars`, `buildMainMenuThemeVars`, `buildDialogThemeVars`, `buildFormsThemeVars`, `buildGridThemeVars`, `buildButtonThemeVars`

#### Theme Map Structure (top-level keys)
```
fontFamily, page, title, block, misc, level, theme, alert, text,
mainMenu, dialog, formGroup, inputs, input, label, select, grid,
buttons, button
```

Each key is a nested map. The `buildCssVars` mixin recursively flattens: `button.primary.background` → `--button-primary-background`.

### High-Level Theme CSS Variables

```scss
// Semantic theme colors
--theme-primary          --theme-onPrimary
--theme-secondary        --theme-onSecondary
--theme-tertiary         --theme-onTertiary
--theme-success          --theme-onSuccess
--theme-info             --theme-onInfo
--theme-warning          --theme-onWarning
--theme-error            --theme-onError
--theme-primaryContainer --theme-secondaryContainer --theme-tertiaryContainer

// Page-level
--page-background        --page-foreground          --page-scrollbar
--font-family

// Semantic level colors
--level-success          --level-info               --level-warning
--level-error            --level-default
```

---

## Usage Patterns & Best Practices

### In HTML Templates — Use Utility Classes

```html
<!-- Layout -->
<div class="flex-row align-items-center gap-sm">
  <span class="flex-1 text-ellipsis bold">Title</span>
  <button class="btn btn-primary">Save</button>
</div>

<!-- Spacing -->
<div class="padding-md margin-bottom-sm border-round-sm">
  <p class="small-text margin-none">Content</p>
</div>

<!-- Alerts -->
<div class="alert alert-warning">Warning message</div>

<!-- Text semantic colors -->
<span class="text-danger-transparent">Error text</span>
<span class="text-success-transparent">Success text</span>

<!-- Titles -->
<h1 class="page-title">Page Title</h1>
<h2 class="section-title">Section</h2>

<!-- Forms -->
<div class="form-group">
  <label class="control-label">Name</label>
  <input class="form-control" />
</div>

<!-- Animation -->
<div class="fade-in">Animated content</div>
```

### In SCSS — Use Placeholders, Variables, and Mixins

```scss
@use '@css-styles/common' as mixins;

:host {
  @extend %flex-column;
  @extend %full-width;
  gap: var(--size-gap-sm);
  padding: var(--size-padding-md);
  border-radius: var(--size-borderRadius-sm);
  font-size: var(--size-font-small);
}

.header {
  @extend %flex-row;
  @extend %align-items-center;
  @extend %justify-content-space-between;
  background: var(--theme-primary);
  color: var(--theme-onPrimary);
}

.scrollable {
  @extend %overflow-auto;
  @extend %thin-scrollbar;
  @include mixins.thin-scrollbar-color(--page-scrollbar);
}

.title {
  @include mixins.fluid-type(768px, 1024px, 14px, 18px);
  @extend %bold;
}
```

### Choosing Between em and rem (responsive vs fixed)

- Default classes (e.g., `.margin-sm`) use **em** — they scale with parent font-size
- `-fixed` variants (e.g., `.margin-sm-fixed`) use **rem** — consistent absolute size
- CSS vars: `--size-padding-sm` (em) vs `--size-fixed-sm` (rem)
- Pixel-specific: `--size-6px` (em-relative) vs `--size-fixed-6px` (rem-based)

### Theme Variable Customization

Override any theme variable inline using CSS custom properties:

```scss
.custom-button {
  --button-primary-background: #custom-color;
  --button-primary-foreground: white;
  --button-primary-hover-background: darken(#custom-color, 10%);
}

.compact-form {
  --formGroup-gap: 4px;
  --input-padding: 4px 8px;
  --label-font-size: 0.8em;
}

.custom-alert {
  --alert-padding: 8px 16px;
  --alert-borderRadius: 4px;
}
```

### Customizing Animations

```html
<div class="slide-in" style="--slide-in-duration: 500ms; --slide-in-to-max-height: 200px;">
  Slides in with custom duration and height
</div>

<div class="fade-in" style="--fade-in-duration: 300ms; --fade-in-from-opacity: 0.5;">
  Fades in from 50% opacity
</div>
```

### Decision Guide

| Need | Use |
|------|-----|
| Layout in template | Utility classes: `.flex-row`, `.flex-1`, `.align-items-center` |
| Layout in SCSS | Placeholders: `@extend %flex-row` |
| Spacing in template | Classes: `.margin-sm`, `.padding-md`, `.gap-xs` |
| Spacing in SCSS | Variables: `var(--size-padding-sm)`, `var(--size-margin-md)` |
| Semantic colors | Variables: `var(--theme-primary)`, `var(--level-warning)` |
| Component colors | Variables: `var(--button-primary-background)`, `var(--input-foreground)` |
| Responsive font | Mixin: `@include mixins.fluid-type(...)` |
| Fixed pixel sizes | Variables: `var(--size-6px)`, `var(--size-fixed-12px)` |
| Scrollbar styling | Mixin: `@include mixins.thin-scrollbar-color(...)` |
| Cascade management | Mixin: `@include mixins.in-layer(...)` |
| Button styling | Classes: `.btn .btn-primary`, `.btn .btn-danger` |
| Form inputs | Classes: `.form-group`, `.form-control`, `.control-label` |
| Alerts/notifications | Classes: `.alert .alert-info`, `.alert .alert-danger` |
| Text emphasis | Classes: `.text-danger-transparent`, `.text-success-transparent` |
| Animations | Classes: `.fade-in`, `.slide-in`, `.fly-in` + CSS var overrides |
| Titles/headings | Classes: `.page-title`, `.section-title`, `.subsection-title` |
