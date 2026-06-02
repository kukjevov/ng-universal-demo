# Services

## `AnglrExceptionHandler`

Replaces Angular's default `ErrorHandler` and provides enhanced unhandled error handling including source map resolution, notifications, and extensibility through extenders.

**Import:** `import {ANGLR_EXCEPTION_HANDLER_PROVIDER, AnglrExceptionHandlerOptions} from '@anglr/error-handling';`

### Registration

```typescript
import {ApplicationConfig, ValueProvider} from '@angular/core';
import {ANGLR_EXCEPTION_HANDLER_PROVIDER, AnglrExceptionHandlerOptions} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        ANGLR_EXCEPTION_HANDLER_PROVIDER,
        //either use value provider or factory provider which benefits of using DI
        <ValueProvider>
        {
            provide: AnglrExceptionHandlerOptions,
            useValue: new AnglrExceptionHandlerOptions(true, false),
        },
    ],
};
```

### Options

`AnglrExceptionHandlerOptions` constructor:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `debugMode` | `boolean` | `false` | Logs errors to browser console with full stack traces |
| `showAlsoAlert` | `boolean` | `false` | Shows browser `alert()` with error message (debug only) |

### How It Works

1. Captures unhandled errors via Angular's `ErrorHandler` interface
2. Resolves source-mapped stack traces (browser only, via `sourcemapped-stacktrace`)
3. Sends error notifications through `ERROR_HANDLING_NOTIFICATIONS`
4. Runs all registered `AnglrExceptionExtender` functions to enrich the error
5. Logs the enriched error via `LOGGER` from `@anglr/common`

---

## `InternalServerErrorService`

Root-provided service that emits internal server error events for display. Used by `httpServerErrorInterceptor` to signal when a 5xx error occurs.

**Import:** `import {InternalServerErrorService} from '@anglr/error-handling';`

**Provided in:** `root`

### API

| Method | Parameters | Description |
|---|---|---|
| `showInternalServerError` | `errorHtml: string, requestUrl: string` | Emits an error event with HTML content and request URL |

| Property | Type | Description |
|---|---|---|
| `internalServerErrorOccured` | `Observable<InternalServerErrorInfo>` | Observable that emits when a server error occurs |

### `InternalServerErrorInfo` Class

| Property | Type | Description |
|---|---|---|
| `id` | `number` | Unique identifier for the error |
| `errorHtml` | `string` | HTML content of the error response |
| `requestUrl` | `string` | URL of the request that failed |

---

## `ServerValidationService`

Root-provided service for managing server-side validation errors. Stores validation errors received from HTTP responses and notifies subscribers when they change. Used by `catchHttpClientError` operator to automatically store validation errors, and consumed by `ServerValidationValidatorDirective` to display them on form controls.

**Import:** `import {ServerValidationService} from '@anglr/error-handling';`

**Provided in:** `root`

### API

| Method | Parameters | Description |
|---|---|---|
| `addServerValidationErrors` | `validationErrors: HttpClientValidationErrors` | Adds server validation errors to the store |
| `clearServerValidationErrors` | — | Clears all stored validation errors |
| `removeServerValidationError` | `property: string` | Removes validation errors for a single property |

| Property | Type | Description |
|---|---|---|
| `serverValidationsChanged` | `Observable<boolean>` | Emits `true` when errors are added, `false` when cleared/removed |
| `serverValidations` | `HttpClientValidationErrors` | Current validation errors (cached copy) |
| `serverValidationProperties` | `string[]` | Array of property names that have validation errors |

### Usage

```typescript
import {inject} from '@angular/core';
import {ServerValidationService} from '@anglr/error-handling';

@Injectable({providedIn: 'root'})
export class MyFormService
{
    private _serverValidation: ServerValidationService = inject(ServerValidationService);

    public submitForm(data: unknown)
    {
        // Clear previous validation errors before submission
        this._serverValidation.clearServerValidationErrors();
        // ... perform HTTP request
    }
}
```

---

## `DummyInternalServerErrorRenderer`

Default no-op fallback renderer for internal server errors. Does nothing when called — serves as the default `INTERNAL_SERVER_ERROR_RENDERER` when no custom renderer is provided.

**Import:** `import {DummyInternalServerErrorRenderer} from '@anglr/error-handling';`

**Provided in:** `root` (default for `INTERNAL_SERVER_ERROR_RENDERER` token)
