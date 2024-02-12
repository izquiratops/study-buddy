import { NgModule } from '@angular/core';
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

import { HomeService } from '@screens/home/home.service';
import { EditorService } from '@screens/editor/editor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditorComponent,
    CardEditDialogComponent,
    NavigatorBarComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
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
