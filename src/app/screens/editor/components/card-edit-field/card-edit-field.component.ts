import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CardForm } from '@models/editor.model';
import { BehaviorSubject } from 'rxjs';

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
  @Input() validationMessage = 'Field not valid';
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

  private insertFurigana(
    currentValue: string,
    input: string,
    selectionStart: number,
    selectionEnd: number
  ): string {
    const wrapperLeftSide = '<ruby>';
    const wrapperRightSide = `<rt>${input}</rt></ruby>`;

    const modifiedContent =
      currentValue.substring(0, selectionStart) +
      wrapperLeftSide +
      currentValue.substring(selectionStart, selectionEnd) +
      wrapperRightSide +
      currentValue.substring(selectionEnd);

    return modifiedContent;
  }

  ngOnInit() {
    if (this.autoFocus) {
      this.fieldRef.nativeElement.focus();
    }
  }

  handleFuriganaButton() {
    const input = window.prompt('Insert furigana');
    if (!input) {
      console.warn('Input is empty');
      return;
    }

    const [start, end] = this.fetchCurrentSelection();
    if (start === null || end === null) {
      console.warn('Selection is empty');
      return;
    }

    const formControl = this.cardForm.get(this.name) as FormControl<string>;
    const modifiedContent = this.insertFurigana(
      formControl.value,
      input,
      start,
      end
    );

    formControl.setValue(modifiedContent);
  }

  onUserInput() {
    // Clicks on current selections are buggy. setTimeout force to wait the new values.
    setTimeout(() => {
      const [start, end] = this.fetchCurrentSelection();

      // Enable the button if the selection has at least one character
      this.furiganaButtonDisabled.next(start === end);
    }, 0);
  }

  onBlur() {
    // Ignore blur events if the button is already disabled
    if (this.furiganaButtonDisabled.getValue()) {
      return;
    }

    // Give a little moment to let the click handler be triggered before disabling the button
    setTimeout(() => {
      this.furiganaButtonDisabled.next(true);
    }, 100);
  }
}
