import { BehaviorSubject } from 'rxjs';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardForm } from '@models/editor.model';

@Component({
  selector: 'app-card-edit-field',
  templateUrl: './card-edit-field.component.html',
  styleUrl: './card-edit-field.component.css',
})
export class CardEditFieldComponent {
  // Form control
  @Input() cardForm: CardForm;
  @Input() name: string;
  // Message context
  @Input() label = '';
  @Input() placeholder = '';
  @Input() validationMessage = 'Empty field';
  // Form logic
  @Input() autoFocus = false;

  @ViewChild('field', { static: true })
  fieldRef: ElementRef<HTMLInputElement>;

  furiganaButtonDisabled = new BehaviorSubject(true);

  private fetchCurrentSelection(): [number | null, number | null] {
    const start = this.fieldRef.nativeElement.selectionStart;
    const end = this.fieldRef.nativeElement.selectionEnd;
    return [start, end];
  }

  // TODO: Move logic to a service
  private insertFurigana(
    currentValue: string,
    selectionStart: number,
    selectionEnd: number
  ): string {
    const selection = currentValue.substring(selectionStart, selectionEnd);
    const input = window.prompt(`Prompt the pronunciation of ${selection}`);
    if (!input) {
      throw Error('Input is empty');
    }

    const wrapperLeftSide = '<ruby>';
    const wrapperRightSide = `<rt>${input}</rt></ruby>`;

    const modifiedContent =
      currentValue.substring(0, selectionStart) +
      wrapperLeftSide +
      selection +
      wrapperRightSide +
      currentValue.substring(selectionEnd);

    return modifiedContent;
  }

  get isNotValid() {
    const formControl = this.cardForm.get(this.name) as FormControl<string>;
    return formControl.valid || formControl.pristine;
  }

  get previewContent() {
    return this.cardForm.get(this.name)?.value || this.placeholder;
  }

  ngOnInit() {
    if (this.autoFocus) {
      this.fieldRef.nativeElement.focus();
    }
  }

  handleFuriganaButton() {
    const [start, end] = this.fetchCurrentSelection();
    if (start === null || end === null) {
      console.warn('Selection is empty');
      return;
    }

    const formControl = this.cardForm.get(this.name) as FormControl<string>;
    try {
      const modifiedContent = this.insertFurigana(
        formControl.value,
        start,
        end
      );
      formControl.setValue(modifiedContent);
    } catch (err: any) {
      console.warn(err.message);
    }
  }

  onUserInput() {
    // Clicks on current selections are buggy. setTimeout force to wait the new values.
    setTimeout(() => {
      const [start, end] = this.fetchCurrentSelection();

      // Enable the button if the selection has at least one character
      this.furiganaButtonDisabled.next(start === end);
    }, 0);
  }
}
