export class JournalEntry {
  idJournal?: number;
  text: string;

  constructor(text: string, idJournal?: number) {
    this.text = text;
    this.idJournal = idJournal;
  }
}
  