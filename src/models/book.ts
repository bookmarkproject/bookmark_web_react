export interface Book {
  id?: number;
  isbn: string;
  title: string;
  contents: string;
  author: string;
  rating?: number;
  page?: number;
  imageUrl: string;
  publisher: string;
  publishDate: string;
}
