import {InjectionToken} from "@angular/core";
import {DynamicComponentRelationMetadata} from "../interfaces";

/**
 * Injection token used for injection array of DynamicComponentRelationMetadata for relation manager
 */
export const DYNAMIC_RELATIONS_METADATA: InjectionToken<DynamicComponentRelationMetadata[]> = new InjectionToken<DynamicComponentRelationMetadata[]>('DynamicComponentRelationMetadata', {providedIn: 'root', factory: () => []});