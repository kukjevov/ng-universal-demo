# Theme map — full reference

This file documents the structure of the `$theme` map consumed by `themes.defineTheme($fontSize, $theme, $customization)` and emitted as CSS variables by `themes.buildThemeVars($theme)`. Every key shown here becomes a CSS variable using the pattern:

```
top-level → nested → nested  ⇒  --topLevel-nested-nested
```

For example `theme.primary` → `--theme-primary`; `button.primary.hover.background` → `--button-primary-hover-background`; `input.placeholder.foreground` → `--input-placeholder-foreground`.

`themes.buildCssVars` walks the map recursively, so any extra keys you add will produce extra CSS variables automatically.

## How to override

In the application's theme file (the SCSS module that owns the host app's `$theme`/`$appTheme` map):

```scss
$appTheme: (
    button: (
        primary: (
            disabled: (
                borderColor: transparent,
                foreground: $_white,
                background: #8fcb7b,
            )
        ),
        warning: ( background: $_orange ),
    ),
    grid: (
        header: ( background: $_darkBlueGray, foreground: $_white ),
    ),
);
```

`defineTheme` deep-merges this on top of the package defaults, so you only need to write what changes. Anything you omit keeps the default value.

### Replacing the defaults entirely

`defineTheme` is just a convenience wrapper around `map.deep-merge`. If you want a fully custom theme (no default colors, no default spacing, no default button styling leaking in), skip it and pass your own map straight to `buildThemeVars`:

```scss
@use '@css-styles/themes' as themes;

$myTheme: (
    fontFamily: 'Inter',
    page:  ( background: #fff, foreground: #111 ),
    theme: ( primary: #5bc0de, onPrimary: #fff, /* … */ ),
    button: ( padding: .5em 1em, borderRadius: 4px,
              primary: ( background: var(--theme-primary), foreground: var(--theme-onPrimary),
                         hover:  ( background: #4aa9c8 ),
                         active: ( background: #3a92ad ) ) ),
);

.app-page
{
    @include themes.buildThemeVars($myTheme);
    @include themes.css-buttons($buttonTypes: ('primary'));
}
```

`buildThemeVars` walks whatever map you give it and emits one CSS variable per leaf. Keys you don't supply just don't produce a variable — the component CSS will then rely on its own `var(..., fallback)` chain or simply be unstyled if no fallback exists. That's how you get a completely custom design system while still using the parts mixins (`css-buttons`, `css-forms`, …) for the generated selectors and states.

## Top-level structure

```scss
(
    fontFamily: 'Inter',
    page:    ( background, foreground, scrollbar ),
    title:   ( page: ( background, foreground, padding, margin, fontSize ) ),
    block:   ( highlight: ( padding, borderRadius, background, foreground, scrollbar ),
               // add additional blocks here, e.g. primary, secondary:
               primary:   ( ... ),
               secondary: ( ... ) ),
    misc:    ( separator: ( foreground ) ),
    level:   ( succes, info, warning, error, default ),
    theme:   ( primary, onPrimary, secondary, onSecondary, tertiary, onTertiary,
               success, onSuccess, info, onInfo, warning, onWarning, error, onError,
               primaryContainer, onPrimaryContainer,
               secondaryContainer, onSecondaryContainer,
               tertiaryContainer, onTertiaryContainer ),
    alert:   ( padding, borderRadius, borderWidth, borderStyle, margin,
               info:    ( background, foreground, borderColor ),
               warning: ( ... ),
               success: ( ... ),
               danger:  ( ... ),
               error:   ( ... ) ),
    text:    ( primary: ( background, foreground ),
               danger:  ( ... ),
               warning: ( ... ),
               success: ( ... ),
               info:    ( ... ) ),
    mainMenu: ( background, backgroundGradient, backgroundGradient2, foreground,
                active: ( foreground, background ),
                drawer: ( background, foreground ) ),
    dialog:  ( border, borderRadius,
               title:       ( textTransform, letterSpacing, background, foreground ),
               content:     ( background, foreground ),
               closeButton: ( background, foreground, hover: ( background, foreground ) ) ),
    formGroup: ( direction, gap ),
    inputs:    ( columnGap, rowGap ),
    input:   ( background, foreground, border, borderRadius, borderStyle, letterSpacing, borderWidth, boxShadow, padding,
               placeholder: ( foreground, letterSpacing, opacity ),
               groupAddon:  ( background, foreground, padding ),
               disabled:    ( background, foreground, border ),
               focus:       ( background, foreground, border ),
               invalid:     ( border, outlineWidth ),
               error:       ( background, foreground, outline ),
               errors:      ( background, foreground, fontSize, padding,
                              border: ( color, width, style ) ) ),
    label:   ( background, foreground, letterSpacing, lineHeight,
               font: ( size, weight ),
               invalid: ( foreground, background ) ),
    select:  ( tag: ( background, foreground, padding, fontSize ) ),
    grid:    ( header:  ( background, foreground ),
               evenRow: ( background, foreground ),
               oddRow:  ( background, foreground ) ),
    buttons: ( columnGap, rowGap ),
    button:  ( padding, transition, textShadow, boxShadow,
               borderWidth, borderStyle, borderRadius,
               fontFamily, fontSize, fontWeight, lineHeight, letterSpacing,
               minWidth, width, textTransformation, contentGap,
               justifyContent, alignItems, cursor, whiteSpace, position,
               display, flexDirection, textDecoration,
               disabled: ( opacity, cursor, background, foreground, borderColor, icon ),
               <variant>: (
                   background, foreground, borderColor, icon,
                   hover:  ( background, foreground, borderColor, icon ),
                   active: ( background, foreground, borderColor, icon ),
                   onlyContent: (
                       background, foreground, borderColor, icon,
                       hover:  ( background, foreground, borderColor, icon ),
                       active: ( background, foreground, borderColor, icon ),
                   )
               ) )
)
```

Default variants present under `button` are `primary`, `secondary`, `tertiary`, `success`, `info`, `warning`, `error`. Use `themes.css-buttons($buttonTypes: ('primary', 'secondary', 'danger', 'link'))` on the host side to choose which ones get generated as `.btn-<variant>` classes.

## Patterns and gotchas

- **Use `var(--...)` inside the theme map** to point one key at another. The defaults do this heavily, e.g. `alert.info.background: var(--theme-info)` so changing `theme.info` cascades to every alert/button/text variant that semantically maps to "info".
- **Button variants default to theme colors (v2.6.0+).** `button.<variant>.background` defaults to `var(--theme-<variant>)` and `button.<variant>.foreground` to `var(--theme-on<Variant>)`. So a new button variant works automatically if you supply matching `theme.<variant>` / `theme.on<Variant>` colors — no `button.<variant>.*` keys required for the base look.
- **`unset` is meaningful.** Some legacy keys are `unset` so the framework's later CSS-var fallback chain (`--button-<variant>-disabled-foreground, var(--button-disabled-foreground)`) can take over. Don't set `unset` unless you really mean to opt out.
- **Sizes come from `getSize($fontSize, N)`** so they scale with the configured `$fontSize`. Use the same `mixins.getSize` helper when adding your own keys to keep things consistent.
- **`color.scale($base, $lightness: ±N%)`** is the SCSS idiom used throughout the defaults for hover/active variants.
- **CSS variables are emitted under `.app-page.<themeName>`**, so multiple themes can coexist on the same page (e.g. by switching the class on a wrapper).

## Adding a new component area

If you need a new themable area (say, `tooltip`), the steps are:

1. Add a top-level key to your `$appTheme`: `tooltip: ( background: ..., foreground: ..., padding: ... )`.
2. In the application's `theme.scss`, after `themes.buildThemeVars($theme)`, either rely on the recursive walk (the keys you added will already be emitted as `--tooltip-background` etc.) or add a dedicated `@include` if you want a separately-callable mixin.
3. In your component's SCSS, reference `var(--tooltip-background)` etc.

`buildCssVars` is generic; it doesn't care if the key existed in the defaults. Anything you add appears as a CSS variable.
