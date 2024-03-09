import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Card } from '@models/database.model';

// Deck Forms
export type DeckForm = FormGroup<DeckFormProps>;
type DeckFormProps = {
  idbKey: FormControl<number>;
  name: FormControl<string>;
  cards: FormArray<FormControl<Card>>;
};

// Card Forms
export type CardForm = FormGroup<CardFormProps>;
type CardFormProps = {
  front: FormControl<string>;
  back: FormControl<string>;
};

// Theme
export type DataThemeValue = 'light' | 'dark';

// Navigation
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
