export type NavigatorAction = NavigatorActionLink | NavigatorActionMethod;

export type NavigatorActionMethod = NavigatorActionBase & {
  type: 'Method';
  callback: Function;
};

export type NavigatorActionLink = NavigatorActionBase & {
  type: 'Link';
  routerLink: string;
  queryParams?: Object;
  callback?: Function;
};

export type NavigatorActionBase = {
  label: string;
  class?: string;
  hidden?: boolean;
};

export type DataThemeValue = 'light' | 'dark';

export const ThemeColorKeys = [
  'Red',
  'Pink',
  'Fuchsia',
  'Purple',
  'Violet',
  'Indigo',
  'Blue',
  'Azure',
  'Cyan',
  'Jade',
  'Green',
  'Yellow',
  'Amber',
  'Pumpkin',
  'Orange',
] as const;

export type ThemeColorKey = (typeof ThemeColorKeys)[number];
