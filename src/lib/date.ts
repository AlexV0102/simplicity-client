import type { DateTime } from '../api/types';

const formatDate = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month}:${day}:${year} ${hours}:${minutes}`;
};

const formatDateShort = (date: Date): string => {
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${month}:${day}:${year} ${hours}:${minutes}`;
};

export const parseDateTime = (dateTime: DateTime): Date => {
  return new Date(dateTime);
};

export const formatDateTime = (dateTime: DateTime): string => {
  const date = parseDateTime(dateTime);
  return formatDate(date);
};

export const formatDateTimeShort = (dateTime: DateTime): string => {
  const date = parseDateTime(dateTime);
  return formatDateShort(date);
};

