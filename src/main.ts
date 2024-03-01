import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';

// Workaround to make the compiler happy with showSaveFilePicker()
declare global {
  interface Window {
    showSaveFilePicker: () => FileSystemFileHandle;
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
