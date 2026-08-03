export interface Post {
  id: string;
  title: string;
  description: string;
  /** ISO 8601 date string, e.g. '2026-07-21' */
  date: string;
  pdfUrl: string;
  contentUrl: string;
}
