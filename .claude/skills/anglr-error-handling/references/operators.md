# RxJS Operators

These operators are used in observable pipelines to process HTTP client errors (4xx). They work together: `processHttpClientErrorResponse` converts raw `HttpErrorResponse` into `HttpClientError`, then `catchHttpClientError` handles the processed error.

## `processHttpClientErrorResponse`

Converts `HttpErrorResponse` with status codes `400..499` into `HttpClientError` objects. Non-HTTP errors, client-side errors (where `error.error instanceof Error`), and ignored status codes are re-thrown unchanged.

**Import:** `import {processHttpClientErrorResponse} from '@anglr/error-handling';`

### Basic Usage

```typescript
import {inject, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {processHttpClientErrorResponse, catchHttpClientError} from '@anglr/error-handling';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _httpClient: HttpClient = inject(HttpClient);

    private _injector: Injector = inject(Injector);

    public getUser(id: number)
    {
        return this._httpClient.get(`/api/users/${id}`)
            .pipe(
                processHttpClientErrorResponse({injector: this._injector}),
                catchHttpClientError({injector: this._injector}),
            );
    }
}
```

### Options (`HttpClientErrorOptions`)

```typescript
processHttpClientErrorResponse(
{
    injector: angularInjector,
    ignoredHttpStatusCodes: [401, 403, 409],
    clientErrorsResponseMapper: err => [err?.error?.message ?? 'Unknown error'],
    clientValidationErrorsResponseMapper: err => err?.error?.validationErrors ?? null,
});
```

| Option | Type | Description |
|---|---|---|
| `injector` | `Injector` | Angular injector (optional if called in injection context) |
| `ignoredHttpStatusCodes` | `number[]` | Status codes to pass through without processing (default from `HTTP_IGNORED_CLIENT_ERRORS`: `[401, 403]`) |
| `clientErrorsResponseMapper` | `HttpClientErrorResponseMapper` | Custom function to extract error messages from response |
| `clientValidationErrorsResponseMapper` | `HttpClientValidationErrorResponseMapper` | Custom function to extract validation errors from response |

---

## `catchHttpClientError`

Catches `HttpClientError` objects (produced by `processHttpClientErrorResponse`) and handles them — displaying notifications, storing validation errors, and applying behavior. Non-`HttpClientError` errors are re-thrown.

**Import:** `import {catchHttpClientError, CatchHttpClientErrorBehavior} from '@anglr/error-handling';`

### Basic Usage

```typescript
// Suppress errors (default) — observable never completes on error
catchHttpClientError({injector: angularInjector});

// Pass through — HttpClientError is emitted as next value
catchHttpClientError({injector: angularInjector, behavior: CatchHttpClientErrorBehavior.PassThrogh});

// Throw — HttpClientError is re-thrown as observable error
catchHttpClientError({injector: angularInjector, behavior: CatchHttpClientErrorBehavior.Throw});
```

### Per-Status-Code Configuration

```typescript
catchHttpClientError(
{
    configs:
    {
        404:
        {
            behavior: CatchHttpClientErrorBehavior.Throw,
            message: 'Resource not found',
            skipErrorNotifications: false,
            skipServerValidationErrors: true,
            forceCustomMessageDisplay: true,
        },
        409:
        {
            behavior: CatchHttpClientErrorBehavior.PassThrogh,
            message: 'Conflict occurred',
        },
    },
});
```

### Custom Error Handlers

```typescript
catchHttpClientError(
{
    handlers:
    {
        404: async (error: HttpClientError) =>
        {
            console.log('Custom 404 handler', error.response.url);

            return null;
        },
    },
});
```

### Options (`CatchHttpClientErrorOptions`)

| Option | Type | Description |
|---|---|---|
| `injector` | `Injector` | Angular injector (optional if called in injection context) |
| `behavior` | `CatchHttpClientErrorBehavior` | Default behavior for all status codes |
| `configs` | `HttpClientErrorConfigs` | Per-status-code configuration object |
| `handlers` | `HttpClientErrorHandlers` | Per-status-code custom handler functions |
| `skipErrorNotifications` | `boolean` | Skip showing error notifications |
| `skipServerValidationErrors` | `boolean` | Skip storing server validation errors |
| `forceCustomMessageDisplay` | `boolean` | Force display of custom message even when response contains errors |

### Per-Status-Code Config (`CatchHttpClientErrorHttpStatusCodeOptions`)

| Option | Type | Description |
|---|---|---|
| `behavior` | `CatchHttpClientErrorBehavior` | Behavior for this specific status code |
| `message` | `string` | Custom message to display for this status code |
| `skipErrorNotifications` | `boolean` | Skip showing error notifications for this status code |
| `skipServerValidationErrors` | `boolean` | Skip storing server validation errors for this status code |
| `forceCustomMessageDisplay` | `boolean` | Force custom message even when response errors exist |

---

## `CatchHttpClientErrorBehavior` Enum

| Value | Description |
|---|---|
| `Suppress` | Error is handled silently, observable never completes (default) |
| `PassThrogh` | `HttpClientError` is emitted as the next observable value |
| `Throw` | `HttpClientError` is re-thrown as an observable error |

---

## `HttpClientError` Class

Normalized wrapper for HTTP 4xx errors produced by `processHttpClientErrorResponse`.

**Import:** `import {HttpClientError} from '@anglr/error-handling';`

| Property | Type | Description |
|---|---|---|
| `errors` | `string[]` | Array of error messages extracted from response |
| `validationErrors` | `HttpClientValidationErrors \| null` | Map of property names to validation error objects |
| `statusCode` | `number` | HTTP status code (400-499) |
| `message` | `string` | Combined error message |
| `response` | `HttpErrorResponse` | Original Angular HttpErrorResponse |

---

## `HttpNotFoundError` Class

Specialized `HttpClientError` for HTTP 404 responses, used by the built-in `handleHttp404Error` handler.

**Import:** `import {HttpNotFoundError} from '@anglr/error-handling';`

---

## Processing Flow

1. HTTP request fails with 4xx status
2. `processHttpClientErrorResponse` catches `HttpErrorResponse`, calls response mappers to extract errors/validation errors, creates `HttpClientError`
3. `catchHttpClientError` catches `HttpClientError`, resolves configuration for the status code, optionally calls custom handler, stores validation errors in `ServerValidationService`, displays notifications, applies behavior (Suppress/PassThrogh/Throw)
