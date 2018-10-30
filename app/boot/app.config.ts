import {FactoryProvider, APP_INITIALIZER, ClassProvider, ValueProvider} from '@angular/core';
import {AuthenticationService, AUTH_INTERCEPTOR_PROVIDER, AUTH_INTERCEPTOR_CONFIG, AUTHENTICATION_SERVICE_OPTIONS, SUPPRESS_AUTH_INTERCEPTOR_PROVIDER} from '@ng/authentication';
import {PROGRESS_INTERCEPTOR_PROVIDER, GlobalizationService} from "@ng/common";
import {ERROR_RESPONSE_MAP_PROVIDER, REPORTING_EXCEPTION_HANDLER_PROVIDER, HttpErrorInterceptorOptions, HTTP_ERROR_INTERCEPTOR_PROVIDER, BadRequestDetail, HttpGatewayTimeoutInterceptorOptions, NoConnectionInterceptorOptions, HTTP_GATEWAY_TIMEOUT_INTERCEPTOR_PROVIDER, NO_CONNECTION_INTERCEPTOR_PROVIDER} from '@ng/error-handling';
import {NO_DATA_RENDERER_OPTIONS, NoDataRendererOptions} from '@ng/grid';
import * as scrollmagic from 'scrollmagic';
import * as config from 'config/global';
// import 'ScrollMagic/scrollmagic/uncompressed/plugins/debug.addIndicators';

import {AuthConfig} from '../services/api/account/authConfig';
import {AccountService} from '../services/api/account/account.service';
import {GlobalizationService as GlobalizationServiceImpl} from '../services/globalization/globalization.service';

/**
 * Creates APP initialization factory, that first try to authorize user before doing anything else
 * @param authService Authentication service used for authentication of user
 */
export function appInitializerFactory(authService: AuthenticationService<any>)
{
    return () =>
    {
        return new Promise(success =>
        {
            authService
                .getUserIdentity()
                .then(() => success())
                .catch(reason => alert(`Authentication failed: ${reason}`));
        });
    };
}

/**
 * Factory for HttpErrorInterceptorOptions
 */
export function httpErrorInterceptorOptionsFactory()
{
    return new HttpErrorInterceptorOptions(config.debug);
}

/**
 * Response mapping function
 */
export function httpErrorInterceptorMappingFunction(err: any) : BadRequestDetail
{
    let result =
    {
        errors: [],
        validationErrors: {}
    };

    if(err && err.message)
    {
        result.errors.push(err.message);
    }

    if(err && err.errors && Array.isArray(err.errors))
    {
        (<Array<any>>err.errors).forEach(itm =>
        {
            let message = "";

            if(itm.defaultMessage)
            {
                message += itm.defaultMessage;
            }

            if(itm.code)
            {
                message = `${itm.code}: ${message}`;
            }

            if(message)
            {
                result.errors.push(message);
            }
        });
    }

    return result;
}

/**
 * Factory method for creating scrollmagic controller
 */
export function scrollMagicControllerFactory()
{
    return new scrollmagic.Controller(
    {
        globalSceneOptions:
        {
            triggerHook: "onLeave"
        }
        // addIndicators: true
    });
}

/**
 * Factory method for creating HttpGatewayTimeoutInterceptorOptions
 */
export function httpGatewayTimeoutInterceptorOptionsFactory()
{
    return new HttpGatewayTimeoutInterceptorOptions("Server neodpovedal v stanovenom čase.");
}

/**
 * Factory method for creating NoConnectionInterceptorOptions
 */
export function noConnectionInterceptorOptionsFactory()
{
    return new NoConnectionInterceptorOptions("Server je mimo prevádzky. Budete presmerovaní na domovskú stránku Asseco Central Europe.");
}

/**
 * Array of providers that are used in app module
 */
export var providers =
[
    //######################### HTTP INTERCEPTORS #########################
    HTTP_GATEWAY_TIMEOUT_INTERCEPTOR_PROVIDER,
    HTTP_ERROR_INTERCEPTOR_PROVIDER,
    NO_CONNECTION_INTERCEPTOR_PROVIDER,
    SUPPRESS_AUTH_INTERCEPTOR_PROVIDER,
    AUTH_INTERCEPTOR_PROVIDER,
    PROGRESS_INTERCEPTOR_PROVIDER,

    //######################### NO CONNECTION INTERCEPTOR OPTIONS #########################
    <FactoryProvider>
    {
        useFactory: noConnectionInterceptorOptionsFactory,
        provide: NoConnectionInterceptorOptions
    },

    //######################### HTTP GATEWAY TIMEOUT INTERCEPTOR OPTIONS #########################
    <FactoryProvider>
    {
        useFactory: httpGatewayTimeoutInterceptorOptionsFactory,
        provide: HttpGatewayTimeoutInterceptorOptions
    },

    //######################### AUTH INTERCEPTOR OPTIONS #########################
    <ClassProvider>
    {
        provide: AUTH_INTERCEPTOR_CONFIG,
        useClass: AuthConfig
    },

    //######################### GLOBALIZATION SERVICE #########################
    <ClassProvider>
    {
        provide: GlobalizationService,
        useClass: GlobalizationServiceImpl
    },

    //######################### AUTHENTICATION & AUTHORIZATION #########################
    <ClassProvider>
    {
        provide: AUTHENTICATION_SERVICE_OPTIONS,
        useClass: AccountService
    },

    //######################### ERROR HANDLING #########################
    <FactoryProvider>
    {
        provide: HttpErrorInterceptorOptions,
        useFactory: httpErrorInterceptorOptionsFactory
    },
    REPORTING_EXCEPTION_HANDLER_PROVIDER,

    <ValueProvider>
    {
        provide: ERROR_RESPONSE_MAP_PROVIDER,
        useValue: httpErrorInterceptorMappingFunction
    },

    //######################### APP INITIALIZER #########################
    <FactoryProvider>
    {
        useFactory: appInitializerFactory,
        provide: APP_INITIALIZER,
        deps: [AuthenticationService],
        multi: true
    },

    //######################### GRID GLOBAL OPTIONS #########################
    <ValueProvider>
    {
        provide: NO_DATA_RENDERER_OPTIONS,
        useValue: <NoDataRendererOptions<any>>
        {
            text: "Neboli nájdené dáta odpovedajúce zadaným parametrom"
        }
    }
];
