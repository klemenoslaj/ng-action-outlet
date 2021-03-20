import { InjectionToken } from '@angular/core';

export enum ICON_TYPE {
  Font,
  Svg,
}

export const ACTION_ICON_TYPE_TOKEN = new InjectionToken<ICON_TYPE>('ACTION_ICON_TYPE_TOKEN');
