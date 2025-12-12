export type DateTime = string;

export type Announcement = {
  id: string;
  title: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  categories: string[];
  content?: string;
};

export type AnnouncementsConnection = {
  items: Announcement[];
  lastKey: string | null;
  hasMore: boolean;
};

export type DeleteResponse = {
  success: boolean;
};

export type CreateAnnouncementInput = {
  title: string;
  categories: string[];
  content?: string;
};

export type UpdateAnnouncementInput = {
  id: string;
  title?: string;
  categories?: string[];
  content?: string;
};

export type AnnouncementsQueryVariables = {
  limit?: number;
  lastKey?: string | null;
};

export type AnnouncementQueryVariables = {
  id: string;
};
