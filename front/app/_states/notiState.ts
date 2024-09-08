import { atom } from 'recoil';
import { INotification } from '@/app/_types/noti/Noti';

export const notificationsState = atom<INotification[]>({
  key: 'notificationsState',
  default: [],
});

export const eventSourceEnabledState = atom<boolean>({
  key: 'eventSourceEnabledState',
  default: false,
});
