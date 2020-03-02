import {FactoryProvider, APP_INITIALIZER, ClassProvider, ValueProvider} from '@angular/core';
import {AuthenticationService, AUTH_INTERCEPTOR_PROVIDER, AUTH_INTERCEPTOR_CONFIG, AUTHENTICATION_SERVICE_OPTIONS, SUPPRESS_AUTH_INTERCEPTOR_PROVIDER} from '@anglr/authentication';
import {LocalPermanentStorageService} from '@anglr/common/store';
import {PROGRESS_INTERCEPTOR_PROVIDER, GlobalizationService, STRING_LOCALIZATION, PERMANENT_STORAGE, DebugDataEnabledService} from "@anglr/common";
import {ConsoleSinkConfigService} from '@anglr/common/structured-log';
import {NgxTranslateStringLocalizationService} from "@anglr/translate-extensions";
import {ERROR_RESPONSE_MAP_PROVIDER, REPORTING_EXCEPTION_HANDLER_PROVIDER, HttpErrorInterceptorOptions, HTTP_ERROR_INTERCEPTOR_PROVIDER, BadRequestDetail, HttpGatewayTimeoutInterceptorOptions, NoConnectionInterceptorOptions, HTTP_GATEWAY_TIMEOUT_INTERCEPTOR_PROVIDER, NO_CONNECTION_INTERCEPTOR_PROVIDER, SERVICE_UNAVAILABLE_INTERCEPTOR_PROVIDER} from '@anglr/error-handling';
import {NO_DATA_RENDERER_OPTIONS, NoDataRendererOptions, PAGING_OPTIONS, BasicPagingOptions} from '@anglr/grid';
import {NORMAL_STATE_OPTIONS, NormalStateOptions} from '@anglr/select';
import {LogEventLevel} from 'structured-log';
import * as config from 'config/global';

import {AuthConfig} from '../services/api/account/authConfig';
import {AccountService} from '../services/api/account/account.service';
import {GlobalizationService as GlobalizationServiceImpl} from '../services/globalization/globalization.service';
import {NOTHING_SELECTED} from '../misc/constants';
import {SettingsService, LocalSettingsStorage} from '../services/settings';
import {SETTINGS_STORAGE} from '../misc/tokens';

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
    return new HttpErrorInterceptorOptions(config.configuration.debug);
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
    return new NoConnectionInterceptorOptions("Server je mimo prevádzky.");
}

/**
 * Array of providers that are used in app module
 */
export var providers =
[
    //######################### HTTP INTERCEPTORS #########################
    HTTP_GATEWAY_TIMEOUT_INTERCEPTOR_PROVIDER,
    SERVICE_UNAVAILABLE_INTERCEPTOR_PROVIDER,
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
    },
    <ValueProvider>
    {
        provide: PAGING_OPTIONS,
        useValue: <BasicPagingOptions>
        {
            itemsPerPageValues: [15, 30, 60],
            initialItemsPerPage: 15
        }
    },
    
    //############################ SELECT GLOBAL OPTIONS ############################
    <ValueProvider>
    {
        provide: NORMAL_STATE_OPTIONS,
        useValue: <NormalStateOptions<any>>
        {
            texts:
            {
                nothingSelected: NOTHING_SELECTED
            }
        }
    },

    //######################### STRING LOCALIZATION #########################
    <ClassProvider>
    {
        provide: STRING_LOCALIZATION,
        useClass: NgxTranslateStringLocalizationService
    },

    //######################### PERMANENT STORAGE #########################
    <ClassProvider>
    {
        provide: PERMANENT_STORAGE,
        useClass: LocalPermanentStorageService
    },

    //######################### LOGGER #########################
    <FactoryProvider>
    {
        provide: ConsoleSinkConfigService,
        useFactory: (settingsSvc: SettingsService) =>
        {
            return new ConsoleSinkConfigService(null, LogEventLevel[settingsSvc?.settingsLogging?.consoleLogLevel]);
        },
        deps: [SettingsService]
    },
    <ClassProvider>
    {
        provide: SETTINGS_STORAGE,
        useClass: LocalSettingsStorage
    },

    //######################### DEBUG DATA #########################
    <FactoryProvider>
    {
        provide: DebugDataEnabledService,
        useFactory: (settingsSvc: SettingsService) =>
        {
            let debugDataEnabled = new DebugDataEnabledService();

            debugDataEnabled.setEnabled(settingsSvc.settingsDebugging?.debugData);

            return debugDataEnabled;
        },
        deps: [SettingsService]
    }
];
