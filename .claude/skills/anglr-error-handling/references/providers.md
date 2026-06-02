# Providers & Injection Tokens

## Provider Functions

### `provideAnglrExceptionExtenders`

Registers exception extender functions that enrich error objects before logging.

**Import:** `import {provideAnglrExceptionExtenders} from '@anglr/error-handling';`

```typescript
import {provideAnglrExceptionExtenders, errorWithUrlExtender} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideAnglrExceptionExtenders(
        [
            errorWithUrlExtender,
        ]),
    ],
};
```

Returns `EnvironmentProviders` — use in application or route config providers arrays.

---

### `provideInternalServerErrorRenderer`

Registers a custom renderer type for displaying internal server errors.

**Import:** `import {provideInternalServerErrorRenderer} from '@anglr/error-handling';`

```typescript
import {provideInternalServerErrorRenderer} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideInternalServerErrorRenderer(CustomErrorRenderer),
    ],
};
```

Returns `EnvironmentProviders`.

---

### `provideHttpClientErrorConfigs`

Provides per-status-code configuration for error handling. Merges with existing configs (supports hierarchical DI — child injectors merge with parent configs).

**Import:** `import {provideHttpClientErrorConfigs} from '@anglr/error-handling';`

```typescript
import {provideHttpClientErrorConfigs} from '@anglr/error-handling';
import {CatchHttpClientErrorBehavior} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClientErrorConfigs(
        {
            404:
            {
                behavior: CatchHttpClientErrorBehavior.Throw,
                message: 'Resource not found',
            },
            409:
            {
                behavior: CatchHttpClientErrorBehavior.PassThrogh,
                message: 'Conflict occurred',
            },
        }),
    ],
};
```

Returns `Provider` — can be used in component-level providers for route-specific overrides.

---

### `provideHttpClientErrorHandlers`

Provides per-status-code custom error handler functions. Merges with existing handlers (supports hierarchical DI).

**Import:** `import {provideHttpClientErrorHandlers} from '@anglr/error-handling';`

```typescript
import {provideHttpClientErrorHandlers} from '@anglr/error-handling';
import {HttpClientError} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClientErrorHandlers(
        {
            404: async (error: HttpClientError) =>
            {
                // Custom handling for 404
                return null; // Suppress
            },
        }),
    ],
};
```

Returns `Provider`.

---

### `provideHttpClientErrorResponseMapper`

Provides a custom function to extract error messages from `HttpErrorResponse`.

**Import:** `import {provideHttpClientErrorResponseMapper} from '@anglr/error-handling';`

```typescript
import {provideHttpClientErrorResponseMapper} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClientErrorResponseMapper(err => [err?.error?.message ?? 'Unknown error']),
    ],
};
```

Returns `Provider`.

---

### `provideHttpClientValidationErrorResponseMapper`

Provides a custom function to extract validation errors from `HttpErrorResponse`.

**Import:** `import {provideHttpClientValidationErrorResponseMapper} from '@anglr/error-handling';`

```typescript
import {provideHttpClientValidationErrorResponseMapper} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClientValidationErrorResponseMapper(err => err?.error?.validationErrors ?? null),
    ],
};
```

Returns `Provider`.

---

## Injection Tokens

| Token | Type | Default | Description |
|---|---|---|---|
| `ERROR_HANDLING_NOTIFICATIONS` | `Notifications` | — | Notifications service for error handling package (used by `AnglrExceptionHandler`) |
| `CLIENT_ERROR_NOTIFICATIONS` | `Notifications` | — | Notifications service for HTTP client error display (used by `catchHttpClientError`) |
| `HTTP_CLIENT_ERROR_RESPONSE_MAPPER` | `HttpClientErrorResponseMapper` | `err => [err?.error?.toString()]` | Maps `HttpErrorResponse` to error messages |
| `HTTP_CLIENT_VALIDATION_ERROR_RESPONSE_MAPPER` | `HttpClientValidationErrorResponseMapper` | — | Maps `HttpErrorResponse` to validation errors |
| `ANGLR_EXCEPTION_EXTENDERS` | `AnglrExceptionExtender[]` | `[]` | Multi-token for exception extender functions |
| `INTERNAL_SERVER_ERROR_RENDERER` | `InternalServerErrorRenderer` | `DummyInternalServerErrorRenderer` | Renderer for internal server error display |
| `HTTP_IGNORED_CLIENT_ERRORS` | `number[]` | `[401, 403]` | HTTP status codes ignored by `processHttpClientErrorResponse` |
| `HTTP_CLIENT_ERROR_CONFIGS` | `HttpClientErrorConfigs` | — | Per-status-code configuration for error handling |
| `HTTP_CLIENT_ERROR_HANDLERS` | `HttpClientErrorHandlers` | — | Per-status-code custom error handlers |

**All token imports:** `import {ERROR_HANDLING_NOTIFICATIONS, CLIENT_ERROR_NOTIFICATIONS, HTTP_CLIENT_ERROR_RESPONSE_MAPPER, ...} from '@anglr/error-handling';`

---

## Types

| Type | Signature | Description |
|---|---|---|
| `HttpClientErrorResponseMapper` | `(err: HttpErrorResponse) => PromiseOr<string[]>` | Function mapping error response to messages |
| `HttpClientValidationErrorResponseMapper` | `(err: HttpErrorResponse) => PromiseOr<HttpClientValidationErrors\|null>` | Function mapping error response to validation errors |
| `HttpClientErrorMessages` | `Record<number, string\|undefined\|null>` | Status code to error message mapping |
| `HttpClientErrorConfigs` | `Record<number, CatchHttpClientErrorHttpStatusCodeOptions\|undefined\|null>` | Status code to config mapping |
| `HttpClientErrorHandlers` | `Record<number, HttpClientErrorHandler<HttpClientError>\|undefined\|null>` | Status code to handler mapping |
| `HttpClientErrorHandler` | `(error: TError, options?: CatchHttpClientErrorOptions) => Promise<TError\|null>` | Async handler returning processed error or `null` |

---

## Interfaces

| Interface | Description |
|---|---|
| `HttpClientValidationErrors` | Property name to validation error map (`Record<string, HttpClientPropertyValidationError>`) |
| `HttpClientPropertyValidationError` | Map of validation error keys to messages for a single property |
| `HttpClientErrors` | Combined `{errors: string[], validationErrors: HttpClientValidationErrors\|null}` |
| `ErrorWithStack` | Error with optional `stack` property |
| `ErrorWithUrl` | Extends error with optional `applicationUrl` |
| `AngularError` | Angular error shape with optional `promise` and `rejection` |
