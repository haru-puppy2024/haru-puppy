import dayjs from 'dayjs';

export const formatDateToYMD = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

export const formatDateToHM = (date: Date): string => {
  return dayjs(date).format('HH:mm');
};

export const formatTimeToHM = (time: string): string => {
  return time.substring(0, 5);
};

export const parseDateToYMD = (date: string): string => {
  return dayjs(date).format('YYYY-MM-DD');
};
