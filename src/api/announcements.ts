import type { Announcement } from '../types/announcement';

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Title 1',
    publicationDate: 'Aug 11, 2023 04:38',
    lastUpdate: 'Aug 11, 2023',
    categories: ['City'],
    content:
      'Content for Title 1 announcement. This is a detailed description of the first announcement.',
  },
  {
    id: '2',
    title: 'Title 2',
    publicationDate: 'Apr 19, 2023 05:14',
    lastUpdate: 'Apr 19, 2023',
    categories: ['City'],
    content:
      'Content for Title 2 announcement. This is a detailed description of the second announcement.',
  },
  {
    id: '3',
    title: 'Title 3',
    publicationDate: 'Mar 24, 2023 07:27',
    lastUpdate: 'Mar 24, 2023',
    categories: ['City'],
    content:
      'Content for Title 3 announcement. This is a detailed description of the third announcement.',
  },
  {
    id: '4',
    title: 'Title 4',
    publicationDate: 'Feb 15, 2023 09:45',
    lastUpdate: 'Feb 15, 2023',
    categories: ['City'],
    content:
      'Content for Title 4 announcement. This is a detailed description of the fourth announcement.',
  },
  {
    id: '5',
    title: 'Title 5',
    publicationDate: 'Jan 08, 2023 11:20',
    lastUpdate: 'Jan 08, 2023',
    categories: ['City'],
    content:
      'Content for Title 5 announcement. This is a detailed description of the fifth announcement.',
  },
  {
    id: '6',
    title: 'Title 6',
    publicationDate: 'Dec 20, 2022 14:30',
    lastUpdate: 'Dec 20, 2022',
    categories: ['City'],
    content:
      'Content for Title 6 announcement. This is a detailed description of the sixth announcement.',
  },
  {
    id: '7',
    title: 'Title 7',
    publicationDate: 'Nov 12, 2022 16:15',
    lastUpdate: 'Nov 12, 2022',
    categories: ['City'],
    content:
      'Content for Title 7 announcement. This is a detailed description of the seventh announcement.',
  },
  {
    id: '8',
    title: 'Title 8',
    publicationDate: 'Oct 05, 2022 08:50',
    lastUpdate: 'Oct 05, 2022',
    categories: ['City', 'Health'],
    content:
      'Content for Title 8 announcement. This is a detailed description of the eighth announcement.',
  },
  {
    id: '9',
    title: 'Title 9',
    publicationDate: 'Sep 18, 2022 10:25',
    lastUpdate: 'Sep 18, 2022',
    categories: ['City', 'Health'],
    content:
      'Content for Title 9 announcement. This is a detailed description of the ninth announcement.',
  },
  {
    id: '10',
    title: 'Title 10',
    publicationDate: 'Aug 30, 2022 13:40',
    lastUpdate: 'Aug 30, 2022',
    categories: ['City', 'Health'],
    content:
      'Content for Title 10 announcement. This is a detailed description of the tenth announcement.',
  },
];

export const getAnnouncements = async (): Promise<Announcement[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockAnnouncements]);
    }, 100);
  });
};

export const getAnnouncementById = async (id: string): Promise<Announcement | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const announcement = mockAnnouncements.find((a) => a.id === id);
      resolve(announcement || null);
    }, 100);
  });
};
