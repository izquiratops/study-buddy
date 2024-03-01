import { Injectable } from '@angular/core';
import Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor() {}

  parseCsv(input: File) {
    return new Promise((resolve, reject) => {
      Papa.parse(input, {
        worker: true,
        skipEmptyLines: true,
        complete: (results, file) => resolve(results),
        error: (error) => reject(error),
      });
    });
  }
}
