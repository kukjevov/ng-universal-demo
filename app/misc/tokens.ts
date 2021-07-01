import {InjectionToken} from '@angular/core';

import {SettingsStorage} from '../services/settings';

/**
 * Token used for settings storage
 */
export const SETTINGS_STORAGE: InjectionToken<SettingsStorage> = new InjectionToken<SettingsStorage>('SETTINGS_STORAGE');