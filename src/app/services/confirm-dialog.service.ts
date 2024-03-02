import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ConfirmDialogComponent } from '@components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  // ❓ Reference to the Confirm dialog component
  confirmDialogRef?: ComponentRef<ConfirmDialogComponent>;
  // 📍 Component View reference. Take its value from AppComponent
  viewContainerRef: ViewContainerRef;

  constructor() {}

  showConfirmDialog() {
    this.confirmDialogRef = this.viewContainerRef.createComponent(
      ConfirmDialogComponent
    );

    return this.confirmDialogRef.instance;
  }
}
