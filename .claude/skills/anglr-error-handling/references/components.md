# Components

## `InternalServerErrorComponent`

Component that subscribes to `InternalServerErrorService` and collects internal server error reports for display. Place this component in your root application template to enable visual display of 5xx errors during development.

**Selector:** `internal-server-error`

**Import:** `import {InternalServerErrorComponent} from '@anglr/error-handling';`

### Usage

```html
<internal-server-error />
```

### How It Works

1. Subscribes to `InternalServerErrorService.internalServerErrorOccured`
2. Collects `InternalServerErrorInfo` objects (sanitized as data URIs for safe iframe rendering)
3. Displays a toggle button when errors exist
4. Delegates actual error rendering to the configured `InternalServerErrorRenderer` (injected via `INTERNAL_SERVER_ERROR_RENDERER` token)

### Customizing the Renderer

By default, the component uses `DummyInternalServerErrorRenderer` (no-op). To display errors visually, provide a custom renderer:

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideInternalServerErrorRenderer} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideInternalServerErrorRenderer(CustomErrorRenderer),
    ],
};
```

### `InternalServerErrorRenderer` Interface

Custom renderers must implement:

```typescript
import {InternalServerErrorInfo, InternalServerErrorRenderer} from '@anglr/error-handling';

export class CustomErrorRenderer implements InternalServerErrorRenderer
{
    public show(errorInfo: InternalServerErrorInfo, deleteCallback: (errorInfo: InternalServerErrorInfo) => void): void
    {
        // Custom rendering logic
        console.log('Server error:', errorInfo.errorHtml, errorInfo.requestUrl);
        deleteCallback(errorInfo);
    }
}
```

| Parameter | Type | Description |
|---|---|---|
| `errorInfo` | `InternalServerErrorInfo` | Object with `id`, `errorHtml` (sanitized data URI), `requestUrl` |
| `deleteCallback` | `(errorInfo: InternalServerErrorInfo) => void` | Call this to remove the error from the component's list |
