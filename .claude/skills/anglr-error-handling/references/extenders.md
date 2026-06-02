# Exception Extenders

Exception extenders enrich error objects with additional context before they are logged by `AnglrExceptionHandler`. They are async functions that receive the injector and error, and return an extended error object.

## Type Signature

```typescript
type AnglrExceptionExtender = (injector: Injector, error: ErrorWithStack) => Promise<ErrorWithStack>;
```

**Import:** `import {AnglrExceptionExtender, ErrorWithStack} from '@anglr/error-handling';`

## Registration

Use `provideAnglrExceptionExtenders` to register extender functions:

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

---

## Built-in Extenders

### `errorWithUrlExtender`

Adds the current application URL (via Angular's `Location` service) to the error object as `applicationUrl`.

**Import:** `import {errorWithUrlExtender} from '@anglr/error-handling';`

**Package:** `@anglr/error-handling`

```typescript
provideAnglrExceptionExtenders(
[
    errorWithUrlExtender,
]);
```

The extended error gains the `applicationUrl: string` property from the `ErrorWithUrl` interface.

---

### `errorWithScreenShotExtender`

Captures a screenshot of the current application state using `html2canvas` and attaches it as a base64-encoded PNG string. Browser-only — skips capture on server-side rendering.

**Import:** `import {errorWithScreenShotExtender} from '@anglr/error-handling/html2canvas';`

**Package:** `@anglr/error-handling/html2canvas`

**Additional dependency:** `npm install html2canvas --save`

```typescript
import {provideAnglrExceptionExtenders, errorWithUrlExtender} from '@anglr/error-handling';
import {errorWithScreenShotExtender} from '@anglr/error-handling/html2canvas';

export const appConfig: ApplicationConfig =
{
    providers:
    [
        provideAnglrExceptionExtenders(
        [
            errorWithUrlExtender,
            errorWithScreenShotExtender,
        ]),
    ],
};
```

The extended error gains `screenshotBase64: string` property from the `ErrorWithScreenShot` interface.

---

## Custom Extenders

Create custom extenders to add any context to error objects:

```typescript
import {Injector} from '@angular/core';
import {AnglrExceptionExtender, ErrorWithStack} from '@anglr/error-handling';

export const errorWithTimestampExtender: AnglrExceptionExtender = (injector: Injector, error: ErrorWithStack): Promise<ErrorWithStack> =>
{
    const extended = error as ErrorWithStack & {timestamp: string};
    extended.timestamp = new Date().toISOString();

    return Promise.resolve(extended);
};

export const errorWithUserExtender: AnglrExceptionExtender = async (injector: Injector, error: ErrorWithStack): Promise<ErrorWithStack> =>
{
    const authService = injector.get(AuthenticationService, null);
    const extended = error as ErrorWithStack & {userId?: string};

    if(authService?.isAuthenticated)
    {
        extended.userId = authService.getUserIdentity()?.id;
    }

    return extended;
};
```

Register multiple extenders:

```typescript
provideAnglrExceptionExtenders(
[
    errorWithUrlExtender,
    errorWithScreenShotExtender,
    errorWithTimestampExtender,
    errorWithUserExtender,
]);
```

Extenders run sequentially in the order they are registered, each receiving the error returned by the previous extender.
