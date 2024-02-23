import { NgModule, isDevMode } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from '@screens/home/home.component';
import { DecksTableComponent } from '@screens/home/components/decks-table/decks-table.component';
import { EditorComponent } from '@screens/editor/editor.component';
import { FeedComponent } from '@screens/feed/feed.component';
import { AboutComponent } from '@screens/about/about/about.component';
import { CardEditDialogComponent } from '@screens/editor/components/card-edit-dialog/card-edit-dialog.component';
import { CardsTableComponent } from '@screens/editor/components/cards-table/cards-table.component';
import { NavigatorBarComponent } from '@components/navigator-bar/navigator-bar.component';

import { FilterCardsByTextPipe } from '@pipes/filterCardsByText.pipe';
import { FilterDecksByTextPipe } from '@pipes/filterDecksByText.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditorComponent,
    FeedComponent,
    AboutComponent,
    CardEditDialogComponent,
    NavigatorBarComponent,
    DecksTableComponent,
    CardsTableComponent,
    FilterCardsByTextPipe,
    FilterDecksByTextPipe,
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
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
