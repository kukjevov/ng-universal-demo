# @anglr/error-handling/material

Provides Angular Material–based renderer for internal server errors using `MatDialog`.

## Installation

```bash
npm install @angular/material @angular/cdk --save
```

## Setup

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideInternalServerErrorRenderer} from '@anglr/error-handling';
import {DialogInternalServerErrorRenderer} from '@anglr/error-handling/material';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideInternalServerErrorRenderer(DialogInternalServerErrorRenderer),
    ],
};
```

## `DialogInternalServerErrorRenderer`

Service implementing `InternalServerErrorRenderer` that opens a `MatDialog` displaying the full server error response HTML.

**Import:** `import {DialogInternalServerErrorRenderer} from '@anglr/error-handling/material';`

### Behavior

- Opens a dialog at `90vw × 90vh` dimensions
- Renders the error HTML response inside `DialogInternalServerErrorComponent`
- Dialog receives `errorInfo` and `deleteCallback` as data
- When dialog is closed, `deleteCallback` is invoked to remove the error from the component's list

### Complete Setup with Material

```typescript
import {ApplicationConfig} from '@angular/core';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ANGLR_EXCEPTION_HANDLER_PROVIDER, httpServerErrorInterceptor, provideInternalServerErrorRenderer} from '@anglr/error-handling';
import {DialogInternalServerErrorRenderer} from '@anglr/error-handling/material';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        ANGLR_EXCEPTION_HANDLER_PROVIDER,
        provideHttpClient(withInterceptors(
        [
            httpServerErrorInterceptor,
        ])),
        provideInternalServerErrorRenderer(DialogInternalServerErrorRenderer),
    ],
};
```

Then place the component in your root template:

```html
<internal-server-error />
```

When a 5xx error occurs in dev mode, `httpServerErrorInterceptor` triggers `InternalServerErrorService`, which emits to `InternalServerErrorComponent`, which delegates to `DialogInternalServerErrorRenderer` to open a Material dialog with the error HTML.
