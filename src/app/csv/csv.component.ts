import { Component } from '@angular/core';
import { CsvService } from '../csv.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-csv',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './csv.component.html',
  styleUrl: './csv.component.css'
})
export class CsvComponent {
  data: any[] = [];
  headers: string[] = [];
  newEntry: any = {};
  modifedEntry: any = {};
  originalFile: File | null = null;
  isAddEntryVisible: boolean = false;
  isDeleteModelVisible: boolean = false;
  isEditEntryVisible: boolean = false;
  isTableVisible: boolean = false;
  deleteIndex: number | null = null;
  editIndex: number | null = null;

  constructor(private csvService: CsvService) {}

  onFileChange(event: any): void {
    this.isTableVisible = true;
    const file: File = event.target.files[0];
    if (file) {
      this.originalFile = file;
      // console.log(this.originalFile.name);
      this.csvService.parseCsv(file).then(data => {
        this.data = data;
        this.headers = Object.keys(data[0]);
        this.resetNewEntry();
      })
    }
  }

  resetNewEntry(): void {
    this.newEntry = {};
    this.headers.forEach(header => {
      this.newEntry[header] = '';
    });
  }

  showDetails(row: any): void {
    console.log('Details:', row);
    // Implement logic to show details
    alert(`Date: ${row.date} \nJob Title: ${row.jobTitle} \nCompany: ${row.company} \nStatus: ${row.status}`)
  }

  showAddEntry(): void {
    this.isAddEntryVisible = true;
  }

  closeAddEntry(): void {
    this.isAddEntryVisible = false;
  }

  addEntry(): void {
    this.data.push({ ...this.newEntry });
    this.resetNewEntry();
    this.isAddEntryVisible = false;
  }

  editEntry(index: number, row: any): void {
    this.isEditEntryVisible = true;
    this.editIndex = index;
    
    // Clear existing properties in modified entry
    this.modifedEntry = {};

    // Dynamically copy properties from row to modified entry
    for (let key in row) {
      if (row.hasOwnProperty(key)) {
        this.modifedEntry[key] = row[key];
      }
    }

  }

  saveEntry(): void {
    if (this.editIndex !== null) {
      this.data[this.editIndex] = this.modifedEntry;
      this.isEditEntryVisible = false;
      this.editIndex = null;
    }
  }

  closeEditEntry(): void {
    this.isEditEntryVisible = false;
    this.editIndex = null;
  }
  
  confirmDelete(index: number): void {
    this.isDeleteModelVisible = true;
    this.deleteIndex = index;
  }

  closeDeleteModel(): void {
    this.isDeleteModelVisible = false;
    this.deleteIndex = null;
  }

  deleteEntry(): void {
    if (this.deleteIndex !== null) {
      this.data.splice(this.deleteIndex, 1);
      this.closeDeleteModel();
    }
  }

  saveCsv(): void {
    if (this.originalFile) {
      const csvContent = this.csvService.convertToCsv(this.data);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', this.originalFile.name);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No file has been uploaded.');
    }
    
  }

  closeCsv(): void {
    this.isTableVisible = false;
    this.originalFile = null;
  }
}
