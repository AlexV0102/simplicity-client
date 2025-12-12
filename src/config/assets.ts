import editIcon from '@assets/icons/edit.icon.svg';
import announcementIcon from '@assets/icons/announcement.icon.svg';

export const icons = {
  edit: editIcon,
  announcement: announcementIcon,
} as const;

export type IconName = keyof typeof icons;
