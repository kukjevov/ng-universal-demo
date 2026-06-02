# Directives

## `ServerValidationValidatorDirective`

Directive that integrates server-side validation errors with Angular reactive forms. Apply the `serverValidation` attribute to form controls to automatically display server validation errors received from HTTP responses.

**Selector:** `[serverValidation][formControlName], [serverValidation][formControl], [serverValidation][ngModel]`

**Import:** `import {ServerValidationValidatorDirective} from '@anglr/error-handling';`

### Usage

```html
<form>
    <input formControlName="email"
           serverValidation />

    <input [formControl]="username"
           serverValidation="userName" />
</form>
```

### How Property Name Is Resolved

- When `formControlName` is available, its value is used as the server validation property name
- If no `formControlName` is available, you must specify the property name using the `serverValidation` attribute value
- Throws an error if neither `formControlName` nor explicit `serverValidation` value is provided

### How It Works

1. Registers itself as an `NG_VALIDATORS` provider on the host element
2. Subscribes to `ServerValidationService.serverValidationsChanged`
3. When server validation errors change and contain errors for this control's property name, triggers revalidation
4. The `validate` method returns the validation errors from `ServerValidationService` for the matched property, or `null` if no errors exist

### Validation Error Shape

When server validation errors are present for a control, the validator returns:

```typescript
{
    ...validationErrors,  // Keys from HttpClientPropertyValidationError
    actual: control.value // Current control value
}
```

### Complete Example

```typescript
import {Component, inject, Injector} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ServerValidationValidatorDirective, ServerValidationService, processHttpClientErrorResponse, catchHttpClientError} from '@anglr/error-handling';

@Component(
{
    selector: 'user-form',
    template: `
        <form [formGroup]="form" (ngSubmit)="submit()">
            <input formControlName="email" serverValidation />
            <input formControlName="name" serverValidation />
            <button type="submit">Save</button>
        </form>
    `,
    imports:
    [
        ReactiveFormsModule,
        ServerValidationValidatorDirective,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent
{
    private _httpClient: HttpClient = inject(HttpClient);

    private _injector: Injector = inject(Injector);

    private _serverValidation: ServerValidationService = inject(ServerValidationService);

    protected form: FormGroup = new FormGroup(
    {
        email: new FormControl(''),
        name: new FormControl(''),
    });

    protected submit(): void
    {
        this._serverValidation.clearServerValidationErrors();

        this._httpClient.post('/api/users', this.form.value)
            .pipe(
                processHttpClientErrorResponse({injector: this._injector}),
                catchHttpClientError({injector: this._injector}),
            )
            .subscribe();
    }
}
```

In this example, when the server returns a 400 response with validation errors mapped to property names `email` and `name`, those errors automatically appear on the corresponding form controls.
