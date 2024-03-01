import { Component, Input } from '@angular/core';
import { Subject, filter, from } from 'rxjs';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  @Input() title: string = 'Are you sure?';
  @Input() description?: string;
  @Input() confirmLabel: string = 'Yes';
  @Input() dismissLabel: string = 'No';

  // private readonly _unsubscribe$ = new Subject<void>();
  private readonly _confirmClick$ = new Subject<boolean>();

  ngOnDestroy() {
    // this._unsubscribe$.next();
    this._confirmClick$.unsubscribe();
  }

  get confirmClick$() {
    return from(this._confirmClick$).pipe(filter(Boolean))
  }

  handleOption(value: boolean) {
    this._confirmClick$.next(value);
  }
}
