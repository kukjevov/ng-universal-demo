import {FactoryProvider, APP_INITIALIZER, ClassProvider, ValueProvider, Provider, ExistingProvider} from '@angular/core';
import {AuthenticationService, AUTH_INTERCEPTOR_PROVIDER, SUPPRESS_AUTH_INTERCEPTOR_PROVIDER, AuthenticationServiceOptions} from '@anglr/authentication';
import {LocalPermanentStorageService} from '@anglr/common/store';
import {PROGRESS_INTERCEPTOR_PROVIDER, GlobalizationService, STRING_LOCALIZATION, PERMANENT_STORAGE, DebugDataEnabledService, DEFAULT_NOTIFICATIONS, NOTIFICATIONS} from '@anglr/common';
import {ConsoleSinkConfigService, LOGGER_REST_CLIENT, REST_SINK} from '@anglr/common/structured-log';
import {NgxTranslateStringLocalizationService} from '@anglr/translate-extensions';
import {ERROR_HANDLING_NOTIFICATIONS, ERROR_RESPONSE_MAP_PROVIDER, HttpErrorInterceptorOptions, HTTP_ERROR_INTERCEPTOR_PROVIDER, BadRequestDetail, HttpGatewayTimeoutInterceptorOptions, NoConnectionInterceptorOptions, HTTP_GATEWAY_TIMEOUT_INTERCEPTOR_PROVIDER, NO_CONNECTION_INTERCEPTOR_PROVIDER, SERVICE_UNAVAILABLE_INTERCEPTOR_PROVIDER, ANGLR_EXCEPTION_HANDLER_PROVIDER, ERROR_WITH_URL_EXTENDER} from '@anglr/error-handling';
import {DIALOG_INTERNAL_SERVER_ERROR_RENDERER_PROVIDER} from '@anglr/error-handling/material';
import {NO_DATA_RENDERER_OPTIONS, NoDataRendererOptions, PAGING_OPTIONS, BasicPagingOptions, METADATA_SELECTOR_TYPE, METADATA_SELECTOR_OPTIONS, CONTENT_RENDERER_OPTIONS, TableContentRendererOptions, HEADER_CONTENT_RENDERER_OPTIONS, TableHeaderContentRendererOptions, GRID_INITIALIZER_TYPE, QueryPermanentStorageGridInitializerComponent, GRID_INITIALIZER_OPTIONS, QueryPermanentStorageGridInitializerOptions} from '@anglr/grid';
import {DialogMetadataSelectorComponent, DialogMetadataSelectorOptions} from '@anglr/grid/material';
import {VALIDATION_ERROR_MESSAGES} from '@anglr/common/forms';
import {TooltipOptions, TOOLTIP_OPTIONS} from '@anglr/common/positions';
import {ConfirmationDialogOptions, CONFIRMATION_DIALOG_OPTIONS} from '@anglr/common/material';
import {FLOATING_UI_POSITION} from '@anglr/common/floating-ui';
import {MD_HELP_NOTIFICATIONS} from '@anglr/md-help/web';
import {NORMAL_STATE_OPTIONS, NormalStateOptions} from '@anglr/select';
import {DATE_FNS_REST_DATE_API} from '@anglr/rest/date-fns';
import {DATE_API} from '@anglr/datetime';
import {DateFnsDateApi, DateFnsLocale, DATEFNS_FORMAT_PROVIDER, DATE_FNS_LOCALE} from '@anglr/datetime/date-fns';
import {sk} from 'date-fns/locale';
import {LogEventLevel} from 'structured-log';

import {config} from '../config';
import {GlobalizationService as GlobalizationServiceImpl} from '../services/globalization/globalization.service';
import {NOTHING_SELECTED} from '../misc/constants';
import {SettingsService, LocalSettingsStorage} from '../services/settings';
import {SETTINGS_STORAGE} from '../misc/tokens';
import {RestLoggerService} from '../services/api/restLogger';
import {AccountAuthOptions} from '../services/api/account/accountAuth.options';

/**
 * Creates APP initialization factory, that first try to authorize user before doing anything else
 * @param authService Authentication service used for authentication of user
 */
export function appInitializerFactory(authService: AuthenticationService<any>): () => Promise<void>
{
    return async () =>
    {
        try
        {
            await authService
                .getUserIdentity();
        }
        catch(e)
        {
            alert(`Authentication failed: ${e}`);

            throw e;
        }
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
    const result =
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
            let message = '';

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
    return new HttpGatewayTimeoutInterceptorOptions('Server neodpovedal v stanovenom čase.');
}

/**
 * Factory method for creating NoConnectionInterceptorOptions
 */
export function noConnectionInterceptorOptionsFactory()
{
    return new NoConnectionInterceptorOptions('Server je mimo prevádzky.');
}

/**
 * Array of providers that are used in app module
 */
export const providers: Provider[] =
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

    //######################### GLOBALIZATION SERVICE #########################
    <ClassProvider>
    {
        provide: GlobalizationService,
        useClass: GlobalizationServiceImpl
    },

    //######################### AUTHENTICATION & AUTHORIZATION #########################
    <ClassProvider>
    {
        provide: AuthenticationServiceOptions,
        useClass: AccountAuthOptions
    },

    //######################### ERROR HANDLING #########################
    <FactoryProvider>
    {
        provide: HttpErrorInterceptorOptions,
        useFactory: httpErrorInterceptorOptionsFactory
    },
    ERROR_WITH_URL_EXTENDER,
    ANGLR_EXCEPTION_HANDLER_PROVIDER,
    DIALOG_INTERNAL_SERVER_ERROR_RENDERER_PROVIDER,

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
        useValue: <NoDataRendererOptions>
        {
            texts:
            {
                loading: 'Nahrávam dáta ...',
                noData: 'Neboli nájdené dáta odpovedajúce zadaným parametrom',
                notLoaded: 'Neboli načítané žiadne dáta zatiaľ'
            }
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
    <ValueProvider>
    {
        provide: METADATA_SELECTOR_TYPE,
        useValue: DialogMetadataSelectorComponent
    },
    <ValueProvider>
    {
        provide: METADATA_SELECTOR_OPTIONS,
        useValue: <DialogMetadataSelectorOptions>
        {
            showButtonVisible: false
        }
    },
    <ValueProvider>
    {
        provide: GRID_INITIALIZER_TYPE,
        useValue: QueryPermanentStorageGridInitializerComponent
    },
    <ValueProvider>
    {
        provide: GRID_INITIALIZER_OPTIONS,
        useValue: <QueryPermanentStorageGridInitializerOptions>
        {
            storageIppName: 'all-grid-ipp'
        }
    },
    <ValueProvider>
    {
        provide: CONTENT_RENDERER_OPTIONS,
        useValue: <TableContentRendererOptions>
        {
            cssClasses:
            {
                containerDiv: 'table-container thin-scrollbar'
            }
        }
    },
    <ValueProvider>
    {
        provide: HEADER_CONTENT_RENDERER_OPTIONS,
        useValue: <TableHeaderContentRendererOptions>
        {
            cssClasses:
            {
                thDefault: 'header-default fixed-header'
            }
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
    REST_SINK,
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
        provide: LOGGER_REST_CLIENT,
        useClass: RestLoggerService
    },
    <ClassProvider>
    {
        provide: SETTINGS_STORAGE,
        useClass: LocalSettingsStorage
    },

    //######################### REST #########################
    DATE_FNS_REST_DATE_API,

    //######################### DEBUG DATA #########################
    <FactoryProvider>
    {
        provide: DebugDataEnabledService,
        useFactory: (settingsSvc: SettingsService) =>
        {
            const debugDataEnabled = new DebugDataEnabledService();

            debugDataEnabled.setEnabled(settingsSvc.settingsDebugging?.debugData);

            return debugDataEnabled;
        },
        deps: [SettingsService]
    },

    //######################### DATE API #########################
    <ClassProvider>
    {
        provide: DATE_API,
        useClass: DateFnsDateApi
    },
    DATEFNS_FORMAT_PROVIDER,
    <ValueProvider>
    {
        provide: DATE_FNS_LOCALE,
        useValue: <DateFnsLocale>
        {
            locale: sk
        }
    },

    //######################### VALIDATION ERRORS #########################

    <ValueProvider>
    {
        provide: VALIDATION_ERROR_MESSAGES,
        useValue:
        {
            required: 'Položka je povinná.',
            number: 'Položka musí byť číslo.',
            pattern: 'Položka nie je v požadovanom formáte.',
            minValue: 'Nedodržaná minimálna povolená hodnota.',
            maxValue: 'Nedodržaná maximálna povolená hodnota.',
            minlength: 'Nedodržaná minimálna dĺžka.',
            maxlength: 'Nedodržaná maximálna dĺžka.',
            birthNumber: 'Nesprávny formát rodného čísla.',
            email: 'Položka musí byť email.',
            availableUsername: 'Prihlasovacie meno je použité',
        }
    },

    //######################### NOTIFICATIONS #########################
    DEFAULT_NOTIFICATIONS,
    <ExistingProvider>
    {
        provide: MD_HELP_NOTIFICATIONS,
        useExisting: NOTIFICATIONS
    },
    <ExistingProvider>
    {
        provide: ERROR_HANDLING_NOTIFICATIONS,
        useExisting: NOTIFICATIONS
    },

    //######################### TOOLTIP #########################
    <ValueProvider>
    {
        provide: TOOLTIP_OPTIONS,
        useValue: <TooltipOptions>
        {
            fixedPosition: true
        }
    },
    
    //######################### CONFIRMATION DIALOG #########################
    <ValueProvider>
    {
        provide: CONFIRMATION_DIALOG_OPTIONS,
        useValue: <ConfirmationDialogOptions>
        {
            confirmationText: 'Prajete si pokračovať?',
            dialogCancelText: 'Nie',
            dialogConfirmText: 'Áno'
        }
    },

    //######################### POSITION #########################
    FLOATING_UI_POSITION,
];
