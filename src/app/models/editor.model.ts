import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Card } from '@models/database.model';

export type DeckForm = FormGroup<CardForm>;
export type CardForm = {
  idbKey: FormControl<number>;
  name: FormControl<string>;
  cards: FormArray<FormControl<Card>>;
};

export type DataThemeValue = 'light' | 'dark';

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
};
