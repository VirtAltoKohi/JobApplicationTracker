import { Component } from '@angular/core';
import { CsvComponent } from '../csv/csv.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CsvComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  
}
