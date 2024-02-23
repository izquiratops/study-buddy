import { Routes } from '@angular/router';
import { HomeComponent } from './/screens/home/home.component';
import { EditorComponent } from './screens/editor/editor.component';
import { FeedComponent } from '@screens/feed/feed.component';
import { AboutComponent } from '@screens/about/about/about.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'editor', component: EditorComponent },
    { path: 'feed', component: FeedComponent },
    { path: 'about', component: AboutComponent },
    { path: '**', redirectTo: '/home' }
];
