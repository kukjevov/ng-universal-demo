# @anglr/error-handling/rest

Integration with `@anglr/rest` library, providing decorators and middlewares for declarative REST client error handling. These allow configuring error behavior directly on REST service methods.

## Installation

```bash
npm install @anglr/rest @anglr/error-handling --save
```

## Middlewares

### `CatchHttpClientErrorMiddleware`

Wraps REST method responses with the `catchHttpClientError` operator. Reads configuration from method descriptor properties set by decorators.

**Import:** `import {CatchHttpClientErrorMiddleware} from '@anglr/error-handling/rest';`

### `HttpClientErrorProcessingMiddleware`

Wraps REST method responses with the `processHttpClientErrorResponse` operator. Reads mapper functions and ignored codes from method descriptor properties.

**Import:** `import {HttpClientErrorProcessingMiddleware} from '@anglr/error-handling/rest';`

---

## Middleware Order

Use the provided middleware order constant that includes error handling middlewares in the correct position:

```typescript
import {REST_ERROR_HANDLING_MIDDLEWARE_ORDER} from '@anglr/error-handling/rest';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        REST_ERROR_HANDLING_MIDDLEWARE_ORDER,
    ],
};
```

`ERROR_HANDLING_REST_MIDDLEWARES_ORDER` defines the full middleware sequence including `CatchHttpClientErrorMiddleware` and `HttpClientErrorProcessingMiddleware` in the correct position relative to other `@anglr/rest` middlewares.

---

## Decorators

All decorators modify REST method descriptors and are used on `@anglr/rest` service methods.

### Complete Example

```typescript
import {Injectable} from '@angular/core';
import {RESTClient, GET, POST, BaseUrl, Path, Body} from '@anglr/rest';
import {HttpClientErrorBehavior, HttpClientErrorMessages, HttpClientErrorSkipErrorNotifications, HttpClientErrorHandlers, HttpClientErrorForceCustomMessage, HttpClientErrorSkipServerValidationErrors, HttpClientErrorsMapper, HttpClientValidationErrorsMapper, IgnoredHttpErrorStatusCodes} from '@anglr/error-handling/rest';
import {CatchHttpClientErrorBehavior, HttpClientError} from '@anglr/error-handling';
import {NEVER, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
@BaseUrl('/api')
export class UsersRestService extends RESTClient
{
    @GET('/users/{id}')
    @HttpClientErrorBehavior(CatchHttpClientErrorBehavior.Throw)
    @HttpClientErrorMessages({404: 'User not found'})
    public getUser(@Path('id') id: number): Observable<User>
    {
        return NEVER;
    }

    @GET('/users')
    @HttpClientErrorBehavior(CatchHttpClientErrorBehavior.Suppress, 404)
    @HttpClientErrorSkipErrorNotifications()
    @IgnoredHttpErrorStatusCodes([409])
    public getUsers(): Observable<User[]>
    {
        return NEVER;
    }

    @POST('/users')
    @HttpClientErrorBehavior(CatchHttpClientErrorBehavior.PassThrogh)
    @HttpClientErrorForceCustomMessage()
    public createUser(@Body() user: User): Observable<User>
    {
        return NEVER;
    }
}
```

---

## Decorator Reference

### `@HttpClientErrorBehavior(behavior, statusCode?)`

Sets error behavior globally for the method, or for a specific status code.

```typescript
@HttpClientErrorBehavior(CatchHttpClientErrorBehavior.Throw)           // All errors throw
@HttpClientErrorBehavior(CatchHttpClientErrorBehavior.Suppress, 404)   // Only 404 suppressed
```

| Parameter | Type | Description |
|---|---|---|
| `behavior` | `CatchHttpClientErrorBehavior` | Behavior to apply |
| `statusCode` | `number` (optional) | If specified, applies only to this status code |

---

### `@HttpClientErrorMessages(messages)`

Sets custom error messages per status code.

```typescript
@HttpClientErrorMessages({404: 'User not found', 409: 'Conflict'})
```

| Parameter | Type | Description |
|---|---|---|
| `messages` | `HttpClientErrorMessages` | `Record<number, string>` mapping status codes to messages |

---

### `@HttpClientErrorHandlers(handlers)`

Sets custom error handler functions per status code.

```typescript
@HttpClientErrorHandlers({
    404: async (error: HttpClientError) => {
        // Custom handling
        return null;
    },
})
```

| Parameter | Type | Description |
|---|---|---|
| `handlers` | `HttpClientErrorHandlers` | `Record<number, HttpClientErrorHandler>` |

---

### `@HttpClientErrorForceCustomMessage(indication?, statusCode?)`

Forces custom message display even when response contains error messages.

```typescript
@HttpClientErrorForceCustomMessage()          // Force for all status codes
@HttpClientErrorForceCustomMessage(true, 404) // Force only for 404
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `indication` | `boolean` | `true` | Whether to force custom message |
| `statusCode` | `number` (optional) | — | If specified, applies only to this status code |

---

### `@HttpClientErrorSkipErrorNotifications(indication?, statusCode?)`

Skips error notification display.

```typescript
@HttpClientErrorSkipErrorNotifications()          // Skip for all
@HttpClientErrorSkipErrorNotifications(true, 404) // Skip only for 404
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `indication` | `boolean` | `true` | Whether to skip notifications |
| `statusCode` | `number` (optional) | — | If specified, applies only to this status code |

---

### `@HttpClientErrorSkipServerValidationErrors(indication?, statusCode?)`

Skips server validation error processing.

```typescript
@HttpClientErrorSkipServerValidationErrors()
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `indication` | `boolean` | `true` | Whether to skip validation errors |
| `statusCode` | `number` (optional) | — | If specified, applies only to this status code |

---

### `@HttpClientErrorsMapper(mapper)`

Sets a custom error response mapper for the method.

```typescript
@HttpClientErrorsMapper(err => [err?.error?.detail ?? 'Error'])
```

| Parameter | Type | Description |
|---|---|---|
| `mapper` | `HttpClientErrorResponseMapper` | `(err: HttpErrorResponse) => PromiseOr<string[]>` |

---

### `@HttpClientValidationErrorsMapper(mapper)`

Sets a custom validation error response mapper for the method.

```typescript
@HttpClientValidationErrorsMapper(err => err?.error?.fieldErrors ?? null)
```

| Parameter | Type | Description |
|---|---|---|
| `mapper` | `HttpClientValidationErrorResponseMapper` | `(err: HttpErrorResponse) => PromiseOr<HttpClientValidationErrors\|null>` |

---

### `@IgnoredHttpErrorStatusCodes(statusCodes)`

Sets HTTP status codes that should be ignored (passed through without processing).

```typescript
@IgnoredHttpErrorStatusCodes([409, 422])
```

| Parameter | Type | Description |
|---|---|---|
| `statusCodes` | `number[]` | Array of status codes to ignore |
