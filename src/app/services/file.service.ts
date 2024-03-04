import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CardContent } from '@models/database.model';
import Papa from 'papaparse';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private sanitizer: DomSanitizer) {}

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

    const sanitizedDeck = this.sanitizer.sanitize(
      SecurityContext.HTML,
      stringifiedDeck
    );

    if (!sanitizedDeck) {
      console.warn("Could't proceed to sanitize");
      return;
    }

    try {
      // It's experimental, this API needs SSL though
      const newHandle = await window.showSaveFilePicker();
      // Not working on Safari yet
      const writableStream = await newHandle.createWritable();
      await writableStream.write(sanitizedDeck);
      await writableStream.close();
    } catch (err) {
      console.error(err);
      // Paste the text in a new tab as fallback
      alert(
        "This browser is not able to export files yet. Instead, I'll put them in a new tab ✨"
      );
      const tab = window.open('about:blank', '_blank');
      tab?.document.write('<pre>', sanitizedDeck, '</pre>');
      tab?.document.close();
    }
  }
}
