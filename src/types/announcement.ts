export type DateTime = string;

export type Announcement = {
  id: string;
  title: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  categories: string[];
  content?: string;
};
