import { Injectable } from '@angular/core';
import { CardContent } from '@models/database.model';
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

  async unparseCsv(input: CardContent[]) {
    const stringifiedDeck = Papa.unparse(input, {
      header: false,
      quotes: true,
    });

    try {
      // It's experimental, this API needs SSL though
      const newHandle = await window.showSaveFilePicker();
      // Not working on Safari yet
      const writableStream = await newHandle.createWritable();
      await writableStream.write(stringifiedDeck);
      await writableStream.close();
    } catch (err) {
      console.error(err);
      // Paste the text in a new tab as fallback
      alert(
        "This browser is not able to export files yet. Instead, I'll put them in a new tab ✨"
      );
      const tab = window.open('about:blank', '_blank');
      tab?.document.write('<pre>', stringifiedDeck, '</pre>');
      tab?.document.close();
    }
  }
}
