import { FormArray, FormControl, FormGroup } from "@angular/forms"
import { FlashCard } from "@models/database.model"

export type DeckForm = FormGroup<CardForm>
export type CardForm = {
  idbKey: FormControl<number>,
  name: FormControl<string>,
  flashCards: FormArray<FormControl<FlashCard>>
}
