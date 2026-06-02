# HTTP Interceptors

All interceptors are available as functional interceptors (recommended) and deprecated class-based providers. Always use the functional form with `provideHttpClient(withInterceptors([...]))`.

## `noConnectionInterceptor`

Handles HTTP responses with status `0` (server offline / no connection). Shows a warning notification via `ERROR_HANDLING_NOTIFICATIONS`.

**Import:** `import {noConnectionInterceptor, NoConnectionInterceptorOptions} from '@anglr/error-handling';`

### Setup

```typescript
import {ApplicationConfig, ValueProvider, provideHttpClient, withInterceptors} from '@angular/common/http';
import {noConnectionInterceptor, NoConnectionInterceptorOptions} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClient(withInterceptors(
        [
            noConnectionInterceptor,
        ])),
        //either use value provider or factory provider which benefits of using DI
        <ValueProvider>
        {
            provide: NoConnectionInterceptorOptions,
            useValue: new NoConnectionInterceptorOptions('Custom offline message.'),
        },
    ],
};
```

### Options

`NoConnectionInterceptorOptions` accepts:

| Parameter | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `'Server is offline. Try again later.'` | Message displayed via notifications |
| `action` | `NoConnectionAction` | Shows warning notification and completes observer | Custom action called when status 0 received |

`NoConnectionAction` type: `(injector: Injector, observer: Observer<unknown>) => void`

---

## `serviceUnavailableInterceptor`

Handles HTTP `503 Service Unavailable` responses.

**Import:** `import {serviceUnavailableInterceptor, ServiceUnavailableInterceptorOptions} from '@anglr/error-handling';`

### Setup

```typescript
import {ApplicationConfig, ValueProvider, provideHttpClient, withInterceptors} from '@angular/common/http';
import {serviceUnavailableInterceptor, ServiceUnavailableInterceptorOptions} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClient(withInterceptors(
        [
            serviceUnavailableInterceptor,
        ])),
        //either use value provider or factory provider which benefits of using DI
        <ValueProvider>
        {
            provide: ServiceUnavailableInterceptorOptions,
            useValue: new ServiceUnavailableInterceptorOptions('Service is temporarily unavailable.'),
        },
    ],
};
```

Default message: `'Remote server is unavailable. Try again later.'`

---

## `httpGatewayTimeoutInterceptor`

Handles HTTP `504 Gateway Timeout` responses.

**Import:** `import {httpGatewayTimeoutInterceptor, HttpGatewayTimeoutInterceptorOptions} from '@anglr/error-handling';`

### Setup

```typescript
import {ApplicationConfig, ValueProvider, provideHttpClient, withInterceptors} from '@angular/common/http';
import {httpGatewayTimeoutInterceptor, HttpGatewayTimeoutInterceptorOptions} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClient(withInterceptors(
        [
            httpGatewayTimeoutInterceptor,
        ])),
        //either use value provider or factory provider which benefits of using DI
        <ValueProvider>
        {
            provide: HttpGatewayTimeoutInterceptorOptions,
            useValue: new HttpGatewayTimeoutInterceptorOptions('Gateway timeout occurred.'),
        },
    ],
};
```

Default message: `'Server did not respond in defined time.'`

---

## `httpServerErrorInterceptor`

Handles HTTP `5xx` server errors. In dev mode (`jsDevMode`), logs errors via `LOGGER` and optionally renders error details through `InternalServerErrorService`.

**Import:** `import {httpServerErrorInterceptor} from '@anglr/error-handling';`

### Setup

```typescript
import {ApplicationConfig, provideHttpClient, withInterceptors} from '@angular/common/http';
import {httpServerErrorInterceptor} from '@anglr/error-handling';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideHttpClient(withInterceptors(
        [
            httpServerErrorInterceptor,
        ])),
    ],
};
```

### Behavior

- Only active when `jsDevMode` is true (production builds skip processing entirely)
- Logs error URL and body via `LOGGER`
- If `InternalServerErrorService` is available, calls `showInternalServerError` to trigger UI display
- Respects `IGNORED_INTERCEPTORS` context token — requests that mark this interceptor as ignored are skipped

---

## Recommended Interceptor Order

Register interceptors in this order for correct error handling priority:

```typescript
provideHttpClient(withInterceptors(
[
    noConnectionInterceptor,
    serviceUnavailableInterceptor,
    httpGatewayTimeoutInterceptor,
    httpServerErrorInterceptor,
])),
```

This ensures connection issues are caught first, then specific server status codes, then general server errors.
