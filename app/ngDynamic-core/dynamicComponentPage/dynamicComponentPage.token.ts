import {InjectionToken} from "@angular/core";

/**
 * Injection token used for injection of url prefix for obtaining dynamic component metadata
 */
export const DYNAMIC_COMPONENT_PAGE_METADATA_URL: InjectionToken<string> = new InjectionToken<string>('DynamicComponentPageMetadataUrl', {providedIn: 'root', factory: () => 'api/dynamic/metadata'});

/**
 * Injection token used for injection of not found url for router
 */
export const NOT_FOUND_ROUTER_PATH: InjectionToken<string> = new InjectionToken<string>('NotFoundRouterPath', {providedIn: 'root', factory: () => '/notFound'});