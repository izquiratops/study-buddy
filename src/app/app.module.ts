import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from '@screens/home/home.component';
import { EditorComponent } from '@screens/editor/editor.component';
import { CardEditDialogComponent } from '@screens/editor/components/card-edit-dialog/card-edit-dialog.component';
import { NavigatorBarComponent } from './components/navigator-bar/navigator-bar.component';
import { FilterByTextPipe } from './pipe/filterByText.pipe';

import { HomeService } from '@screens/home/home.service';
import { EditorService } from '@screens/editor/editor.service';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditorComponent,
    CardEditDialogComponent,
    NavigatorBarComponent,
    FilterByTextPipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ],
  providers: [
    HomeService,
    EditorService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
