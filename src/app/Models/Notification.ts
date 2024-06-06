export class Notification {
  Id!: number;
  content: string;
  categories: string[]; // Change to array type
  archive: boolean;
  subscription: boolean;

  constructor(
    Id: number,
    content: string,
    categories: string[],
    archive: boolean = false,
    subscription: boolean = false
  ) {
    this.Id = Id;
    this.content = content;
    this.categories = categories;
    this.archive = archive;
    this.subscription = subscription;
  }
}