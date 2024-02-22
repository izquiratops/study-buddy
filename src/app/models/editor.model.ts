import { FormArray, FormControl, FormGroup } from "@angular/forms"
import { Card } from "@models/database.model"

export type DeckForm = FormGroup<CardForm>
export type CardForm = {
  idbKey: FormControl<number>,
  name: FormControl<string>,
  cards: FormArray<FormControl<Card>>
}
