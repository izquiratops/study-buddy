import { Component } from '@angular/core';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  providers: [StorageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  constructor(storageService: StorageService) {}

}
