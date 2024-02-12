import { Directive, ElementRef, Input, ViewChild } from '@angular/core';

@Directive({
  selector: '[appSetAutofocus]',
})
export class SetAutofocusDirective {
  @Input('open') isOpen: boolean | null;
  @ViewChild('frontElement') frontInputRef: ElementRef<HTMLInputElement>;

  constructor() { }

  ngOnChanges(changes: any) {
    if (changes['isOpen'].currentValue) {
      console.debug(this.frontInputRef);
      this.frontInputRef.nativeElement.focus();
    }
  }
}
